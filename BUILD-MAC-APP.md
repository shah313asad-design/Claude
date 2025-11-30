# 🍎 Building Clinic CRM as a macOS Application

Your Clinic CRM is now configured to be built as a **standalone macOS application**! Follow these simple steps to create the app on your Mac.

## ✅ What You'll Get

- **Standalone macOS app** - No browser needed!
- **Native menu bar and window**
- **Local SQLite database** - All data stored on your Mac
- **Installable .dmg file** - Easy to distribute and install
- **No internet required** - Works completely offline

## 🚀 Build Instructions (On Your Mac)

### Step 1: Clone/Pull the Repository

```bash
git pull origin claude/integrate-jsx-changes-01E5zGvm6j5PY1xg4rg6ShKE
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Electron and electron-builder.

### Step 3: Build the App

```bash
npm run electron:build
```

This command will:
1. Build the React frontend
2. Package everything into a macOS application
3. Create both a .dmg installer and .zip file
4. Output to the `release/` folder

### Step 4: Find Your App

After building (takes 2-5 minutes), you'll find:

```
release/
├── Clinic CRM-1.0.0.dmg        ← Double-click to install
├── Clinic CRM-1.0.0-mac.zip    ← Portable version
└── mac/
    └── Clinic CRM.app          ← The actual app
```

### Step 5: Install & Run

**Option 1: Install from DMG (Recommended)**
1. Double-click `Clinic CRM-1.0.0.dmg`
2. Drag "Clinic CRM" to Applications folder
3. Open from Applications or Spotlight (Cmd+Space → type "Clinic CRM")

**Option 2: Run Directly**
1. Go to `release/mac/`
2. Double-click `Clinic CRM.app`

## 🧪 Test Before Building

Want to test the Electron app before building?

```bash
npm run electron:dev
```

This runs the app in development mode with hot-reload.

## 🎨 Custom Icon (Optional)

To add a custom icon:

1. Create a 1024x1024 PNG image of your logo
2. Convert to .icns format:
   - Use an online converter (https://cloudconvert.com/png-to-icns)
   - Or use macOS Image2icon app
3. Save as `build/icon.icns`
4. Rebuild the app

## 📦 What's Included in the App

The packaged app includes:
- ✅ React frontend (your beautiful UI)
- ✅ Express backend server (runs internally)
- ✅ SQLite database (stored in app data folder)
- ✅ All patient and visit data
- ✅ Complete offline functionality

## 💾 Data Storage Location

Your database will be stored at:
```
~/Library/Application Support/Clinic CRM/clinic.db
```

To backup your data, just copy this file!

## 🔧 Troubleshooting

### "App is damaged and can't be opened"

This happens with unsigned apps. Fix it:

```bash
xattr -cr "/Applications/Clinic CRM.app"
```

Then try opening again.

### "App from unidentified developer"

1. Right-click the app
2. Select "Open"
3. Click "Open" in the dialog
4. App will open and be trusted

### Build Fails

Make sure you have:
- macOS 10.14 or later
- Xcode Command Line Tools: `xcode-select --install`
- Node.js 16 or later: `node --version`

## 📋 Build Configuration

The build is configured in `package.json`:

```json
{
  "build": {
    "appId": "com.clinic.crm",
    "productName": "Clinic CRM",
    "mac": {
      "category": "public.app-category.medical",
      "target": ["dmg", "zip"]
    }
  }
}
```

## 🎯 Advanced Options

### Build Only .app (No DMG)

```bash
npm run electron:build -- --dir
```

### Build Universal App (Intel + Apple Silicon)

Edit `package.json`:

```json
"mac": {
  "target": {
    "target": "dmg",
    "arch": ["x64", "arm64", "universal"]
  }
}
```

### Sign the App (For Distribution)

1. Get Apple Developer account ($99/year)
2. Get Developer ID certificate
3. Add to build config:

```json
"mac": {
  "identity": "Developer ID Application: Your Name (TEAM_ID)",
  "hardenedRuntime": true,
  "entitlements": "build/entitlements.mac.plist"
}
```

## 📱 Distribution

### For Personal Use
- Just use the .dmg file from `release/` folder
- Or copy the .app to Applications

### For Others
- Share the .dmg file via email/cloud storage
- They double-click to install
- First-time users need to right-click → Open (security)

### For Public Distribution
- Need Apple Developer account
- Sign the app with Developer ID
- Optionally notarize with Apple

## 🆘 Need Help?

Common commands:

```bash
# Clean build
rm -rf dist release node_modules
npm install
npm run electron:build

# Test locally first
npm run electron:dev

# View build logs
npm run electron:build -- --verbose
```

## ✨ You're All Set!

Your Clinic CRM is ready to be a native macOS application. Just run `npm run electron:build` on your Mac and you'll have a distributable app in minutes!

---

**Built for:** Dr Shah Asad Rasheed
**App Version:** 1.0.0
**Electron Version:** 28.0+
