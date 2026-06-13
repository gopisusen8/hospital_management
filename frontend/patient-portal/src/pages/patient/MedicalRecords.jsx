import React, { useState, useEffect } from 'react';
import { api, getUser } from 'common';

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!user?.id) return;
    
    api.get(`/patient-records/patient/${user.id}`)
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching patient records:', err);
        setLoading(false);
      });
  }, [user?.id]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Medical Records</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {records.map(rec => (
          <div key={rec.id} className="glass-card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div>
                <h3 style={{ margin: 0, color: '#00f2fe' }}>{rec.diagnosis}</h3>
                <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                  Consultation with Dr. {rec.doctor.user.firstName} {rec.doctor.user.lastName}
                </p>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                {new Date(rec.visitDate).toLocaleDateString()}
              </span>
            </div>

            <p style={{ fontSize: '0.95rem', margin: '0.5rem 0', color: 'rgba(255,255,255,0.8)' }}>
              <strong>Notes:</strong> {rec.notes}
            </p>
          </div>
        ))}
        {records.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
            No clinical records logged.
          </p>
        )}
      </div>
    </div>
  );
}
