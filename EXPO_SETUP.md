# Expo Setup Guide - Test on Your Phone

Follow these steps to test the calculator app on your physical phone:

## Step 1: Install Dependencies

Open terminal in this project folder and run:

```bash
npm install
```

This installs all required packages including Expo.

## Step 2: Download Expo Go App

Download the **Expo Go** app on your phone:

- **iOS**: Search "Expo Go" in App Store
- **Android**: Search "Expo Go" in Google Play Store

## Step 3: Start the Development Server

In your terminal, run:

```bash
npm start
```

You'll see output with a QR code in your terminal.

## Step 4: Scan QR Code

### On iOS:

1. Open Camera app
2. Point at the QR code shown in terminal
3. Tap the notification that appears
4. Opens Expo Go and loads the app

### On Android:

1. Open Expo Go app
2. Tap "Scan QR code"
3. Point at the QR code shown in terminal
4. App automatically loads

## What You'll See

✅ Calculator interface with dark theme
✅ All buttons working (numbers, operations, equals, clear, backspace)
✅ Live updates as you tap buttons

## Troubleshooting

**QR Code not working?**

- Make sure phone and computer are on the same WiFi network
- Try closing Expo Go and reopening it
- In terminal, try pressing `s` to show QR code again

**Slow to load?**

- Expo first-time builds take 30-60 seconds on initial connection
- Subsequent loads are faster
- Keep the terminal running

**Want to reload?**

- Press `r` in terminal to reload the app
- Or shake your phone and tap "Reload"

**Connection issues?**

- Try pressing `w` in terminal to test in web browser first
- Or use LAN connection by pressing `l` in terminal

## Keep Developing

Once connected, any changes you make to `App.js` will automatically refresh on your phone (hot reload)! Edit and test in real-time.

---

**Enjoy testing your calculator! 🎉**
