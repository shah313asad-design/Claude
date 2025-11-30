#!/bin/bash

echo "🏥 Clinic CRM - macOS App Builder"
echo "=================================="
echo ""

# Check if on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  Warning: This script should be run on macOS to build the Mac app."
    echo "   You can still proceed, but the final build may not work."
    echo ""
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Build React app
echo ""
echo "⚛️  Building React frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build React app"
    exit 1
fi

echo "✓ React app built"

# Build Electron app
echo ""
echo "🔨 Building macOS application..."
echo "   This may take 2-5 minutes..."
npm run electron:build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build Electron app"
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "📂 Your app is ready in the 'release' folder:"
echo "   - release/Clinic CRM-1.0.0.dmg (installer)"
echo "   - release/mac/Clinic CRM.app (application)"
echo ""
echo "🎉 To install: Double-click the .dmg file"
echo ""
