import React, { useState, useEffect } from 'react';

// Initial sample data
const initialPatients = [
  { id: 1, name: "Ramesh Kumar", fatherOrHusbandName: "Shyam Kumar", villageOrStreet: "Mohalla Ganesh, Dadri", whatsappNumber: "9876543210", headOfFamilyName: "", isHeadOfFamily: true, relationWithHof: "self", age: 45, gender: "male", createdAt: "2025-01-15" },
  { id: 2, name: "Sunita Devi", fatherOrHusbandName: "Ramesh Kumar", villageOrStreet: "Mohalla Ganesh, Dadri", whatsappNumber: "9876543211", headOfFamilyName: "Ramesh Kumar", isHeadOfFamily: false, relationWithHof: "wife", age: 40, gender: "female", createdAt: "2025-01-15" },
  { id: 3, name: "Amit Kumar", fatherOrHusbandName: "Ramesh Kumar", villageOrStreet: "Mohalla Ganesh, Dadri", whatsappNumber: "9876543212", headOfFamilyName: "Ramesh Kumar", isHeadOfFamily: false, relationWithHof: "son", age: 22, gender: "male", createdAt: "2025-01-16" },
  { id: 4, name: "Priya Sharma", fatherOrHusbandName: "Vijay Sharma", villageOrStreet: "Village Bhoor, Dadri", whatsappNumber: "9988776655", headOfFamilyName: "", isHeadOfFamily: true, relationWithHof: "self", age: 35, gender: "female", createdAt: "2025-02-10" },
  { id: 5, name: "Vijay Sharma", fatherOrHusbandName: "Late Mohan Sharma", villageOrStreet: "Village Bhoor, Dadri", whatsappNumber: "9988776656", headOfFamilyName: "Priya Sharma", isHeadOfFamily: false, relationWithHof: "husband", age: 38, gender: "male", createdAt: "2025-02-10" },
  { id: 6, name: "Mohan Lal", fatherOrHusbandName: "Kishan Lal", villageOrStreet: "Village Surajpur", whatsappNumber: "9123456789", headOfFamilyName: "", isHeadOfFamily: false, relationWithHof: "", age: 55, gender: "male", createdAt: "2025-03-05" },
  { id: 7, name: "Geeta Bai", fatherOrHusbandName: "Unknown", villageOrStreet: "Dadri Town", whatsappNumber: "9988112233", headOfFamilyName: "", isHeadOfFamily: false, relationWithHof: "", age: 60, gender: "female", createdAt: "2025-03-10" },
];

const initialVisits = [
  { id: 1, patientId: 1, visitDate: "2025-03-10", chiefComplaint: "Fever and body ache", pastHistory: "Diabetic since 5 years", prescription: "Tab Paracetamol 500mg - TDS x 3 days\nTab Azithromycin 500mg - OD x 3 days", feePaid: 200, investigations: "CBC recommended" },
  { id: 2, patientId: 1, visitDate: "2025-04-15", chiefComplaint: "Follow up for diabetes", pastHistory: "Diabetic since 5 years, Fever last month", prescription: "Tab Metformin 500mg - BD\nTab Glimepiride 1mg - OD", feePaid: 150, investigations: "HbA1c - 7.2%" },
  { id: 3, patientId: 2, visitDate: "2025-03-20", chiefComplaint: "Knee pain bilateral", pastHistory: "No significant history", prescription: "Tab Aceclofenac 100mg - BD x 5 days\nCap Omeprazole 20mg - OD", feePaid: 200, investigations: "" },
  { id: 4, patientId: 3, visitDate: "2025-05-01", chiefComplaint: "Cold and cough", pastHistory: "No significant history", prescription: "Syp Ascoril LS - 10ml TDS x 5 days\nTab Cetirizine 10mg - HS x 5 days", feePaid: 150, investigations: "" },
  { id: 5, patientId: 4, visitDate: "2025-04-25", chiefComplaint: "Headache and weakness", pastHistory: "Anemia - on treatment", prescription: "Tab Iron + Folic acid - OD\nTab Paracetamol 500mg SOS", feePaid: 100, investigations: "Hb - 9.5 g/dl" },
];

export default function ClinicCRM() {
  const [patients, setPatients] = useState(initialPatients);
  const [visits, setVisits] = useState(initialVisits);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hofFilter, setHofFilter] = useState(null);

  // Form states
  const [patientForm, setPatientForm] = useState({
    name: '', fatherOrHusbandName: '', villageOrStreet: '', whatsappNumber: '',
    headOfFamilyId: '', headOfFamilyName: '', isHeadOfFamily: true, relationWithHof: 'self', age: '', gender: 'male'
  });

  const [visitForm, setVisitForm] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    chiefComplaint: '', pastHistory: '', prescription: '', feePaid: '', investigations: ''
  });

  // Get today's date for comparison
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Month names for dropdown
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get available years from visits
  const availableYears = [...new Set(visits.map(v => new Date(v.visitDate).getFullYear()))].sort((a, b) => b - a);
  if (!availableYears.includes(currentYear)) {
    availableYears.unshift(currentYear);
  }

  // Dashboard stats
  const todayVisits = visits.filter(v => v.visitDate === today).length;
  const todayIncome = visits.filter(v => v.visitDate === today).reduce((sum, v) => sum + v.feePaid, 0);
  const totalPatients = patients.length;
  const totalFamilies = patients.filter(p => p.isHeadOfFamily).length;

  // Monthly stats based on selected month
  const monthlyVisits = visits.filter(v => {
    const visitDate = new Date(v.visitDate);
    return visitDate.getMonth() === selectedMonth && visitDate.getFullYear() === selectedYear;
  });
  const monthlyIncome = monthlyVisits.reduce((sum, v) => sum + v.feePaid, 0);
  const monthlyVisitCount = monthlyVisits.length;

  // Get family members of a patient
  const getFamilyMembers = (patient) => {
    if (!patient.headOfFamilyName && !patient.isHeadOfFamily) {
      // Patient has no family linkage
      return [patient];
    }

    if (patient.isHeadOfFamily) {
      // This patient is HOF, find all who have this patient's name as their HOF
      return patients.filter(p =>
        p.headOfFamilyName === patient.name || p.id === patient.id
      );
    } else if (patient.headOfFamilyName) {
      // Find HOF and all family members
      const hofPatient = patients.find(p => p.name === patient.headOfFamilyName && p.isHeadOfFamily);
      return patients.filter(p =>
        p.headOfFamilyName === patient.headOfFamilyName ||
        (hofPatient && p.id === hofPatient.id) ||
        p.id === patient.id
      );
    }
    return [patient];
  };

  // Get past illnesses from visits
  const getPastIllnesses = (patientId) => {
    return visits
      .filter(v => v.patientId === patientId)
      .map(v => ({ date: v.visitDate, complaint: v.chiefComplaint }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Get patient visits
  const getPatientVisits = (patientId) => {
    return visits
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  };

  // Filter patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.villageOrStreet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.whatsappNumber.includes(searchTerm);

    const matchesHof = hofFilter === null || hofFilter === '' ||
      p.name === hofFilter ||
      p.headOfFamilyName === hofFilter;

    return matchesSearch && matchesHof;
  });

  // Get all HOFs for dropdown (those marked as HOF)
  const headsOfFamily = patients.filter(p => p.isHeadOfFamily);

  // Get unique HOF names (including from headOfFamilyName field)
  const uniqueHofNames = [...new Set([
    ...patients.filter(p => p.isHeadOfFamily).map(p => p.name),
    ...patients.filter(p => p.headOfFamilyName).map(p => p.headOfFamilyName)
  ])].filter(Boolean);

  // Handle patient registration
  const handleRegisterPatient = (e) => {
    e.preventDefault();
    const hasHof = patientForm.headOfFamilyName && patientForm.headOfFamilyName.trim() !== '';
    const newPatient = {
      id: patients.length + 1,
      ...patientForm,
      headOfFamilyName: hasHof ? patientForm.headOfFamilyName.trim() : '',
      isHeadOfFamily: false, // Only true if explicitly marked
      relationWithHof: hasHof ? patientForm.relationWithHof : '',
      age: parseInt(patientForm.age),
      createdAt: today
    };
    setPatients([...patients, newPatient]);
    setPatientForm({
      name: '', fatherOrHusbandName: '', villageOrStreet: '', whatsappNumber: '',
      headOfFamilyId: '', headOfFamilyName: '', isHeadOfFamily: false, relationWithHof: '', age: '', gender: 'male'
    });
    setCurrentView('patients');
  };

  // Handle patient edit/update
  const handleUpdatePatient = (e) => {
    e.preventDefault();
    const hasHof = patientForm.headOfFamilyName && patientForm.headOfFamilyName.trim() !== '';
    const updatedPatient = {
      ...editingPatient,
      ...patientForm,
      headOfFamilyName: hasHof ? patientForm.headOfFamilyName.trim() : '',
      relationWithHof: hasHof ? patientForm.relationWithHof : '',
      age: parseInt(patientForm.age)
    };
    setPatients(patients.map(p => p.id === editingPatient.id ? updatedPatient : p));
    setEditingPatient(null);
    setPatientForm({
      name: '', fatherOrHusbandName: '', villageOrStreet: '', whatsappNumber: '',
      headOfFamilyId: '', headOfFamilyName: '', isHeadOfFamily: false, relationWithHof: '', age: '', gender: 'male'
    });
    // Update selected patient if we were viewing them
    if (selectedPatient && selectedPatient.id === editingPatient.id) {
      setSelectedPatient(updatedPatient);
    }
    setCurrentView(selectedPatient ? 'patientFile' : 'patients');
  };

  // Start editing a patient
  const startEditPatient = (patient) => {
    setEditingPatient(patient);
    setPatientForm({
      name: patient.name,
      fatherOrHusbandName: patient.fatherOrHusbandName,
      villageOrStreet: patient.villageOrStreet,
      whatsappNumber: patient.whatsappNumber,
      headOfFamilyId: '',
      headOfFamilyName: patient.headOfFamilyName || '',
      isHeadOfFamily: patient.isHeadOfFamily,
      relationWithHof: patient.relationWithHof || '',
      age: patient.age.toString(),
      gender: patient.gender
    });
    setCurrentView('editPatient');
  };

  // Handle visit submission
  const handleAddVisit = (e) => {
    e.preventDefault();
    const newVisit = {
      id: visits.length + 1,
      patientId: selectedPatient.id,
      ...visitForm,
      feePaid: parseInt(visitForm.feePaid)
    };
    setVisits([...visits, newVisit]);
    setVisitForm({
      visitDate: today,
      chiefComplaint: '', pastHistory: '', prescription: '', feePaid: '', investigations: ''
    });
    setCurrentView('patientFile');
  };

  // Auto-fill village when HOF is selected
  const handleHofSelect = (hofId) => {
    if (hofId) {
      const hof = patients.find(p => p.id === parseInt(hofId));
      if (hof) {
        setPatientForm({
          ...patientForm,
          headOfFamilyId: hofId,
          villageOrStreet: hof.villageOrStreet,
          isHeadOfFamily: false
        });
      }
    } else {
      setPatientForm({
        ...patientForm,
        headOfFamilyId: '',
        isHeadOfFamily: true,
        relationWithHof: 'self'
      });
    }
  };

  // Styles
  const styles = {
    container: {
      fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
      color: '#2d3748'
    },
    header: {
      background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)',
      color: 'white',
      padding: '16px 24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    nav: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    navBtn: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      background: 'rgba(255,255,255,0.15)',
      color: 'white'
    },
    navBtnActive: {
      background: 'white',
      color: '#1a472a'
    },
    main: {
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      marginBottom: '20px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    statCard: {
      background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)',
      color: 'white',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(26,71,42,0.3)'
    },
    statNumber: {
      fontSize: '42px',
      fontWeight: '700',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      opacity: '0.9',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '16px',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '600',
      color: '#4a5568',
      fontSize: '14px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    btn: {
      padding: '14px 28px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px',
      transition: 'all 0.2s ease'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(26,71,42,0.3)'
    },
    btnSecondary: {
      background: '#e2e8f0',
      color: '#4a5568'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '14px 16px',
      borderBottom: '2px solid #e2e8f0',
      color: '#1a472a',
      fontWeight: '700',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #f0f0f0'
    },
    patientRow: {
      cursor: 'pointer',
      transition: 'background 0.2s ease'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },
    hofBadge: {
      background: '#d4edda',
      color: '#155724'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1a472a',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    sidebar: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '16px'
    },
    visitCard: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      borderLeft: '4px solid #1a472a'
    },
    illnessTag: {
      display: 'inline-block',
      background: '#fef3c7',
      color: '#92400e',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '13px',
      margin: '4px',
      fontWeight: '500'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    textarea: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '16px',
      minHeight: '100px',
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '16px',
      outline: 'none',
      boxSizing: 'border-box',
      background: 'white',
      cursor: 'pointer'
    },
    patientHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '20px',
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: '2px solid #e2e8f0'
    },
    patientInfo: {
      flex: '1'
    },
    patientName: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a472a',
      marginBottom: '8px'
    },
    patientMeta: {
      color: '#718096',
      fontSize: '15px',
      lineHeight: '1.6'
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: '24px'
    },
    radioGroup: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '10px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    },
    searchBox: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{todayVisits}</div>
          <div style={styles.statLabel}>Today's Visits</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)'}}>
          <div style={styles.statNumber}>₹{todayIncome}</div>
          <div style={styles.statLabel}>Today's Income</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalPatients}</div>
          <div style={styles.statLabel}>Total Patients</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalFamilies}</div>
          <div style={styles.statLabel}>Families</div>
        </div>
      </div>

      {/* Monthly Income Section */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div style={styles.sectionTitle}>
            <span>📊</span> Monthly Summary
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              style={{...styles.select, width: 'auto', minWidth: '130px'}}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {monthNames.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
            <select
              style={{...styles.select, width: 'auto', minWidth: '100px'}}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#f0fff4', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '2px solid #d4edda' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#065f46' }}>₹{monthlyIncome}</div>
            <div style={{ fontSize: '14px', color: '#047857', fontWeight: '600', marginTop: '4px' }}>
              {monthNames[selectedMonth]} {selectedYear} Income
            </div>
          </div>
          <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '2px solid #bfdbfe' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e40af' }}>{monthlyVisitCount}</div>
            <div style={{ fontSize: '14px', color: '#1e40af', fontWeight: '600', marginTop: '4px' }}>
              {monthNames[selectedMonth]} {selectedYear} Visits
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>
          <span>🔍</span> Quick Search
        </div>
        <input
          type="text"
          placeholder="Search patient by name, village, or phone..."
          style={styles.input}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setCurrentView('patients')}
        />
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>
          <span>🕐</span> Recent Patients
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Village</th>
                <th style={styles.th}>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 5).map(patient => {
                const lastVisit = visits
                  .filter(v => v.patientId === patient.id)
                  .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))[0];
                return (
                  <tr
                    key={patient.id}
                    style={styles.patientRow}
                    onClick={() => { setSelectedPatient(patient); setCurrentView('patientFile'); }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0fff4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={styles.td}>
                      <strong>{patient.name}</strong>
                      {patient.isHeadOfFamily && <span style={{...styles.badge, ...styles.hofBadge, marginLeft: '8px'}}>HOF</span>}
                    </td>
                    <td style={styles.td}>{patient.villageOrStreet}</td>
                    <td style={styles.td}>{lastVisit ? lastVisit.visitDate : 'No visits'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Patient Registration
  const renderRegister = () => (
    <div style={styles.card}>
      <div style={styles.sectionTitle}>
        <span>📝</span> Register New Patient
      </div>
      <div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Patient Name *</label>
            <input
              type="text"
              style={styles.input}
              value={patientForm.name}
              onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
              placeholder="Enter patient name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Father's / Husband's Name *</label>
            <input
              type="text"
              style={styles.input}
              value={patientForm.fatherOrHusbandName}
              onChange={(e) => setPatientForm({...patientForm, fatherOrHusbandName: e.target.value})}
              placeholder="Enter father's or husband's name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Age *</label>
            <input
              type="number"
              style={styles.input}
              value={patientForm.age}
              onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
              placeholder="Enter age"
              min="0"
              max="120"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Gender *</label>
            <select
              style={styles.select}
              value={patientForm.gender}
              onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>WhatsApp Number *</label>
            <input
              type="tel"
              style={styles.input}
              value={patientForm.whatsappNumber}
              onChange={(e) => setPatientForm({...patientForm, whatsappNumber: e.target.value})}
              placeholder="10 digit number"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Village / Street *</label>
            <input
              type="text"
              style={styles.input}
              value={patientForm.villageOrStreet}
              onChange={(e) => setPatientForm({...patientForm, villageOrStreet: e.target.value})}
              placeholder="Enter village or street address"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Head of Family (Optional)</label>
            <input
              type="text"
              style={styles.input}
              value={patientForm.headOfFamilyName || ''}
              onChange={(e) => setPatientForm({...patientForm, headOfFamilyName: e.target.value})}
              placeholder="Enter HOF name if known"
            />
            <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
              Leave empty if not applicable or unknown. Can be added later.
            </div>
          </div>

          {patientForm.headOfFamilyName && patientForm.headOfFamilyName.trim() !== '' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Relation with HOF</label>
              <select
                style={styles.select}
                value={patientForm.relationWithHof}
                onChange={(e) => setPatientForm({...patientForm, relationWithHof: e.target.value})}
              >
                <option value="">-- Select Relation --</option>
                <option value="wife">Wife</option>
                <option value="husband">Husband</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                <option value="mother">Mother</option>
                <option value="father">Father</option>
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={patientForm.isHeadOfFamily}
                onChange={(e) => setPatientForm({...patientForm, isHeadOfFamily: e.target.checked})}
                style={{ width: '18px', height: '18px' }}
              />
              Mark this patient as Head of Family
            </label>
            <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
              Check this if other family members will be registered under this patient
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            style={{...styles.btn, ...styles.btnPrimary}}
            onClick={() => {
              if (!patientForm.name || !patientForm.fatherOrHusbandName || !patientForm.age || !patientForm.whatsappNumber || !patientForm.villageOrStreet) {
                alert('Please fill all required fields');
                return;
              }
              const hasHof = patientForm.headOfFamilyName && patientForm.headOfFamilyName.trim() !== '';
              const newPatient = {
                id: patients.length + 1,
                ...patientForm,
                headOfFamilyName: hasHof ? patientForm.headOfFamilyName.trim() : '',
                relationWithHof: hasHof ? patientForm.relationWithHof : '',
                age: parseInt(patientForm.age),
                createdAt: today
              };
              setPatients([...patients, newPatient]);
              setPatientForm({
                name: '', fatherOrHusbandName: '', villageOrStreet: '', whatsappNumber: '',
                headOfFamilyId: '', headOfFamilyName: '', isHeadOfFamily: false, relationWithHof: '', age: '', gender: 'male'
              });
              setCurrentView('patients');
            }}
          >
            ✓ Register Patient
          </button>
          <button
            type="button"
            style={{...styles.btn, ...styles.btnSecondary}}
            onClick={() => setCurrentView('dashboard')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Render Edit Patient Form
  const renderEditPatient = () => (
    <div style={styles.card}>
      <div style={styles.sectionTitle}>
        <span>✏️</span> Edit Patient - {editingPatient?.name}
      </div>
      <div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Patient Name *</label>
            <input
              type="text"
              style={styles.input}
              value={patientForm.name}
              onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
              placeholder="Enter patient name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Father's / Husband's Name *</label>
            <input
              type="text"
              style={styles.input}
              value={patientForm.fatherOrHusbandName}
              onChange={(e) => setPatientForm({...patientForm, fatherOrHusbandName: e.target.value})}
              placeholder="Enter father's or husband's name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Age *</label>
            <input
              type="number"
              style={styles.input}
              value={patientForm.age}
              onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
              placeholder="Enter age"
              min="0"
              max="120"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Gender *</label>
            <select
              style={styles.select}
              value={patientForm.gender}
              onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>WhatsApp Number *</label>
            <input
              type="tel"
              style={styles.input}
              value={patientForm.whatsappNumber}
              onChange={(e) => setPatientForm({...patientForm, whatsappNumber: e.target.value})}
              placeholder="10 digit number"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Village / Street *</label>
            <input
              type="text"
              style={styles.input}
              value={patientForm.villageOrStreet}
              onChange={(e) => setPatientForm({...patientForm, villageOrStreet: e.target.value})}
              placeholder="Enter village or street address"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Head of Family (Optional)</label>
            <input
              type="text"
              style={styles.input}
              value={patientForm.headOfFamilyName || ''}
              onChange={(e) => setPatientForm({...patientForm, headOfFamilyName: e.target.value})}
              placeholder="Enter HOF name if known"
            />
            <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
              Leave empty if not applicable. You can add this later.
            </div>
          </div>

          {patientForm.headOfFamilyName && patientForm.headOfFamilyName.trim() !== '' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Relation with HOF</label>
              <select
                style={styles.select}
                value={patientForm.relationWithHof}
                onChange={(e) => setPatientForm({...patientForm, relationWithHof: e.target.value})}
              >
                <option value="">-- Select Relation --</option>
                <option value="wife">Wife</option>
                <option value="husband">Husband</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                <option value="mother">Mother</option>
                <option value="father">Father</option>
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={patientForm.isHeadOfFamily}
                onChange={(e) => setPatientForm({...patientForm, isHeadOfFamily: e.target.checked})}
                style={{ width: '18px', height: '18px' }}
              />
              Mark this patient as Head of Family
            </label>
            <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
              Check this if other family members will be registered under this patient
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              style={{...styles.btn, ...styles.btnPrimary}}
              onClick={() => {
                if (!patientForm.name || !patientForm.fatherOrHusbandName || !patientForm.age || !patientForm.whatsappNumber || !patientForm.villageOrStreet) {
                  alert('Please fill all required fields');
                  return;
                }
                const hasHof = patientForm.headOfFamilyName && patientForm.headOfFamilyName.trim() !== '';
                const updatedPatient = {
                  ...editingPatient,
                  ...patientForm,
                  headOfFamilyName: hasHof ? patientForm.headOfFamilyName.trim() : '',
                  relationWithHof: hasHof ? patientForm.relationWithHof : '',
                  age: parseInt(patientForm.age)
                };
                setPatients(patients.map(p => p.id === editingPatient.id ? updatedPatient : p));
                if (selectedPatient && selectedPatient.id === editingPatient.id) {
                  setSelectedPatient(updatedPatient);
                }
                setEditingPatient(null);
                setPatientForm({
                  name: '', fatherOrHusbandName: '', villageOrStreet: '', whatsappNumber: '',
                  headOfFamilyId: '', headOfFamilyName: '', isHeadOfFamily: false, relationWithHof: '', age: '', gender: 'male'
                });
                setCurrentView(selectedPatient ? 'patientFile' : 'patients');
              }}
            >
              ✓ Save Changes
            </button>
            <button
              type="button"
              style={{...styles.btn, ...styles.btnSecondary}}
              onClick={() => {
                setEditingPatient(null);
                setPatientForm({
                  name: '', fatherOrHusbandName: '', villageOrStreet: '', whatsappNumber: '',
                  headOfFamilyId: '', headOfFamilyName: '', isHeadOfFamily: false, relationWithHof: '', age: '', gender: 'male'
                });
                setCurrentView(selectedPatient ? 'patientFile' : 'patients');
              }}
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            style={{...styles.btn, background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca'}}
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${editingPatient.name}? This will also delete all their visit records. This action cannot be undone.`)) {
                // Delete patient's visits
                setVisits(visits.filter(v => v.patientId !== editingPatient.id));
                // Delete patient
                setPatients(patients.filter(p => p.id !== editingPatient.id));
                // Clear selection if this patient was selected
                if (selectedPatient && selectedPatient.id === editingPatient.id) {
                  setSelectedPatient(null);
                }
                setEditingPatient(null);
                setPatientForm({
                  name: '', fatherOrHusbandName: '', villageOrStreet: '', whatsappNumber: '',
                  headOfFamilyId: '', headOfFamilyName: '', isHeadOfFamily: false, relationWithHof: '', age: '', gender: 'male'
                });
                setCurrentView('patients');
              }
            }}
          >
            🗑️ Delete Patient
          </button>
        </div>
      </div>
    </div>
  );

  // Render Patient List
  const renderPatients = () => (
    <div style={styles.card}>
      <div style={styles.sectionTitle}>
        <span>👥</span> Patient List
      </div>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by name, village, or phone..."
          style={{...styles.input, flex: '1', minWidth: '200px'}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          style={{...styles.select, width: 'auto', minWidth: '200px'}}
          value={hofFilter || ''}
          onChange={(e) => setHofFilter(e.target.value || null)}
        >
          <option value="">All Patients</option>
          {uniqueHofNames.map(hofName => (
            <option key={hofName} value={hofName}>
              {hofName}'s Family
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Father/Husband</th>
              <th style={styles.th}>Age/Gender</th>
              <th style={styles.th}>Village</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>HOF</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr
                key={patient.id}
                style={styles.patientRow}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0fff4'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={styles.td} onClick={() => { setSelectedPatient(patient); setCurrentView('patientFile'); }}>
                  <strong style={{ cursor: 'pointer' }}>{patient.name}</strong>
                  {patient.isHeadOfFamily && <span style={{...styles.badge, ...styles.hofBadge, marginLeft: '8px'}}>HOF</span>}
                </td>
                <td style={styles.td}>{patient.fatherOrHusbandName}</td>
                <td style={styles.td}>{patient.age} / {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'O'}</td>
                <td style={styles.td}>{patient.villageOrStreet}</td>
                <td style={styles.td}>{patient.whatsappNumber}</td>
                <td style={styles.td}>{patient.headOfFamilyName || (patient.isHeadOfFamily ? 'Self' : '-')}</td>
                <td style={styles.td}>
                  <button
                    onClick={(e) => { e.stopPropagation(); startEditPatient(patient); }}
                    style={{
                      ...styles.btn,
                      padding: '6px 12px',
                      fontSize: '13px',
                      background: '#e2e8f0',
                      color: '#4a5568'
                    }}
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPatients.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          No patients found. Try a different search term.
        </div>
      )}
    </div>
  );

  // Render Patient File
  const renderPatientFile = () => {
    if (!selectedPatient) return null;

    const familyMembers = getFamilyMembers(selectedPatient);
    const pastIllnesses = getPastIllnesses(selectedPatient.id);
    const patientVisits = getPatientVisits(selectedPatient.id);
    const hasFamily = familyMembers.length > 1 || selectedPatient.headOfFamilyName || selectedPatient.isHeadOfFamily;

    return (
      <div>
        <div style={styles.card}>
          <div style={styles.patientHeader}>
            <div style={styles.patientInfo}>
              <div style={styles.patientName}>
                {selectedPatient.name}
                {selectedPatient.isHeadOfFamily && <span style={{...styles.badge, ...styles.hofBadge, marginLeft: '12px', fontSize: '14px'}}>Head of Family</span>}
              </div>
              <div style={styles.patientMeta}>
                <div><strong>S/o, D/o, W/o:</strong> {selectedPatient.fatherOrHusbandName}</div>
                <div><strong>Age:</strong> {selectedPatient.age} years | <strong>Gender:</strong> {selectedPatient.gender}</div>
                <div><strong>Village:</strong> {selectedPatient.villageOrStreet}</div>
                <div><strong>WhatsApp:</strong> {selectedPatient.whatsappNumber}</div>
                {selectedPatient.headOfFamilyName && <div><strong>Head of Family:</strong> {selectedPatient.headOfFamilyName} ({selectedPatient.relationWithHof})</div>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                style={{...styles.btn, ...styles.btnSecondary}}
                onClick={() => startEditPatient(selectedPatient)}
              >
                ✏️ Edit Info
              </button>
              <button
                style={{...styles.btn, ...styles.btnPrimary}}
                onClick={() => {
                  setVisitForm({
                    visitDate: today,
                    chiefComplaint: '',
                    pastHistory: pastIllnesses.map(i => i.complaint).join(', '),
                    prescription: '',
                    feePaid: '',
                    investigations: ''
                  });
                  setCurrentView('addVisit');
                }}
              >
                + Add Visit
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: hasFamily ? '1fr 280px' : '1fr', gap: '24px' }}>
            <div>
              {/* Past Illnesses */}
              <div style={{ marginBottom: '24px' }}>
                <div style={styles.sectionTitle}><span>🏥</span> Past Illnesses</div>
                <div>
                  {pastIllnesses.length > 0 ? (
                    pastIllnesses.map((illness, idx) => (
                      <span key={idx} style={styles.illnessTag}>
                        {illness.complaint} ({illness.date})
                      </span>
                    ))
                  ) : (
                    <div style={{ color: '#718096', fontStyle: 'italic' }}>No past illnesses recorded</div>
                  )}
                </div>
              </div>

              {/* Visit History */}
              <div>
                <div style={styles.sectionTitle}><span>📋</span> Visit History</div>
                {patientVisits.length > 0 ? (
                  patientVisits.map(visit => (
                    <div key={visit.id} style={styles.visitCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <strong style={{ color: '#1a472a' }}>{visit.visitDate}</strong>
                        <span style={{ background: '#d4edda', color: '#155724', padding: '2px 10px', borderRadius: '12px', fontSize: '13px' }}>
                          ₹{visit.feePaid}
                        </span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Chief Complaint:</strong> {visit.chiefComplaint}
                      </div>
                      {visit.pastHistory && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong>Past History:</strong> {visit.pastHistory}
                        </div>
                      )}
                      <div style={{ marginBottom: '8px', background: '#f0fff4', padding: '10px', borderRadius: '8px' }}>
                        <strong>Rx:</strong>
                        <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{visit.prescription}</pre>
                      </div>
                      {visit.investigations && (
                        <div>
                          <strong>Investigations:</strong> {visit.investigations}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#718096', fontStyle: 'italic' }}>No visits recorded yet</div>
                )}
              </div>
            </div>

            {/* Family Members Sidebar - only show if patient has family */}
            {hasFamily && (
              <div style={styles.sidebar}>
                <div style={styles.sectionTitle}><span>👨‍👩‍👧‍👦</span> Family</div>
                {familyMembers.map(member => {
                  const memberVisits = visits.filter(v => v.patientId === member.id);
                  const totalPaid = memberVisits.reduce((sum, v) => sum + v.feePaid, 0);
                  const visitCount = memberVisits.length;
                  return (
                    <div
                      key={member.id}
                      onClick={() => setSelectedPatient(member)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        background: member.id === selectedPatient.id ? '#d4edda' : 'white',
                        border: member.id === selectedPatient.id ? '2px solid #1a472a' : '1px solid #e2e8f0',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {member.name}
                        {member.isHeadOfFamily && <span style={{...styles.badge, ...styles.hofBadge, marginLeft: '6px', fontSize: '10px'}}>HOF</span>}
                      </div>
                      <div style={{ fontSize: '13px', color: '#718096', marginBottom: '6px' }}>
                        {member.relationWithHof || 'Member'} • {member.age} yrs
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#d4edda', color: '#155724', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>
                          ₹{totalPaid}
                        </span>
                        <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>
                          {visitCount} visit{visitCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          style={{...styles.btn, ...styles.btnSecondary}}
          onClick={() => { setSelectedPatient(null); setCurrentView('patients'); }}
        >
          ← Back to Patient List
        </button>
      </div>
    );
  };

  // Render Add Visit Form
  const renderAddVisit = () => {
    if (!selectedPatient) return null;

    return (
      <div style={styles.card}>
        <div style={styles.sectionTitle}>
          <span>📝</span> New Visit - {selectedPatient.name}
        </div>
        <div>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Visit Date *</label>
              <input
                type="date"
                style={styles.input}
                value={visitForm.visitDate}
                onChange={(e) => setVisitForm({...visitForm, visitDate: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Fee Paid (₹) *</label>
              <input
                type="number"
                style={styles.input}
                value={visitForm.feePaid}
                onChange={(e) => setVisitForm({...visitForm, feePaid: e.target.value})}
                placeholder="Enter fee amount"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Chief Complaint *</label>
            <textarea
              style={styles.textarea}
              value={visitForm.chiefComplaint}
              onChange={(e) => setVisitForm({...visitForm, chiefComplaint: e.target.value})}
              placeholder="Enter chief complaint..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Past History</label>
            <textarea
              style={styles.textarea}
              value={visitForm.pastHistory}
              onChange={(e) => setVisitForm({...visitForm, pastHistory: e.target.value})}
              placeholder="Enter relevant past history..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Prescription (Rx) *</label>
            <textarea
              style={{...styles.textarea, minHeight: '150px'}}
              value={visitForm.prescription}
              onChange={(e) => setVisitForm({...visitForm, prescription: e.target.value})}
              placeholder="Enter prescription details..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Investigations (if any)</label>
            <textarea
              style={styles.textarea}
              value={visitForm.investigations}
              onChange={(e) => setVisitForm({...visitForm, investigations: e.target.value})}
              placeholder="Enter investigation details..."
            />
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              type="button"
              style={{...styles.btn, ...styles.btnPrimary}}
              onClick={() => {
                if (!visitForm.visitDate || !visitForm.chiefComplaint || !visitForm.prescription || !visitForm.feePaid) {
                  alert('Please fill all required fields');
                  return;
                }
                const newVisit = {
                  id: visits.length + 1,
                  patientId: selectedPatient.id,
                  ...visitForm,
                  feePaid: parseInt(visitForm.feePaid)
                };
                setVisits([...visits, newVisit]);
                setVisitForm({
                  visitDate: today,
                  chiefComplaint: '', pastHistory: '', prescription: '', feePaid: '', investigations: ''
                });
                setCurrentView('patientFile');
              }}
            >
              ✓ Save Visit
            </button>
            <button
              type="button"
              style={{...styles.btn, ...styles.btnSecondary}}
              onClick={() => setCurrentView('patientFile')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span>🏥</span> Dr Shah Asad Rasheed
        </div>
        <nav style={styles.nav}>
          <button
            style={{...styles.navBtn, ...(currentView === 'dashboard' ? styles.navBtnActive : {})}}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button
            style={{...styles.navBtn, ...(currentView === 'register' ? styles.navBtnActive : {})}}
            onClick={() => setCurrentView('register')}
          >
            + Register
          </button>
          <button
            style={{...styles.navBtn, ...(currentView === 'patients' ? styles.navBtnActive : {})}}
            onClick={() => setCurrentView('patients')}
          >
            Patients
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'register' && renderRegister()}
        {currentView === 'patients' && renderPatients()}
        {currentView === 'patientFile' && renderPatientFile()}
        {currentView === 'addVisit' && renderAddVisit()}
        {currentView === 'editPatient' && renderEditPatient()}
      </main>
    </div>
  );
}
