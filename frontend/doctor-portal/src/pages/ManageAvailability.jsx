import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function ManageAvailability() {
  const [slots, setSlots] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const getDoctorId = () => {
    try {
      const doc = JSON.parse(localStorage.getItem('doctor'));
      return doc?.id;
    } catch (e) {
      return null;
    }
  };

  const fetchSlots = () => {
    const docId = getDoctorId();
    if (!docId) {
      setError('Doctor profile not loaded properly.');
      setLoading(false);
      return;
    }
    api.get(`/availability-slots/doctor/${docId}`)
      .then(res => {
        setSlots(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading availability slots.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = (e) => {
    e.preventDefault();
    setError('');
    if (!newDate || !newTime) return;

    const docId = getDoctorId();
    if (!docId) {
      setError('Doctor details missing.');
      return;
    }

    try {
      const startDate = new Date(`${newDate}T${newTime}`);
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 mins slot
      
      const pad = (n) => n < 10 ? '0' + n : n;
      const formatISO = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

      api.post('/availability-slots', {
        doctor: { id: docId },
        startDateTime: formatISO(startDate),
        endDateTime: formatISO(endDate),
        isBooked: false
      }).then(() => {
        setNewDate('');
        setNewTime('');
        fetchSlots();
      }).catch(err => {
        console.error(err);
        setError('Could not create availability slot.');
      });
    } catch (e) {
      setError('Invalid date or time format.');
    }
  };

  const handleDeleteSlot = (id) => {
    setError('');
    api.delete(`/availability-slots/${id}`)
      .then(() => {
        fetchSlots();
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data || 'Failed to delete slot. Is it already booked?');
      });
  };

  const formatSlotTime = (startStr) => {
    try {
      return new Date(startStr).toLocaleString();
    } catch (e) {
      return startStr;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Manage Availability Slots</h1>

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        {/* Add Slot Panel */}
        <div className="glass-panel">
          <h3 style={{ margin: '0 0 1rem 0', color: '#00e676' }}>Create New Slot</h3>
          <form onSubmit={handleAddSlot} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Date</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Start Time</label>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Add Availability</button>
          </form>
        </div>

        {/* Existing Slots List */}
        <div className="glass-panel">
          <h3 style={{ margin: '0 0 1rem 0', color: '#00e676' }}>Active Schedule</h3>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading slots...</p>
          ) : slots.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No slots registered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {slots.map(slot => (
                <div key={slot.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>{formatSlotTime(slot.startDateTime)}</p>
                    <span style={{
                      fontSize: '0.75rem',
                      color: slot.isBooked ? '#ffb300' : '#00e676'
                    }}>
                      {slot.isBooked ? 'Booked' : 'Available'}
                    </span>
                  </div>
                  {!slot.isBooked && (
                    <button 
                      onClick={() => handleDeleteSlot(slot.id)} 
                      style={{
                        border: 'none',
                        background: 'none',
                        color: 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
