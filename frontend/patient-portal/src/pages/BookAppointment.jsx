import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, getUser } from 'common';

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialDoctorId = location.state?.doctorId || '';
  
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch doctors list
  useEffect(() => {
    api.get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);

  // Fetch slots when doctor changes
  useEffect(() => {
    if (!doctorId) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setError('');
    api.get(`/availability-slots/doctor/${doctorId}/available`)
      .then(res => {
        setSlots(res.data);
        setLoadingSlots(false);
      })
      .catch(err => {
        console.error('Error fetching slots:', err);
        setLoadingSlots(false);
      });
  }, [doctorId]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    const user = getUser();
    if (!user || !user.id) {
      setError('Please log in again.');
      return;
    }

    try {
      await api.post('/appointments', {
        patient: { id: user.id },
        doctor: { id: parseInt(doctorId) },
        slot: { id: parseInt(slotId) },
        reason: reason
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/make-payment');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Double booking collision or server error occurred.');
    }
  };

  const formatSlotTime = (startStr) => {
    try {
      const date = new Date(startStr);
      return date.toLocaleString();
    } catch (e) {
      return startStr;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div className="glass-panel">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Book Appointment</h1>
        
        {error && (
          <div style={{
            background: 'rgba(255, 8, 68, 0.15)',
            border: '1px solid rgba(255, 8, 68, 0.4)',
            color: '#ffb199',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{
            background: 'rgba(0, 242, 254, 0.15)',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#00f2fe'
          }}>
            <h3 style={{ margin: 0 }}>Booking Initiated!</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Redirecting to payments workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Doctor</label>
              <select value={doctorId} onChange={(e) => { setDoctorId(e.target.value); setSlotId(''); }} required>
                <option value="">Select a Doctor</option>
                {doctors.map(doc => {
                  const name = doc.user ? (`Dr. ${doc.user.firstName} ${doc.user.lastName}`) : 'Dr. Specialist';
                  return (
                    <option key={doc.id} value={doc.id}>
                      {name} ({doc.specialization})
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Available Slot</label>
              <select value={slotId} onChange={(e) => setSlotId(e.target.value)} required disabled={!doctorId || loadingSlots}>
                <option value="">
                  {loadingSlots ? 'Loading slots...' : !doctorId ? 'Select a doctor first' : slots.length === 0 ? 'No slots available' : 'Select an Availability Slot'}
                </option>
                {slots.map(s => (
                  <option key={s.id} value={s.id}>
                    {formatSlotTime(s.startDateTime)}
                  </option>
                ))}
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
