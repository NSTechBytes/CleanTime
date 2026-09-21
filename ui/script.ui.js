let currentScale = 1;
let currentTheme = "light";
let timeText = "08:04";
let dateText = "MON, SEP 21";

const THEME = {
  light: {
    background: "rgba(255,255,255,0)",
    time: "rgb(8,8,8)",
    date: "rgba(45,45,45,0.5)",
    shadow: "rgba(0,0,0,1)",
  },
  dark: {
    background: "rgba(20,20,22,0)",
    time: "rgb(245,245,245)",
    date: "rgba(207,207,211,0.5)",
    shadow: "rgba(0,0,0,1)",
  },
};

function render() {
  const s = currentScale;
  const colors = THEME[currentTheme];
  const width = Math.round(200 * s);
  const height = Math.round(115 * s);

  ui.beginUpdate();
  ["background", "time", "date"].forEach(function (id) {
    if (ui.isElementExist(id)) ui.removeElementById(id);
  });

  ui.addShape({
    id: "background",
    shapeType: "rectangle",
    x: 0,
    y: 0,
    width: width,
    height: height,
    fillColor: colors.background,
    strokeWidth: 0,
  });
  ui.addText({
    id: "time",
    x: width / 2,
    y: Math.round(29 * s),
    width: Math.round(310 * s),
    height: Math.round(112 * s),
    text: timeText,
    fontFace: "Segoe UI",
    fontSize: Math.round(79 * s),
    fontColor: colors.time,
    textAlign: "center-center",
    fontShadow: {
      x: 0,
      y: Math.max(2, Math.round(4 * s)),
      blur: Math.round(10 * s),
      color: colors.shadow,
    },
  });
  ui.addText({
    id: "date",
    x: width / 2,
    y: Math.round(100 * s),
    width: Math.round(220 * s),
    height: Math.round(32 * s),
    text: dateText,
    fontFace: "Segoe UI",
    fontSize: Math.round(16 * s),
    fontWeight: 400,
    fontColor: colors.date,
    letterSpacing: Math.max(1, Math.round(5 * s)),
    textAlign: "center-center",
  });
  ui.endUpdate();
}

function updateClock(data) {
  if (!data) return;
  const shouldRender =
    data.scale !== currentScale || data.theme !== currentTheme;
  if (typeof data.scale === "number") currentScale = data.scale;
  if (THEME[data.theme]) currentTheme = data.theme;
  if (typeof data.time === "string") timeText = data.time;
  if (typeof data.date === "string") dateText = data.date;

  if (shouldRender) {
    render();
    return;
  }
  ui.beginUpdate();
  ui.setElementProperties("time", { text: timeText });
  ui.setElementProperties("date", { text: dateText });
  ui.endUpdate();
}

// Read the persisted state before the first render. Unlike an event sent after
// creation, invoke returns immediately and cannot be missed by the UI script.
const startupSettings = ipcRenderer.invoke("CleanTime.getSettings");
if (startupSettings) {
  if (typeof startupSettings.scale === "number")
    currentScale = startupSettings.scale;
  if (THEME[startupSettings.theme]) currentTheme = startupSettings.theme;
}

render();
ipcRenderer.on("CleanTime.settings", function (event, settings) {
  if (!settings) return;
  if (typeof settings.scale === "number") currentScale = settings.scale;
  if (THEME[settings.theme]) currentTheme = settings.theme;
  render();
});
ipcRenderer.on("CleanTime.clock", function (event, data) {
  updateClock(data);
});
ipcRenderer.send("CleanTime.ready");
