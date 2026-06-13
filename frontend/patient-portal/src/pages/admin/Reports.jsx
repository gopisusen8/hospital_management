import React from 'react';

const DUMMY_REPORTS = [
  { title: 'Monthly Clinical Performance Index', code: 'CPI-2026-05', date: 'June 01, 2026', type: 'PDF' },
  { title: 'Outpatient Consult Frequency Log', code: 'OFC-2026-05', date: 'June 01, 2026', type: 'CSV' },
  { title: 'Emergency Room Admission Report', code: 'ERA-2026-05', date: 'June 02, 2026', type: 'PDF' }
];

export default function Reports() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Management Reports</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="glass-card">
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#ba68c8' }}>Average Discharge Time</h3>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>2.4 hrs</p>
          <span style={{ fontSize: '0.8rem', color: '#00e676' }}>↓ 15% from last quarter</span>
        </div>
        <div className="glass-card">
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#ba68c8' }}>Patient Satisfaction Index</h3>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>94.8%</p>
          <span style={{ fontSize: '0.8rem', color: '#00e676' }}>★ High Rating (Tier 1)</span>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ margin: '0 0 1.25rem 0', color: '#ba68c8' }}>Downloadable Analytics Sheets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DUMMY_REPORTS.map((rep, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px'
            }}>
              <div>
                <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{rep.title}</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  File ID: {rep.code} | Generated: {rep.date}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.8)'
                }}>{rep.type}</span>
                <button 
                  onClick={() => alert(`Simulating file download for ${rep.title}`)}
                  className="btn-primary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
