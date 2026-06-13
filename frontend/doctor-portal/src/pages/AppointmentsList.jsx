import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DUMMY_APPOINTMENTS = [
  { id: 1, patientName: 'John Doe', age: 34, reason: 'Follow-up on blood pressure monitoring', dateTime: 'Today - 10:00 AM', status: 'CONFIRMED' },
  { id: 2, patientName: 'Emily Smith', age: 8, reason: 'Routine immunization check', dateTime: 'Today - 11:30 AM', status: 'CONFIRMED' },
  { id: 3, patientName: 'Robert Vance', age: 45, reason: 'Severe migraines and vertigo', dateTime: 'Today - 02:00 PM', status: 'PENDING' }
];

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState(DUMMY_APPOINTMENTS);
  const navigate = useNavigate();

  const handleStatusUpdate = (id, newStatus) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Consultation Schedule</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {appointments.map(app => (
          <div key={app.id} className="glass-card" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{app.patientName}</h3>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>(Age {app.age})</span>
              </div>
              <p style={{ color: '#00e676', margin: '0.25rem 0', fontWeight: 500, fontSize: '0.95rem' }}>{app.dateTime}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                <strong>Reason:</strong> {app.reason}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                background: app.status === 'CONFIRMED' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 179, 0, 0.1)',
                color: app.status === 'CONFIRMED' ? '#00e676' : '#ffb300',
                border: app.status === 'CONFIRMED' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255, 179, 0, 0.3)'
              }}>{app.status}</span>

              {app.status === 'CONFIRMED' && (
                <>
                  <button 
                    onClick={() => navigate('/create-prescription', { state: { patientName: app.patientName } })}
                    className="btn-primary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    Prescribe
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'COMPLETED')}
                    className="btn-secondary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    Complete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
