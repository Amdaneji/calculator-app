# Release Guide - Android APK

This guide walks through creating a release and sharing the Android APK on GitHub so users can download and install directly.

## Step 1: Build the Android APK

Run the EAS build command:

```bash
eas build -p android --profile preview
```

This creates a standalone APK. When the build completes, EAS will show a download link.

## Step 2: Download the APK

Copy the download link from the EAS output, or visit:

```
https://expo.dev/accounts/[your-account]/projects/[project-name]/builds
```

Download the `.apk` file to your computer.

## Step 3: Create a GitHub Release

1. Go to https://github.com/Amdaneji/calculator-app/releases
2. Click **Draft a new release**
3. Create a tag like `v1.0.0` or `v1.1.0`
4. Add a title: `Calculator App v1.0.0`
5. Add release notes describing changes
6. Drag and drop the downloaded `.apk` file into the release
7. Click **Publish release**

Users can now download the APK directly from the release page.

## Step 4: Share the Release Link

Send users to:

```
https://github.com/Amdaneji/calculator-app/releases
```

They can download the latest APK and install it on Android phones.

## Installing the APK on Android

Users need to:

1. Download the `.apk` file from the release
2. Open it on their Android phone
3. Tap "Install"
4. Grant permissions if prompted
5. App is ready to use

## Quick Commands (Next Time)

```bash
# Build
eas build -p android --profile preview

# Download and create release (repeat steps above)
```

That's it! No Play Store needed.
