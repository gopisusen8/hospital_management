import React, { useState } from 'react';

const DUMMY_HISTORY = [
  { id: 1, patientName: 'John Doe', visitDate: 'May 04, 2026', diagnosis: 'Acute Bronchitis', provider: 'Dr. Anita Patel', notes: 'Persistent dry cough. Prescribed Amoxicillin.' },
  { id: 2, patientName: 'John Doe', visitDate: 'Oct 12, 2025', diagnosis: 'Mild Hypertension', provider: 'Dr. Sarah Jenkins', notes: 'BP elevated. Recommended sodium reduction.' },
  { id: 3, patientName: 'Emily Smith', visitDate: 'Jan 10, 2026', diagnosis: 'Common Cold', provider: 'Dr. Anita Patel', notes: 'Mild congestion. Recommended fluids and rest.' }
];

export default function PatientHistory() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('John Doe');

  const filtered = DUMMY_HISTORY.filter(rec => 
    rec.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Patient History Lookup</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Filter by Patient Name (e.g. John Doe)..." 
          style={{ flex: 1 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filtered.map(rec => (
          <div key={rec.id} className="glass-card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{rec.patientName}</h3>
                <span style={{ fontSize: '0.85rem', color: '#00e676', fontWeight: 600 }}>{rec.diagnosis}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{rec.visitDate}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Logged by {rec.provider}</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
              <strong>Clinical Notes:</strong> {rec.notes}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
            No clinical logs found matching query.
          </p>
        )}
      </div>
    </div>
  );
}
