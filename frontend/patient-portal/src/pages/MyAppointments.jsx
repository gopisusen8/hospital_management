import React, { useState, useEffect } from 'react';
import { api, getUser } from 'common';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = () => {
    const user = getUser();
    if (!user || !user.id) {
      setError('Please log in again.');
      setLoading(false);
      return;
    }
    api.get(`/appointments/patient/${user.id}`)
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading appointments.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    api.post(`/appointments/${id}/status?status=CANCELLED`)
      .then(() => {
        fetchAppointments();
      })
      .catch(err => {
        console.error(err);
        alert('Could not cancel appointment.');
      });
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return { color: '#00f2fe', background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' };
      case 'COMPLETED': return { color: '#00e676', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)' };
      case 'CANCELLED': return { color: '#ff1744', background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)' };
      case 'REQUESTED': return { color: '#ffb300', background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.3)' };
      default: return { color: '#ffffff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)' };
    }
  };

  const formatSlotTime = (slot) => {
    if (!slot || !slot.startDateTime) return 'Date/Time Unknown';
    try {
      return new Date(slot.startDateTime).toLocaleString();
    } catch (e) {
      return slot.startDateTime;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>My Appointments</h1>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>Loading appointments...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#ff1744', marginTop: '2rem' }}>{error}</p>
      ) : appointments.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>You have no registered appointments.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map(app => {
            const docName = app.doctor?.user ? (`Dr. ${app.doctor.user.firstName} ${app.doctor.user.lastName}`) : 'Specialist';
            return (
              <div key={app.id} className="glass-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{docName}</h3>
                  <p style={{ color: '#00f2fe', margin: '0.25rem 0', fontSize: '0.9rem', fontWeight: 600 }}>
                    {app.doctor?.specialization} - {app.doctor?.department}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0', fontSize: '0.95rem', fontWeight: 500 }}>
                    {formatSlotTime(app.slot)}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0', fontSize: '0.85rem' }}>
                    Reason: "{app.reason}"
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    ...getStatusStyle(app.status)
                  }}>{app.status}</span>

                  {(app.status?.toUpperCase() === 'REQUESTED' || app.status?.toUpperCase() === 'CONFIRMED') && (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
