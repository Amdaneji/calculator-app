# Calculator (Expo)

This is a small Expo React Native calculator app configured for Expo SDK 55 and ready to run on your phone via Expo Go.

## Quick start

Prerequisites:

- Node.js (18+ recommended)
- npm
- Expo Go on your phone

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Run Metro and open in Expo Go:

```bash
npx expo start --clear
```

Scan the QR code in the Expo devtools or open the project in Expo Go.

### Project layout

- `App.js` — main app UI and logic
- `babel.config.js` — configured with `babel-preset-expo` and private/class plugins
- `app.json` — Expo config
- `EXPO_SETUP.md` — device setup and troubleshooting notes

### CI

A basic GitHub Actions workflow is included at `.github/workflows/ci.yml` that verifies dependencies install and runs basic sanity checks.

### License

This repo includes an MIT license by default. Change or remove as you prefer.

### How to publish this repository (commands you can run locally)

If you have the GitHub CLI (`gh`) configured and want to push from here, provide confirmation and a repository name. Otherwise run:

```bash
git init
git branch -M main
git add .
git commit -m "chore: initial import — calculator app, CI, README"
# Create a repo on GitHub (replace USER/REPO)
gh repo create USER/REPO --public --source=. --remote=origin --push
# Or, if creating the repo manually, add the remote then push:
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

If you'd like, I can create the GitHub repo for you (requires `gh` or a personal access token). Tell me the repo name and whether it should be public.
