import React, { useState } from 'react';

const INITIAL_APPOINTMENTS = [
  { id: 1, doctorName: 'Dr. Sarah Jenkins', specialty: 'Cardiology', dateTime: 'Oct 14, 2026 - 10:00 AM', status: 'CONFIRMED' },
  { id: 2, doctorName: 'Dr. Anita Patel', specialty: 'Pediatrics', dateTime: 'May 04, 2026 - 11:30 AM', status: 'COMPLETED' },
  { id: 3, doctorName: 'Dr. Marcus Vance', specialty: 'Neurology', dateTime: 'Dec 18, 2025 - 04:00 PM', status: 'CANCELLED' }
];

export default function MyAppointments() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const handleCancel = (id) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'CANCELLED' } : app
    ));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED': return { color: '#00f2fe', background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' };
      case 'COMPLETED': return { color: '#00e676', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)' };
      case 'CANCELLED': return { color: '#ff1744', background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)' };
      default: return {};
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>My Appointments</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {appointments.map(app => (
          <div key={app.id} className="glass-card" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{app.doctorName}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0', fontSize: '0.9rem' }}>{app.specialty}</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0', fontSize: '0.95rem', fontWeight: 500 }}>{app.dateTime}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                ...getStatusStyle(app.status)
              }}>{app.status}</span>

              {app.status === 'CONFIRMED' && (
                <button 
                  onClick={() => handleCancel(app.id)} 
                  className="btn-secondary" 
                  style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(255, 23, 68, 0.4)',
                    background: 'rgba(255, 23, 68, 0.1)',
                    color: '#ff1744'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
