import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, getUser } from 'common';

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getUser();
  
  const initialDoctorId = location.state?.doctorId || '';
  
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch all doctors
  useEffect(() => {
    api.get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);

  // 2. Fetch slots for chosen doctor
  useEffect(() => {
    if (!doctorId) {
      setSlots([]);
      return;
    }
    api.get(`/doctors/${doctorId}/slots`)
      .then(res => {
        // Filter out already booked slots
        const available = res.data.filter(s => !s.isBooked);
        setSlots(available);
      })
      .catch(err => console.error('Error fetching slots:', err));
  }, [doctorId]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    if (!currentUser?.id) {
      setError('You must be logged in to book an appointment.');
      return;
    }
    if (!doctorId || !slotId) {
      setError('Please select a doctor and an available slot.');
      return;
    }

    try {
      const selectedDocObj = doctors.find(d => d.id === parseInt(doctorId));
      
      const payload = {
        patient: { id: currentUser.id },
        doctor: { id: parseInt(doctorId), consultationFee: selectedDocObj?.consultationFee },
        slot: { id: parseInt(slotId) },
        reason: reason,
        status: "CONFIRMED"
      };

      await api.post('/appointments', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment. Please try again.');
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

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div className="glass-panel">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Book Appointment</h1>
        
        {error && (
          <div style={{
            background: 'rgba(255, 23, 68, 0.1)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#ff1744',
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
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.user?.firstName || ''} {doc.user?.lastName || ''} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Available Slot</label>
              <select value={slotId} onChange={(e) => setSlotId(e.target.value)} required>
                <option value="">Select an Availability Slot</option>
                {slots.map(s => (
                  <option key={s.id} value={s.id}>
                    {formatDate(s.startDateTime)}
                  </option>
                ))}
              </select>
              {doctorId && slots.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: '#ffb300', marginTop: '0.25rem' }}>
                  No available slots for this doctor.
                </span>
              )}
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
