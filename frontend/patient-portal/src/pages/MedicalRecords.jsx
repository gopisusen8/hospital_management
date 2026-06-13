import React from 'react';

const DUMMY_RECORDS = [
  { id: 1, date: 'May 04, 2026', doctorName: 'Dr. Anita Patel', diagnosis: 'Acute Bronchitis', notes: 'Patient presented with dry cough and mild congestion. Recommended hydration and rest.', report: 'Chest_XRay_Report.pdf' },
  { id: 2, date: 'Oct 12, 2025', doctorName: 'Dr. Sarah Jenkins', diagnosis: 'Mild Hypertension', notes: 'Blood pressure slightly elevated. Monitor weekly and limit sodium intake.', report: 'ECG_Analysis.pdf' }
];

export default function MedicalRecords() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Medical Records</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {DUMMY_RECORDS.map(rec => (
          <div key={rec.id} className="glass-card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div>
                <h3 style={{ margin: 0, color: '#00f2fe' }}>{rec.diagnosis}</h3>
                <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                  Consultation with {rec.doctorName}
                </p>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{rec.date}</span>
            </div>

            <p style={{ fontSize: '0.95rem', margin: '0.5rem 0', color: 'rgba(255,255,255,0.8)' }}>
              <strong>Notes:</strong> {rec.notes}
            </p>

            {rec.report && (
              <div style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                width: 'fit-content'
              }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{rec.report}</span>
                <a 
                  href={`/reports/${rec.report}`} 
                  onClick={(e) => { e.preventDefault(); alert(`Downloading simulated file: ${rec.report}`); }} 
                  style={{ color: '#00f2fe', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', marginLeft: '1rem' }}
                >
                  Download
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
