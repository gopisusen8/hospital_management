import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getUser } from 'common';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = getUser();
  const doctorId = user?.doctorId;

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    } else {
      setError('Doctor profile not found');
      setLoading(false);
    }
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/appointments/doctor/${doctorId}`);
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to load consultations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, null, {
        params: { status: newStatus }
      });
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading consultations...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ff1744' }}>
        {error}
      </div>
    );
  }

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
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  {app.patient ? `${app.patient.firstName} ${app.patient.lastName}` : 'Unknown Patient'}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  ({app.patient?.username})
                </span>
              </div>
              <p style={{ color: '#00e676', margin: '0.25rem 0', fontWeight: 500, fontSize: '0.95rem' }}>
                {formatDateTime(app.slot?.startDateTime)}
              </p>
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
                background: app.status === 'COMPLETED' ? 'rgba(0, 176, 255, 0.1)' : app.status === 'CONFIRMED' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 179, 0, 0.1)',
                color: app.status === 'COMPLETED' ? '#00b0ff' : app.status === 'CONFIRMED' ? '#00e676' : '#ffb300',
                border: app.status === 'COMPLETED' ? '1px solid rgba(0, 176, 255, 0.3)' : app.status === 'CONFIRMED' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255, 179, 0, 0.3)'
              }}>{app.status}</span>

              {app.status === 'CONFIRMED' && (
                <>
                  <button 
                    onClick={() => navigate('/create-prescription', { state: { appointment: app } })}
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
        {appointments.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
            No scheduled consultations found.
          </p>
        )}
      </div>
    </div>
  );
}
