import React, { useState, useEffect } from 'react';
import { api, getUser } from 'common';

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getUser();
    if (!user || !user.id) {
      setError('Please log in again.');
      setLoading(false);
      return;
    }

    api.get(`/patient-records/patient/${user.id}`)
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading medical records.');
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Medical Records</h1>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>Loading records...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#ff1744', marginTop: '2rem' }}>{error}</p>
      ) : records.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>No medical history records found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {records.map(rec => {
            const docName = rec.doctor?.user ? (`Dr. ${rec.doctor.user.firstName} ${rec.doctor.user.lastName}`) : 'Specialist';
            return (
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
                      Consultation with {docName} ({rec.doctor?.specialization})
                    </p>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    {formatDate(rec.visitDate)}
                  </span>
                </div>

                <p style={{ fontSize: '0.95rem', margin: '0.5rem 0', color: 'rgba(255,255,255,0.8)' }}>
                  <strong>Notes:</strong> {rec.notes}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
