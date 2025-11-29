const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'clinic.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create Patients table
    db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        father_or_husband_name TEXT,
        village_or_street TEXT,
        whatsapp_number TEXT,
        head_of_family_id INTEGER,
        is_head_of_family BOOLEAN DEFAULT 0,
        relation_with_hof TEXT DEFAULT 'self',
        age INTEGER,
        gender TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (head_of_family_id) REFERENCES patients(id)
      )
    `);

    // Create Visits table
    db.run(`
      CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        visit_date DATE NOT NULL,
        chief_complaint TEXT,
        past_history TEXT,
        prescription TEXT,
        fee_paid REAL DEFAULT 0,
        investigations TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
      )
    `);

    // Create Past Illnesses table
    db.run(`
      CREATE TABLE IF NOT EXISTS past_illnesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        illness_name TEXT NOT NULL,
        first_occurrence_date DATE NOT NULL,
        visit_id INTEGER NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        FOREIGN KEY (visit_id) REFERENCES visits(id)
      )
    `);

    console.log('Database tables initialized');
  });
}

module.exports = db;
