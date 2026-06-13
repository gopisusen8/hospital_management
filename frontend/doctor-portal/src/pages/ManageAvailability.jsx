import React, { useState } from 'react';

const INITIAL_SLOTS = [
  { id: 1, dateTime: 'June 15, 2026 at 09:00 AM', isBooked: true },
  { id: 2, dateTime: 'June 15, 2026 at 10:30 AM', isBooked: false },
  { id: 3, dateTime: 'June 16, 2026 at 02:00 PM', isBooked: false },
  { id: 4, dateTime: 'June 17, 2026 at 11:00 AM', isBooked: false }
];

export default function ManageAvailability() {
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return;

    const formattedSlot = `${newDate} at ${newTime}`;
    setSlots(prev => [
      ...prev,
      { id: Date.now(), dateTime: formattedSlot, isBooked: false }
    ]);
    setNewDate('');
    setNewTime('');
  };

  const handleDeleteSlot = (id) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Manage Availability Slots</h1>

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
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>{slot.dateTime}</p>
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
        </div>
      </div>
    </div>
  );
}
