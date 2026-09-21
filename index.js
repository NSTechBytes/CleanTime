import { app, widgetWindow } from "novadesk";

const SCALE_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const THEME_OPTIONS = ["light", "dark"];
const STORAGE = { scale: "CleanTime.scale", theme: "CleanTime.theme" };

let scale = 1;
let theme = "light";
let clockWindow = null;
let timer = null;

function loadSettings() {
  try {
    const storedScale = app.storage.get(STORAGE.scale, scale);
    const storedTheme = app.storage.get(STORAGE.theme, theme);
    if (SCALE_OPTIONS.indexOf(storedScale) !== -1) scale = storedScale;
    if (THEME_OPTIONS.indexOf(storedTheme) !== -1) theme = storedTheme;
  } catch (error) {
    console.log("CleanTime could not load its settings:", error);
  }
}

function save(key, value) {
  try {
    app.storage.set(key, value);
  } catch (error) {
    console.log("CleanTime could not save a setting:", error);
  }
}

function getClockData() {
  const now = new Date();
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  return {
    time:
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0"),
    date:
      weekdays[now.getDay()] +
      ", " +
      months[now.getMonth()] +
      " " +
      String(now.getDate()).padStart(2, "0"),
    scale: scale,
    theme: theme,
  };
}

function publishClock() {
  ipcMain.send("CleanTime.clock", getClockData());
}

function setScale(value) {
  if (SCALE_OPTIONS.indexOf(value) === -1) return;
  scale = value;
  save(STORAGE.scale, scale);
  clockWindow.setContextMenu(buildContextMenu());
  ipcMain.send("CleanTime.settings", { scale: scale, theme: theme });
  publishClock();
}

function setTheme(value) {
  if (THEME_OPTIONS.indexOf(value) === -1) return;
  theme = value;
  save(STORAGE.theme, theme);
  clockWindow.setContextMenu(buildContextMenu());
  ipcMain.send("CleanTime.settings", { scale: scale, theme: theme });
  publishClock();
}

function formatScale(value) {
  return value === 1 ? "1X" : String(value).replace(".0", "") + "X";
}

function buildContextMenu() {
  return [
    {
      text: "Scale",
      items: SCALE_OPTIONS.map(function (value) {
        return {
          text: formatScale(value),
          checked: scale === value,
          action: function () {
            setScale(value);
          },
        };
      }),
    },
    {
      text: "Theme",
      items: [
        {
          text: "Light",
          checked: theme === "light",
          action: function () {
            setTheme("light");
          },
        },
        {
          text: "Dark",
          checked: theme === "dark",
          action: function () {
            setTheme("dark");
          },
        },
      ],
    },
  ];
}

loadSettings();

// The UI requests this synchronously during startup, before it draws its first
// frame. This prevents the visible 1X-to-saved-scale jump after loading.
ipcMain.handle("CleanTime.getSettings", function () {
  return { scale: scale, theme: theme };
});

clockWindow = new widgetWindow({
  id: "CleanTime.Window",
  script: "ui/script.ui.js",
});
clockWindow.setContextMenu(buildContextMenu());

ipcMain.on("CleanTime.ready", function () {
  ipcMain.send("CleanTime.settings", { scale: scale, theme: theme });
  publishClock();
});

timer = setInterval(publishClock, 1000);
clockWindow.on("close", function () {
  if (timer) clearInterval(timer);
  timer = null;
});
