# Calculator App

![Expo](https://img.shields.io/badge/Expo-SDK%2055-000020?style=flat-square&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.83-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A clean, phone-ready calculator built with Expo and React Native. It is set up for quick testing in Expo Go and has the basic public-repo essentials in place: README, license, CI, and app branding.

## What it does

- Basic arithmetic: add, subtract, multiply, divide
- Decimal input and simple correction with backspace
- Mobile-first layout that fits nicely on a phone screen
- Expo Go friendly setup for fast testing on a physical device

## Quick start

Prerequisites:

- Node.js 18+
- npm
- Expo Go on your phone

Install and run:

```bash
npm install --legacy-peer-deps
npx expo start --clear
```

Scan the QR code in the Expo Dev Tools or open the app from Expo Go.

## Project files

- `App.js` — calculator UI and logic
- `app.json` — Expo app metadata and icon/splash configuration
- `babel.config.js` — Babel preset and private/class plugin setup
- `EXPO_SETUP.md` — phone setup and troubleshooting notes
- `.github/workflows/ci.yml` — GitHub Actions check workflow

## Repo status

- Public GitHub repository: `Amdaneji/calculator-app`
- License: MIT
- Expo SDK: 55

## Publishing commands

If you need to point another local clone at this repository:

```bash
git remote add origin https://github.com/Amdaneji/calculator-app.git
git branch -M main
git push -u origin main
```

## Notes

The project is intentionally lightweight so it can be opened, installed, and tested quickly on a real device. If you want, I can next add screenshots, a changelog, or App Store style store text.
