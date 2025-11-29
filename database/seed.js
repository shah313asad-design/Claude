const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'clinic.db');
const db = new sqlite3.Database(dbPath);

console.log('Seeding database with sample data...');

db.serialize(() => {
  // Create tables first
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

  // Clear existing data
  db.run('DELETE FROM past_illnesses');
  db.run('DELETE FROM visits');
  db.run('DELETE FROM patients');

  // Family 1: Kumar Family (Rajpur Village)
  // Head of Family
  db.run(`
    INSERT INTO patients (name, father_or_husband_name, village_or_street, whatsapp_number,
                          is_head_of_family, relation_with_hof, age, gender)
    VALUES ('राजेश कुमार', 'रामप्रसाद', 'राजपुर गाँव', '9876543210', 1, 'self', 45, 'Male')
  `, function(err) {
    if (err) console.error(err);
    const rajeshId = this.lastID;

    // Wife
    db.run(`
      INSERT INTO patients (name, father_or_husband_name, village_or_street, whatsapp_number,
                            head_of_family_id, is_head_of_family, relation_with_hof, age, gender)
      VALUES ('सुनीता कुमार', 'राजेश कुमार', 'राजपुर गाँव', '9876543210', ?, 0, 'wife', 40, 'Female')
    `, [rajeshId]);

    // Son
    db.run(`
      INSERT INTO patients (name, father_or_husband_name, village_or_street, whatsapp_number,
                            head_of_family_id, is_head_of_family, relation_with_hof, age, gender)
      VALUES ('अमित कुमार', 'राजेश कुमार', 'राजपुर गाँव', '9876543210', ?, 0, 'son', 18, 'Male')
    `, [rajeshId]);

    // Daughter
    db.run(`
      INSERT INTO patients (name, father_or_husband_name, village_or_street, whatsapp_number,
                            head_of_family_id, is_head_of_family, relation_with_hof, age, gender)
      VALUES ('प्रिया कुमार', 'राजेश कुमार', 'राजपुर गाँव', '9876543210', ?, 0, 'daughter', 15, 'Female')
    `, [rajeshId]);

    // Add some visits for Rajesh
    db.run(`
      INSERT INTO visits (patient_id, visit_date, chief_complaint, past_history, prescription, fee_paid)
      VALUES (?, '2025-11-15', 'Fever and body ache for 3 days', 'Diabetes since 2020',
              'Tab Paracetamol 500mg TDS x 3 days\nTab Combiflam SOS\nRest and fluids', 200)
    `, [rajeshId], function(err) {
      if (err) console.error(err);
      // Add past illness
      db.run(`
        INSERT INTO past_illnesses (patient_id, illness_name, first_occurrence_date, visit_id)
        VALUES (?, 'Fever', '2025-11-15', ?)
      `, [rajeshId, this.lastID]);
    });

    db.run(`
      INSERT INTO visits (patient_id, visit_date, chief_complaint, past_history, prescription, fee_paid)
      VALUES (?, '2025-11-28', 'Blood sugar check up', 'Diabetes since 2020',
              'Continue Tab Metformin 500mg BD\nFasting Sugar: 125 mg/dL\nPP Sugar: 160 mg/dL', 300)
    `, [rajeshId], function(err) {
      if (err) console.error(err);
      db.run(`
        INSERT INTO past_illnesses (patient_id, illness_name, first_occurrence_date, visit_id)
        VALUES (?, 'Diabetes', '2025-11-28', ?)
      `, [rajeshId, this.lastID]);
    });
  });

  // Family 2: Sharma Family (Main Road, Near Temple)
  db.run(`
    INSERT INTO patients (name, father_or_husband_name, village_or_street, whatsapp_number,
                          is_head_of_family, relation_with_hof, age, gender)
    VALUES ('मोहन शर्मा', 'विश्वनाथ', 'मुख्य मार्ग, मंदिर के पास', '9123456789', 1, 'self', 52, 'Male')
  `, function(err) {
    if (err) console.error(err);
    const mohanId = this.lastID;

    // Wife
    db.run(`
      INSERT INTO patients (name, father_or_husband_name, village_or_street, whatsapp_number,
                            head_of_family_id, is_head_of_family, relation_with_hof, age, gender)
      VALUES ('रीता शर्मा', 'मोहन शर्मा', 'मुख्य मार्ग, मंदिर के पास', '9123456789', ?, 0, 'wife', 48, 'Female')
    `, [mohanId], function(err) {
      if (err) console.error(err);
      const ritaId = this.lastID;

      // Add visit for Rita
      db.run(`
        INSERT INTO visits (patient_id, visit_date, chief_complaint, past_history, prescription, fee_paid, investigations)
        VALUES (?, '2025-11-20', 'Joint pain in knees', 'Hypertension since 2018',
                'Tab Diclofenac 50mg BD x 5 days\nTab Calcium + Vit D OD\nKnee exercises advised', 250, 'X-Ray Knee - Normal')
      `, [ritaId], function(err) {
        if (err) console.error(err);
        db.run(`
          INSERT INTO past_illnesses (patient_id, illness_name, first_occurrence_date, visit_id)
          VALUES (?, 'Joint pain', '2025-11-20', ?)
        `, [ritaId, this.lastID]);
        db.run(`
          INSERT INTO past_illnesses (patient_id, illness_name, first_occurrence_date, visit_id)
          VALUES (?, 'Hypertension', '2025-11-20', ?)
        `, [ritaId, this.lastID]);
      });
    });

    // Mother
    db.run(`
      INSERT INTO patients (name, father_or_husband_name, village_or_street, whatsapp_number,
                            head_of_family_id, is_head_of_family, relation_with_hof, age, gender)
      VALUES ('गीता देवी', 'रामलाल', 'मुख्य मार्ग, मंदिर के पास', '9123456789', ?, 0, 'mother', 75, 'Female')
    `, [mohanId]);
  });

  // Family 3: Single patient - Ramesh (Different village)
  db.run(`
    INSERT INTO patients (name, father_or_husband_name, village_or_street, whatsapp_number,
                          is_head_of_family, relation_with_hof, age, gender)
    VALUES ('रमेश यादव', 'श्यामलाल', 'बसंतपुर गाँव', '9988776655', 1, 'self', 35, 'Male')
  `, function(err) {
    if (err) console.error(err);
    const rameshId = this.lastID;

    // Recent visit
    db.run(`
      INSERT INTO visits (patient_id, visit_date, chief_complaint, past_history, prescription, fee_paid)
      VALUES (?, '2025-11-29', 'Cough and cold for 5 days', 'No significant past history',
              'Tab Cetrizine 10mg OD x 5 days\nSyrup Cough (Chericof) 2 tsp TDS x 5 days\nSteam inhalation', 150)
    `, [rameshId], function(err) {
      if (err) console.error(err);
      db.run(`
        INSERT INTO past_illnesses (patient_id, illness_name, first_occurrence_date, visit_id)
        VALUES (?, 'Cough and cold', '2025-11-29', ?)
      `, [rameshId, this.lastID]);
    });
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('✓ Database seeded successfully with sample families!');
    console.log('✓ 3 families with multiple members created');
    console.log('✓ Sample visits and past illnesses added');
  }
});
