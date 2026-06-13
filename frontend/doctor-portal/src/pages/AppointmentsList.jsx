import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from 'common';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getDoctorId = () => {
    try {
      const doc = JSON.parse(localStorage.getItem('doctor'));
      return doc?.id;
    } catch (e) {
      return null;
    }
  };

  const fetchAppointments = () => {
    const docId = getDoctorId();
    if (!docId) {
      setError('Doctor profile not loaded properly.');
      setLoading(false);
      return;
    }
    api.get(`/appointments/doctor/${docId}`)
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading consultations.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    api.post(`/appointments/${id}/status?status=${newStatus}`)
      .then(() => {
        fetchAppointments();
      })
      .catch(err => {
        console.error(err);
        alert('Could not update appointment status.');
      });
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return { background: 'rgba(0, 230, 118, 0.1)', color: '#00e676', border: '1px solid rgba(0, 230, 118, 0.3)' };
      case 'COMPLETED': return { background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' };
      case 'CANCELLED': return { background: 'rgba(255, 23, 68, 0.1)', color: '#ff1744', border: '1px solid rgba(255, 23, 68, 0.3)' };
      case 'REQUESTED': return { background: 'rgba(255, 179, 0, 0.1)', color: '#ffb300', border: '1px solid rgba(255, 179, 0, 0.3)' };
      default: return { background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' };
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
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Consultation Schedule</h1>

      {error && (
        <div style={{
          background: 'rgba(255, 8, 68, 0.15)',
          border: '1px solid rgba(255, 8, 68, 0.4)',
          color: '#ffb199',
          padding: '0.75rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>Loading consultations...</p>
      ) : appointments.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>No appointments booked on your schedule.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {appointments.map(app => {
            const patientName = app.patient ? `${app.patient.firstName} ${app.patient.lastName}` : 'Unregistered Patient';
            const showActionButtons = app.status?.toUpperCase() === 'CONFIRMED' || app.status?.toUpperCase() === 'REQUESTED';
            
            return (
              <div key={app.id} className="glass-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{patientName}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>({app.patient?.email})</span>
                  </div>
                  <p style={{ color: '#00e676', margin: '0.25rem 0', fontWeight: 500, fontSize: '0.95rem' }}>
                    {formatSlotTime(app.slot)}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                    <strong>Reason:</strong> {app.reason}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{
                    padding: '0.25' + 'rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    ...getStatusStyle(app.status)
                  }}>{app.status}</span>

                  {showActionButtons && (
                    <>
                      <button 
                        onClick={() => navigate('/create-prescription', { 
                          state: { 
                            patientName: patientName,
                            patientId: app.patient?.id,
                            appointmentId: app.id
                          } 
                        })}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
