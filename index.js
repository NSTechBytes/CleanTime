/*
 * Copyright (c) 2026 nstechbytes
 *
 * Licensed under the Apache License, Version 2.0.
 * You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { app, widgetWindow } from "novadesk";

const SCALE_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const THEME_OPTIONS = ["light", "dark"];
const STORAGE = {
  scale: "CleanTime.scale",
  theme: "CleanTime.theme",
  use24Hour: "CleanTime.use24Hour",
};

let scale = 1;
let theme = "dark";
let use24Hour = true;
let clockWindow = null;
let timer = null;

function loadSettings() {
  try {
    const storedScale = app.storage.get(STORAGE.scale, scale);
    const storedTheme = app.storage.get(STORAGE.theme, theme);
    const storedUse24Hour = app.storage.get(STORAGE.use24Hour, use24Hour);
    if (SCALE_OPTIONS.indexOf(storedScale) !== -1) scale = storedScale;
    if (THEME_OPTIONS.indexOf(storedTheme) !== -1) theme = storedTheme;
    if (typeof storedUse24Hour === "boolean") use24Hour = storedUse24Hour;
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
  const hours = now.getHours();
  const displayHours = use24Hour ? hours : hours % 12 || 12;
  return {
    time:
      String(displayHours).padStart(2, "0") +
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
    use24Hour: use24Hour,
    period: hours >= 12 ? "PM" : "AM",
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
  ipcMain.send("CleanTime.settings", {
    scale: scale,
    theme: theme,
    use24Hour: use24Hour,
  });
  publishClock();
}

function setTheme(value) {
  if (THEME_OPTIONS.indexOf(value) === -1) return;
  theme = value;
  save(STORAGE.theme, theme);
  clockWindow.setContextMenu(buildContextMenu());
  ipcMain.send("CleanTime.settings", {
    scale: scale,
    theme: theme,
    use24Hour: use24Hour,
  });
  publishClock();
}

function setTimeFormat(value) {
  if (typeof value !== "boolean") return;
  use24Hour = value;
  save(STORAGE.use24Hour, use24Hour);
  clockWindow.setContextMenu(buildContextMenu());
  ipcMain.send("CleanTime.settings", {
    scale: scale,
    theme: theme,
    use24Hour: use24Hour,
  });
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
    {
      text: "Time Format",
      items: [
        {
          text: "12 Hour",
          checked: !use24Hour,
          action: function () {
            setTimeFormat(false);
          },
        },
        {
          text: "24 Hour",
          checked: use24Hour,
          action: function () {
            setTimeFormat(true);
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
  return getClockData();
});

clockWindow = new widgetWindow({
  id: "CleanTime.Window",
  script: "ui/script.ui.js",
});
clockWindow.setContextMenu(buildContextMenu());

ipcMain.on("CleanTime.ready", function () {
  ipcMain.send("CleanTime.settings", {
    scale: scale,
    theme: theme,
    use24Hour: use24Hour,
  });
  publishClock();
});

timer = setInterval(publishClock, 1000);
clockWindow.on("close", function () {
  if (timer) clearInterval(timer);
  timer = null;
});
