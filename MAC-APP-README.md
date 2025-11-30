# 🍎 Clinic CRM - Native macOS Application

## Quick Start (On Your Mac)

1. **Clone and Install:**
   ```bash
   git clone <your-repo-url>
   cd Claude
   npm install
   ```

2. **Build the App:**
   ```bash
   ./quick-build.sh
   ```

   OR manually:
   ```bash
   npm run electron:build
   ```

3. **Install:**
   - Open `release/Clinic CRM-1.0.0.dmg`
   - Drag to Applications folder
   - Done!

## What You Get

✅ **Standalone macOS App** - No browser, no terminal, no hassle
✅ **Offline-First** - Works without internet
✅ **Local Database** - SQLite stored on your Mac
✅ **Beautiful UI** - Exact design from your JSX file
✅ **Professional** - Native menu bar, window controls, etc.

## File Structure

```
Clinic CRM/
├── electron/
│   └── main.js           ← Electron main process (starts server & window)
├── src/
│   ├── App.jsx           ← Your React UI
│   └── main.jsx          ← React entry point
├── database/
│   ├── db.js             ← SQLite connection
│   └── schema.sql        ← Database schema
├── dist/                 ← Built React app (created on build)
├── release/              ← Built macOS app (created on build)
│   ├── *.dmg             ← Installer
│   └── mac/
│       └── Clinic CRM.app ← The actual application
├── BUILD-MAC-APP.md      ← Detailed build instructions
├── quick-build.sh        ← One-command build script
└── package.json          ← Dependencies & build config
```

## How It Works

1. **Electron** creates a native macOS window
2. **Express server** runs internally (localhost:5000)
3. **React app** loads inside the window (from dist/)
4. **SQLite database** stores all data locally
5. Everything bundled into one `.app` file!

## Data Storage

Your patient data is stored at:
```
~/Library/Application Support/Clinic CRM/clinic.db
```

**To backup:** Just copy this file!

## Development vs Production

### Development (Browser-based)
```bash
npm run dev:all
```
Opens in browser at http://localhost:3000

### Development (Electron App)
```bash
npm run electron:dev
```
Opens as native app with hot-reload

### Production (Build macOS App)
```bash
npm run electron:build
```
Creates distributable .dmg and .app

## First-Time macOS Security

Since the app is not signed with Apple Developer certificate:

1. **Right-click** the app
2. Select **"Open"**
3. Click **"Open"** in the security dialog
4. App will run and be trusted from now on

OR use terminal:
```bash
xattr -cr "/Applications/Clinic CRM.app"
```

## System Requirements

- macOS 10.14 (Mojave) or later
- 50 MB disk space
- No internet required (offline-first)

## Features

### ✅ Dashboard
- Today's visits and income
- Monthly summary with date filters
- Patient search
- Recent patients list

### ✅ Patient Management
- Register new patients
- Head of Family (HOF) support
- Family grouping
- Search and filter
- Edit/Delete patients

### ✅ Visit Management
- Add visits with prescriptions
- Track visit history
- Past illnesses tracking
- Fee tracking

### ✅ Family Features
- Link family members
- View family sidebar in patient files
- Track family visit history
- Filter patients by family

## Troubleshooting

### App Won't Open
```bash
# Remove quarantine attribute
xattr -cr "/Applications/Clinic CRM.app"
```

### Build Fails
```bash
# Clean and rebuild
rm -rf node_modules dist release
npm install
npm run electron:build
```

### Database Issues
```bash
# Reset database
rm ~/Library/Application\ Support/Clinic\ CRM/clinic.db
# App will create new database on next launch
```

## Distribution

### For Personal Use
- Just use the built app from `release/` folder
- Copy to Applications or use the .dmg

### For Friends/Colleagues
- Share the .dmg file
- They double-click to install
- First-time users: right-click → Open

### For Public Distribution
- Get Apple Developer account ($99/year)
- Sign the app with Developer ID
- Optionally notarize for Gatekeeper

## Customization

### Change App Name
Edit `package.json`:
```json
"productName": "Your Clinic Name"
```

### Add App Icon
1. Create 1024x1024 PNG
2. Convert to .icns (use cloudconvert.com)
3. Save as `build/icon.icns`
4. Rebuild

### Change Window Size
Edit `electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1600,  // ← Change this
  height: 1000  // ← And this
});
```

## Need Help?

See detailed instructions: **BUILD-MAC-APP.md**

Common commands:
```bash
npm run electron:dev      # Test the app
npm run electron:build    # Build for distribution
./quick-build.sh          # One-command build
```

---

**App Version:** 1.0.0
**Developer:** Dr Shah Asad Rasheed
**Tech Stack:** Electron + React + Express + SQLite
**License:** ISC

🎉 **Enjoy your standalone macOS clinic management system!**
