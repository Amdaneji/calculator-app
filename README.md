# Calculator App

![Expo](https://img.shields.io/badge/Expo-SDK%2055-000020?style=flat-square&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.83-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A polished, high-end calculator experience built with Expo and React Native. The interface is designed to feel refined, fast, and premium on a physical phone, with a clean layout and minimal distractions.

## What it does

- Precision arithmetic: add, subtract, multiply, divide
- Smooth decimal entry with backspace support
- Elegant mobile-first layout tuned for quick, comfortable use
- Expo Go ready for immediate testing on a physical device

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

## Get the actual app

You do not need the Play Store to share this app.

- **Fast testing**: Use Expo Go and scan the QR code from `npx expo start --clear`.
- **Download the app**: Get the latest Android APK from [Releases](https://github.com/Amdaneji/calculator-app/releases).
- **Install on Android**: Download the `.apk` file from Releases and open it on your phone.

### Build steps

Install EAS CLI if needed:

```bash
npm install -g eas-cli
```

Sign in and configure the project once:

```bash
eas login
eas build:configure
```

Create a downloadable Android build:

```bash
eas build -p android --profile preview
```

That produces an APK for sharing directly, or an installable build link that you can attach to a GitHub release.

See [RELEASE_GUIDE.md](RELEASE_GUIDE.md) for the full publishing workflow.

## Notes

The project is intentionally streamlined so it opens quickly and feels polished on a real device. If you want, I can next add screenshots, a changelog, or App Store-style store text.

## Changelog

### v1.1.0 — Live expression & operator preview

- Live expression display shows the full arithmetic expression as you type (e.g. `12 + 3`).
- Operator is shown immediately after selection so the user can confirm which operator is active.
- Minor UI tweaks to improve readability on small screens.

Download the latest APK from [Releases](https://github.com/Amdaneji/calculator-app/releases).
