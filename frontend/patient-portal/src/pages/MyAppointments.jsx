import React, { useState, useEffect } from 'react';
import { api, getUser } from 'common';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!user?.id) return;
    
    api.get(`/appointments/patient/${user.id}`)
      .then(res => {
        // Sort by start time descending
        const sorted = res.data.sort((a, b) => new Date(b.slot.startDateTime) - new Date(a.slot.startDateTime));
        setAppointments(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      });
  }, [user?.id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED': return { color: '#00f2fe', background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)' };
      case 'COMPLETED': return { color: '#00e676', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)' };
      case 'CANCELLED': return { color: '#ff1744', background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)' };
      default: return { color: '#ffb300', background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.3)' };
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading consultations checklist...
      </div>
    );
  }

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
              <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                Dr. {app.doctor.user.firstName} {app.doctor.user.lastName}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                {app.doctor.specialization} - {app.doctor.department}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0', fontSize: '0.95rem', fontWeight: 500 }}>
                {formatDate(app.slot.startDateTime)}
              </p>
              {app.reason && (
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
                  <strong>Reason:</strong> {app.reason}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                ...getStatusStyle(app.status)
              }}>{app.status}</span>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
            No appointments scheduled.
          </p>
        )}
      </div>
    </div>
  );
}
