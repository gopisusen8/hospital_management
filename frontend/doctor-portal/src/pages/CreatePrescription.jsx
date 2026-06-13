import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CreatePrescription() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialName = location.state?.patientName || '';
  const [patientName, setPatientName] = useState(initialName);
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div className="glass-panel">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>
          Issue Prescription
        </h1>

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
                onChange={(e) => setPatientName(e.target.value)} 
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
