import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialDoctorId = location.state?.doctorId || '';
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);

  const handleBook = (e) => {
    e.preventDefault();
    // Simulate booking
    setSuccess(true);
    setTimeout(() => {
      navigate('/my-appointments');
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div className="glass-panel">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Book Appointment</h1>
        
        {success ? (
          <div style={{
            background: 'rgba(0, 242, 254, 0.15)',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#00f2fe'
          }}>
            <h3 style={{ margin: 0 }}>Booking Successful!</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Redirecting to your appointments checklist...
            </p>
          </div>
        ) : (
          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Doctor</label>
              <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                <option value="">Select a Doctor</option>
                <option value="1">Dr. Sarah Jenkins (Cardiology)</option>
                <option value="2">Dr. Marcus Vance (Neurology)</option>
                <option value="3">Dr. Anita Patel (Pediatrics)</option>
                <option value="4">Dr. David Kim (Orthopedics)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Available Slot</label>
              <select value={slot} onChange={(e) => setSlot(e.target.value)} required>
                <option value="">Select an Availability Slot</option>
                <option value="slot1">June 15, 2026 at 09:00 AM</option>
                <option value="slot2">June 15, 2026 at 10:30 AM</option>
                <option value="slot3">June 16, 2026 at 02:00 PM</option>
                <option value="slot4">June 17, 2026 at 11:00 AM</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Reason for Visit</label>
              <textarea 
                rows="4" 
                placeholder="Brief description of symptoms or consultation reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Confirm Booking</button>
          </form>
        )}
      </div>
    </div>
  );
}
