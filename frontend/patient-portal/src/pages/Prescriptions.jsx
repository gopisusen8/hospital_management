import React from 'react';

const DUMMY_PRESCRIPTIONS = [
  { id: 1, date: 'May 04, 2026', doctorName: 'Dr. Anita Patel', status: 'Active', instructions: 'Amoxicillin 500mg - 3 times daily for 7 days. Take with food.' },
  { id: 2, date: 'Oct 12, 2025', doctorName: 'Dr. Sarah Jenkins', status: 'Expired', instructions: 'Lisinopril 10mg - Once daily in the morning. Monitor BP.' }
];

export default function Prescriptions() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>My Prescriptions</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {DUMMY_PRESCRIPTIONS.map(rx => (
          <div key={rx.id} className="glass-card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Prescribed by</p>
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{rx.doctorName}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{rx.date}</span>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: rx.status === 'Active' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255,255,255,0.05)',
                  color: rx.status === 'Active' ? '#00e676' : 'rgba(255,255,255,0.5)',
                  border: rx.status === 'Active' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255,255,255,0.1)'
                }}>{rx.status}</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '8px',
              padding: '1rem',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.95rem'
            }}>
              <strong>Medications & Instructions:</strong>
              <p style={{ margin: '0.5rem 0 0 0', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{rx.instructions}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
