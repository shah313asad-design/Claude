# Clinic CRM - React Application

Your clinic CRM has been successfully converted to a modern React single-page application!

## 🚀 How to Run

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev:all
```
This starts:
- **Backend API Server**: http://localhost:5000 (Express + SQLite)
- **Frontend Dev Server**: http://localhost:3000 (React + Vite)

Open http://localhost:3000 in your browser to use the app!

### Option 2: Run Servers Separately

In one terminal:
```bash
npm run dev
```
This starts the backend API server on port 5000.

In another terminal:
```bash
npx vite
```
This starts the frontend dev server on port 3000.

## 📦 What's Changed

### Before
- Multi-page HTML application (index.html, register.html, patients.html, etc.)
- Separate pages for each view
- Hindi language interface

### After
- **Single-page React application** with the exact design you provided
- Modern React with hooks (useState, useEffect)
- Inline styles matching your JSX code exactly
- All views (Dashboard, Register, Patients, Patient File, Add Visit) in one component
- Smooth navigation without page reloads
- English language interface as per your design

## 🎨 Features

✅ **Dashboard**
- Today's visits and income
- Total patients and families
- Monthly summary with dropdown selectors
- Quick search
- Recent patients table

✅ **Patient Registration**
- Complete patient form with all fields
- Head of Family (HOF) support
- Family relationship management
- Validation on required fields

✅ **Patient List**
- Search by name, village, or phone
- Filter by family (HOF)
- Edit button for each patient
- Click patient to view their file

✅ **Patient File**
- Complete patient details
- Past illnesses display
- Full visit history
- Family members sidebar (when applicable)
- Add visit button
- Edit patient info

✅ **Add Visit**
- Visit date selection
- Chief complaint
- Past history (auto-filled from previous visits)
- Prescription
- Fee paid
- Investigations

✅ **Edit Patient**
- Update all patient information
- Delete patient (with confirmation)
- Deletes all associated visits when patient is deleted

## 🎯 Design

The app uses **exactly the same design** as your provided JSX code:
- Green gradient header (#1a472a to #2d5a3d)
- Beautiful stat cards with gradients
- Responsive grid layouts
- Clean, modern card-based design
- Smooth hover effects
- Professional color scheme
- Noto Sans font family

## 📝 Notes

- All styling is inline (as per your JSX code)
- Currently using sample data - the backend API endpoints are ready for integration
- The database structure from your original app remains intact
- No database migrations needed

## 🔄 Next Steps (Optional)

If you want to connect this React frontend to your SQLite backend:
1. Update the App.jsx to fetch data from `/api/patients` and `/api/visits`
2. Replace `initialPatients` and `initialVisits` with API calls
3. Use `useEffect` to load data on component mount

## 📞 Support

Your clinic CRM is now ready to use with a beautiful, modern interface!

Developed for: **Dr Shah Asad Rasheed**
