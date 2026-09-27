<h1 align="center">CleanTime</h1>

<p align="center">
  A clean, minimalist desktop clock with adjustable scale and light or dark themes for Novadesk.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows-0078D4?style=flat-square&logo=windows&logoColor=white" alt="Windows">
  <img src="https://img.shields.io/badge/Novadesk-widget%20package-4B8BBE?style=flat-square" alt="Novadesk widget package">
  <img src="https://img.shields.io/badge/version-1.0.0.0-2EA44F?style=flat-square" alt="Version 1.0.0.0">
  <img src="https://img.shields.io/badge/license-Apache--2.0-D22128?style=flat-square" alt="Apache 2.0 license">
</p>

<p align="center">
  <img src="https://res.cloudinary.com/i8b6ikc3/image/upload/v1790264582/zfjzk4hhfnkjjrpvm8xd.png" alt="CleanTime preview">
</p>

## About

**CleanTime** is a clean, minimalist digital clock widget built for [Novadesk](https://novadesk.pages.dev/). It shows the current time and date with a fully transparent background, large readable typography, and subtle drop shadows, designed to sit naturally over any desktop wallpaper.

The widget includes:

- **Large Digital Clock**: Displays hours and minutes in a bold, readable Segoe UI font scaled to your preference.
- **Abbreviated Date Line**: Shows the abbreviated weekday and month with the day number (e.g. MON, SEP 21).
- **12H / 24H Time Format**: Toggles between 12-hour format (with a smaller inline AM/PM label) and 24-hour format.
- **Light and Dark Themes**: Light mode uses near-black text for bright wallpapers; Dark mode uses soft white text for dark backgrounds. Both use a fully transparent background.
- **Adjustable UI Scaling**: Scales the widget from 0.75X up to 2X, resizing all text, shadows, and spacing proportionally.
- **Right-Click Context Menu**: Access all settings instantly by right-clicking on the widget.
- **Instant Startup Rendering**: Reads persisted settings synchronously before the first frame so there is no visible scale or theme jump on load.
- **Persistent Settings**: Scale, theme, and time format are saved automatically and restored on every launch.

## Requirements

- Windows 10 or later
- [Novadesk](https://novadesk.pages.dev/) (v0.9.11.0 or higher)

## Download

Download the latest widget package (`.ndpkg`) from the project releases:

[Download CleanTime_v1.0.ndpkg](https://github.com/NSTechBytes/CleanTime/releases)

Double-click the downloaded `.ndpkg` file to install it directly with Novadesk. Novadesk must be installed before opening the package.

## Run from source

Clone or download this folder, then start it through the Novadesk Widget Manager:

```powershell
cd D:\Novadesk-Project\CleanTime
nwm run
```

The project entry point is `index.js`. If your Novadesk executable is in a different location, use the Widget Manager configuration or start Novadesk with this file as its script.

## Settings

Right-click the widget to open the context menu and access the following options:

| Option | Values | Description |
|---|---|---|
| **Scale** | 0.75X, 1X, 1.25X, 1.5X, 1.75X, 2X | Resizes the widget and all its text proportionally |
| **Theme** | Light, Dark | Switches between near-black text and soft white text |
| **Time Format** | 12 Hour, 24 Hour | Toggles between 12H (with AM/PM) and 24H display |

All settings are saved automatically to Novadesk storage (`app.storage`) and restored the next time the widget launches.

## Patreon

If CleanTime is useful to you, supporting the project on [Patreon](https://patreon.com/cw/nstechbytes) helps cover the time spent maintaining widgets, adding new features, and testing new Novadesk releases. Support is optional, but it makes continued work on the project possible.

## License

CleanTime is licensed under the [Apache License 2.0](LICENSE).
