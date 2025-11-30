const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ============= DASHBOARD ENDPOINTS =============

// Get dashboard statistics
app.get('/api/dashboard', (req, res) => {
  const stats = {};

  // Get total patients
  db.get('SELECT COUNT(*) as count FROM patients', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalPatients = row.count;

    // Get today's visits
    db.get(`SELECT COUNT(*) as count FROM visits WHERE DATE(visit_date) = DATE('now')`, (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.todayVisits = row.count;

      // Get recent patients (last 5)
      db.all(`
        SELECT p.*,
               (SELECT MAX(visit_date) FROM visits WHERE patient_id = p.id) as last_visit
        FROM patients p
        ORDER BY p.created_at DESC
        LIMIT 5
      `, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.recentPatients = rows;
        res.json(stats);
      });
    });
  });
});

// ============= PATIENT ENDPOINTS =============

// Get all patients
app.get('/api/patients', (req, res) => {
  const { search } = req.query;

  let query = 'SELECT * FROM patients';
  let params = [];

  if (search) {
    query += ` WHERE name LIKE ? OR village_or_street LIKE ? OR whatsapp_number LIKE ?`;
    const searchParam = `%${search}%`;
    params = [searchParam, searchParam, searchParam];
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get patient by ID with family members
app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM patients WHERE id = ?', [id], (err, patient) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get family members
    const familyQuery = patient.is_head_of_family
      ? 'SELECT * FROM patients WHERE head_of_family_id = ? OR id = ?'
      : 'SELECT * FROM patients WHERE head_of_family_id = ? OR id = ?';

    const hofId = patient.is_head_of_family ? patient.id : patient.head_of_family_id;

    db.all(familyQuery, [hofId, hofId], (err, familyMembers) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Get past illnesses
      db.all('SELECT * FROM past_illnesses WHERE patient_id = ? ORDER BY first_occurrence_date DESC',
        [id], (err, illnesses) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Get visits
          db.all('SELECT * FROM visits WHERE patient_id = ? ORDER BY visit_date DESC, created_at DESC',
            [id], (err, visits) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              res.json({
                patient,
                familyMembers: familyMembers || [],
                pastIllnesses: illnesses || [],
                visits: visits || []
              });
            });
        });
    });
  });
});

// Get all heads of family for dropdown
app.get('/api/patients/hof/list', (req, res) => {
  db.all('SELECT id, name, village_or_street FROM patients WHERE is_head_of_family = 1 ORDER BY name',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
});

// Get family members by HOF ID
app.get('/api/patients/family/:hofId', (req, res) => {
  const { hofId } = req.params;

  db.all('SELECT * FROM patients WHERE head_of_family_id = ? OR id = ?', [hofId, hofId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
});

// Create new patient
app.post('/api/patients', (req, res) => {
  const {
    name,
    father_or_husband_name,
    village_or_street,
    whatsapp_number,
    head_of_family_id,
    is_head_of_family,
    relation_with_hof,
    age,
    gender
  } = req.body;

  const query = `
    INSERT INTO patients (
      name, father_or_husband_name, village_or_street, whatsapp_number,
      head_of_family_id, is_head_of_family, relation_with_hof, age, gender
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    name,
    father_or_husband_name,
    village_or_street,
    whatsapp_number,
    head_of_family_id || null,
    is_head_of_family ? 1 : 0,
    relation_with_hof || 'self',
    age,
    gender
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'Patient created successfully' });
  });
});

// Update patient
app.put('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    father_or_husband_name,
    village_or_street,
    whatsapp_number,
    age,
    gender
  } = req.body;

  const query = `
    UPDATE patients
    SET name = ?, father_or_husband_name = ?, village_or_street = ?,
        whatsapp_number = ?, age = ?, gender = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [name, father_or_husband_name, village_or_street, whatsapp_number, age, gender, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Patient updated successfully' });
    });
});

// ============= VISIT ENDPOINTS =============

// Create new visit
app.post('/api/visits', (req, res) => {
  const {
    patient_id,
    visit_date,
    chief_complaint,
    past_history,
    prescription,
    fee_paid,
    investigations
  } = req.body;

  const query = `
    INSERT INTO visits (
      patient_id, visit_date, chief_complaint, past_history,
      prescription, fee_paid, investigations
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    patient_id,
    visit_date,
    chief_complaint,
    past_history,
    prescription,
    fee_paid || 0,
    investigations
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const visitId = this.lastID;

    // Auto-populate past illnesses from chief complaint
    if (chief_complaint) {
      // Extract illness names (simple extraction - split by common delimiters)
      const illnesses = chief_complaint.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);

      illnesses.forEach(illness => {
        // Check if this illness already exists for this patient
        db.get(
          'SELECT id FROM past_illnesses WHERE patient_id = ? AND illness_name = ?',
          [patient_id, illness],
          (err, existing) => {
            if (err) console.error(err);

            // Only add if it doesn't exist
            if (!existing) {
              db.run(
                'INSERT INTO past_illnesses (patient_id, illness_name, first_occurrence_date, visit_id) VALUES (?, ?, ?, ?)',
                [patient_id, illness, visit_date, visitId],
                (err) => {
                  if (err) console.error('Error adding past illness:', err);
                }
              );
            }
          }
        );
      });
    }

    res.json({ id: visitId, message: 'Visit created successfully' });
  });
});

// Get visit by ID
app.get('/api/visits/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM visits WHERE id = ?', [id], (err, visit) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    // Get patient details
    db.get('SELECT * FROM patients WHERE id = ?', [visit.patient_id], (err, patient) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ visit, patient });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Clinic CRM API Server running on http://localhost:${PORT}`);
  console.log(`✓ Database: SQLite (offline-first)`);
  console.log(`✓ Frontend (React + Vite): http://localhost:3000`);
  console.log(`✓ Run 'npm run dev:all' to start both servers\n`);
});
