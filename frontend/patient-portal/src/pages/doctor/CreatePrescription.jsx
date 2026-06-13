import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, getUser } from 'common';

export default function CreatePrescription() {
  const location = useLocation();
  const navigate = useNavigate();

  const appointment = location.state?.appointment || null;
  const initialPatientName = appointment?.patient 
    ? `${appointment.patient.firstName} ${appointment.patient.lastName}` 
    : '';

  const [patientId, setPatientId] = useState(appointment?.patient?.id || '');
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentUser = getUser();
  const doctorId = currentUser?.doctorId;

  useEffect(() => {
    if (!appointment) {
      // Fetch all patients for standalone prescription creation
      fetchPatients();
    }
  }, [appointment]);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
      if (res.data.length > 0) {
        setPatientId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load patients', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!patientId) {
      setError('Please select a patient.');
      return;
    }
    if (!doctorId) {
      setError('Doctor profile not found.');
      return;
    }

    try {
      const payload = {
        appointment: appointment ? { id: appointment.id } : null,
        patient: { id: parseInt(patientId) },
        doctor: { id: doctorId },
        date: new Date().toISOString().split('T')[0],
        instructions: `Medications:\n${medications}\n\nNotes:\n${notes}`,
        isActive: true
      };

      await api.post('/prescriptions', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish prescription');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div className="glass-panel">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>
          Issue Prescription
        </h1>

        {error && (
          <div style={{
            background: 'rgba(255, 23, 68, 0.1)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#ff1744',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{
            background: 'rgba(0, 230, 118, 0.1)',
            border: '1px solid rgba(0, 230, 118, 0.4)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#00e676'
          }}>
            <h3 style={{ margin: 0 }}>Prescription Published!</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Returning to clinical control center...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00e676' }}>Patient Name</label>
              {appointment ? (
                <input 
                  type="text" 
                  value={initialPatientName} 
                  disabled 
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }} 
                />
              ) : (
                <select 
                  value={patientId} 
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.username})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00e676' }}>Medications & Dosages</label>
              <textarea 
                rows="5" 
                placeholder="Enter medication details (e.g., Amoxicillin 500mg - 3 times daily for 7 days)..."
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00e676' }}>Usage Notes & Reminders</label>
              <textarea 
                rows="3" 
                placeholder="Additional advice (e.g. take with meals, avoid driving, etc.)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              Publish Prescription
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
