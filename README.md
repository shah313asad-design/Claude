# Clinic CRM - Offline-First Rural Clinic Management System

A simple, offline-first CRM system designed specifically for small rural clinics in India. Built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

- ✅ **Offline-First**: All data stored in SQLite database - works completely offline
- 👥 **Patient Management**: Register patients with family relationships
- 🏥 **Visit Tracking**: Record patient visits with prescriptions, complaints, and history
- 👨‍👩‍👧‍👦 **Family Management**: Link family members under Head of Family (HOF)
- 📱 **Mobile Responsive**: Touch-friendly interface for phones and tablets
- 🇮🇳 **Hindi Support**: Full UTF-8 support for Hindi names and content
- 🖨️ **Print Prescriptions**: Print-friendly prescription format
- 📊 **Dashboard**: Quick overview of patients and today's visits
- 🔍 **Smart Search**: Search by name, village, or WhatsApp number
- 📋 **Auto Past Illnesses**: Automatically tracks patient's medical history

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite (file-based, no server needed)
- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Storage**: Completely offline - no internet required

## Project Structure

```
clinic-crm/
├── server.js                 # Express server
├── package.json              # Dependencies
├── database/
│   ├── db.js                # Database connection and schema
│   ├── seed.js              # Sample seed data
│   └── clinic.db            # SQLite database (created automatically)
└── public/
    ├── index.html           # Dashboard
    ├── patients.html        # Patient list
    ├── patient-detail.html  # Patient file view
    ├── register.html        # Patient registration
    ├── visit.html           # Add new visit
    └── css/
        └── style.css        # Responsive styles
```

## Installation & Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `sqlite3` - SQLite database driver
- `body-parser` - Request body parsing
- `nodemon` - Development auto-reload (optional)

### Step 2: Initialize Database with Sample Data

```bash
npm run seed
```

This creates the database and adds sample data:
- 3 families with multiple members
- Sample visits and prescriptions
- Past illness records

### Step 3: Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### Step 4: Open in Browser

Open your web browser and go to:

```
http://localhost:3000
```

## Usage Guide

### 1. Dashboard
- View total patients and today's visits
- Quick search for patients
- See recently registered patients

### 2. Register New Patient

**Option A: Head of Family (HOF)**
1. Check "परिवार का मुखिया है" (Is Head of Family)
2. Fill in all patient details
3. Enter village/street information

**Option B: Family Member**
1. Leave "परिवार का मुखिया है" unchecked
2. Select existing HOF from dropdown
3. Village/street auto-fills from HOF
4. Select relationship with HOF
5. Fill remaining details

### 3. View Patient File
- Click on any patient from the list
- View patient details, family members, and past illnesses
- See complete visit history
- Click family members to view their files

### 4. Add Visit
1. Click "+ नई विज़िट जोड़ें" from patient file
2. Fill in:
   - Visit date (defaults to today)
   - Chief complaint (auto-extracts illnesses)
   - Past history (suggestions from previous visits)
   - Prescription
   - Investigations (optional)
   - Fee paid
3. Save visit

### 5. Print Prescription
- Click the printer icon (🖨️) on any visit
- Opens print-friendly prescription format
- Print or save as PDF

## Database Schema

### Patients Table
- Patient demographics
- Family relationship tracking
- Head of Family (HOF) linkage

### Visits Table
- Visit date and complaints
- Prescriptions and history
- Fee and investigations

### Past Illnesses Table
- Auto-populated from visits
- Tracks illness history
- Links to first occurrence

## Sample Data

The seed script includes:

**Family 1: राजेश कुमार (Rajpur Village)**
- राजेश कुमार (45M, HOF) - 2 visits
- सुनीता कुमार (40F, Wife)
- अमित कुमार (18M, Son)
- प्रिया कुमार (15F, Daughter)

**Family 2: मोहन शर्मा (Main Road)**
- मोहन शर्मा (52M, HOF)
- रीता शर्मा (48F, Wife) - 1 visit
- गीता देवी (75F, Mother)

**Family 3: रमेश यादव (Basantpur)**
- रमेश यादव (35M, HOF) - 1 visit

## API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Patients
- `GET /api/patients` - Get all patients (with optional search)
- `GET /api/patients/:id` - Get patient details with family & visits
- `GET /api/patients/hof/list` - Get all heads of family
- `GET /api/patients/family/:hofId` - Get family members
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient

### Visits
- `POST /api/visits` - Create new visit
- `GET /api/visits/:id` - Get visit details

## Mobile Usage

The application is fully responsive and works great on mobile devices:

- Large touch-friendly buttons (minimum 44px height)
- Responsive layout that adapts to screen size
- Easy-to-read fonts and spacing
- Works in mobile browsers (Chrome, Firefox, Safari)

## Offline Operation

This CRM is designed to work completely offline:

- ✅ No internet connection required
- ✅ All data stored locally in SQLite
- ✅ Fast and reliable
- ✅ No external API calls
- ✅ No cloud dependencies

Perfect for rural areas with limited connectivity!

## Data Backup

Your data is stored in: `database/clinic.db`

**To backup your data:**
```bash
cp database/clinic.db database/clinic.db.backup
```

**To restore from backup:**
```bash
cp database/clinic.db.backup database/clinic.db
```

## Troubleshooting

### Database Issues
If you encounter database errors, you can reset by:
```bash
rm database/clinic.db
npm run seed
```

### Port Already in Use
If port 3000 is already in use, set a different port:
```bash
PORT=3001 npm start
```

### Module Not Found
Make sure you've installed dependencies:
```bash
npm install
```

## Customization

### Change Port
Edit `server.js` or set environment variable:
```bash
PORT=8080 npm start
```

### Add More Relationships
Edit the relationship dropdown in `register.html`:
```javascript
<option value="grandfather">दादा</option>
<option value="grandmother">दादी</option>
```

### Customize Clinic Name
Edit the header in HTML files:
```html
<h2>🏥 आपकी क्लिनिक का नाम</h2>
```

## Security Notes

- This is designed for local/offline use
- No authentication system included (assumes single-user)
- For multi-user setup, add authentication
- For internet deployment, add HTTPS and security middleware

## Future Enhancements

Possible improvements:
- [ ] SMS reminders via WhatsApp number
- [ ] Appointment scheduling
- [ ] Inventory management for medicines
- [ ] Reports and analytics
- [ ] Backup to cloud (optional)
- [ ] Multi-language support
- [ ] Photo upload for patient ID

## License

This project is open source and available for use in rural healthcare initiatives.

## Support

For issues or questions, please check:
- Database file exists: `database/clinic.db`
- All dependencies installed: `npm install`
- Correct Node.js version: `node --version` (>= 14)
- Server running: Check console for "Server running" message

## Credits

Built with ❤️ for rural healthcare workers in India.
