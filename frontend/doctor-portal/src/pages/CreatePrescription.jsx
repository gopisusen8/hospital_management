import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from 'common';

export default function CreatePrescription() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialName = location.state?.patientName || '';
  const patientId = location.state?.patientId || null;
  const appointmentId = location.state?.appointmentId || null;

  const [patientName, setPatientName] = useState(initialName);
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const getDoctorId = () => {
    try {
      const doc = JSON.parse(localStorage.getItem('doctor'));
      return doc?.id;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const docId = getDoctorId();
    if (!docId) {
      setError('Doctor profile not loaded properly.');
      return;
    }
    if (!patientId || !appointmentId) {
      setError('Patient and consultation details missing.');
      return;
    }

    const pad = (n) => n < 10 ? '0' + n : n;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;

    try {
      await api.post('/prescriptions', {
        appointment: { id: appointmentId },
        patient: { id: patientId },
        doctor: { id: docId },
        date: dateStr,
        isActive: true,
        instructions: medications + (notes ? `\n\nClinical Notes:\n${notes}` : '')
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to publish digital prescription.');
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
              <input 
                type="text" 
                placeholder="e.g. John Doe" 
                value={patientName} 
                disabled
                required 
              />
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
