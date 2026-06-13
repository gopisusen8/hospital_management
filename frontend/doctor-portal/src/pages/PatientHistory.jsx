import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function PatientHistory() {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patient-records');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load patient records history.');
    } finally {
      setLoading(false);
    }
  };

  const getPatientFullName = (patient) => {
    if (!patient) return 'Unknown Patient';
    return `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || patient.username;
  };

  const getDoctorFullName = (doctor) => {
    if (!doctor || !doctor.user) return 'Unknown Physician';
    return `Dr. ${doctor.user.firstName || ''} ${doctor.user.lastName || ''}`.trim();
  };

  const filtered = records.filter(rec => {
    const fullName = getPatientFullName(rec.patient).toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading patient records...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ff1744' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Patient History Lookup</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Filter by Patient Name (e.g. John Doe)..." 
          style={{ flex: 1 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filtered.map(rec => (
          <div key={rec.id} className="glass-card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  {getPatientFullName(rec.patient)}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#00e676', fontWeight: 600 }}>
                  {rec.diagnosis}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  {rec.visitDate}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                  Logged by {getDoctorFullName(rec.doctor)}
                </p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
              <strong>Clinical Notes:</strong> {rec.notes}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
            No clinical logs found matching query.
          </p>
        )}
      </div>
    </div>
  );
}
