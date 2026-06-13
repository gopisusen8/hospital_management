import React, { useState, useEffect } from 'react';
import { api, getUser } from 'common';

export default function ManageAvailability() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const user = getUser();
  const doctorId = user?.doctorId;

  useEffect(() => {
    if (doctorId) {
      fetchSlots();
    } else {
      setError('Doctor profile not found');
      setLoading(false);
    }
  }, [doctorId]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doctors/${doctorId}/slots`);
      // Sort slots by date time
      const sorted = res.data.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
      setSlots(sorted);
    } catch (err) {
      console.error(err);
      setError('Failed to load availability slots.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError('');
    if (!newDate || !newTime) return;

    try {
      // Create start time in Local ISO format (YYYY-MM-DDTHH:MM:SS)
      const startDateTime = `${newDate}T${newTime}:00`;
      
      // Default duration is 1 hour
      const startDate = new Date(startDateTime);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      
      // Format endDate as local ISO format YYYY-MM-DDTHH:MM:SS (excluding timezone)
      const pad = (num) => String(num).padStart(2, '0');
      const endDateTime = `${endDate.getFullYear()}-${pad(endDate.getMonth()+1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:00`;

      await api.post(`/doctors/${doctorId}/slots`, {
        startDateTime,
        endDateTime
      });

      setNewDate('');
      setNewTime('');
      fetchSlots();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add availability slot.');
      console.error(err);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await api.delete(`/doctors/slots/${id}`);
      setSlots(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete slot', err);
      setError('Failed to delete slot.');
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
        Loading availability slots...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Manage Availability Slots</h1>

      {error && (
        <div style={{
          background: 'rgba(255, 23, 68, 0.1)',
          border: '1px solid rgba(255, 23, 68, 0.3)',
          borderRadius: '8px',
          padding: '0.75rem',
          color: '#ff1744',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
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
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>{formatDateTime(slot.startDateTime)}</p>
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
            {slots.length === 0 && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                No active availability slots found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
