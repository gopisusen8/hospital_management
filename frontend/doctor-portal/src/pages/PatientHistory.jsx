import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function PatientHistory() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [records, setRecords] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState('');

  const getDoctorId = () => {
    try {
      const doc = JSON.parse(localStorage.getItem('doctor'));
      return doc?.id;
    } catch (e) {
      return null;
    }
  };

  // Fetch unique patients from doctor's appointments
  useEffect(() => {
    const docId = getDoctorId();
    if (!docId) {
      setError('Doctor profile not loaded properly.');
      setLoadingPatients(false);
      return;
    }

    api.get(`/appointments/doctor/${docId}`)
      .then(res => {
        // Extract unique patients
        const patientMap = {};
        res.data.forEach(app => {
          if (app.patient) {
            patientMap[app.patient.id] = app.patient;
          }
        });
        const patientList = Object.values(patientMap);
        setPatients(patientList);
        if (patientList.length > 0) {
          setSelectedPatientId(patientList[0].id);
        }
        setLoadingPatients(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading patients list.');
        setLoadingPatients(false);
      });
  }, []);

  // Fetch records when selected patient changes
  useEffect(() => {
    if (!selectedPatientId) {
      setRecords([]);
      return;
    }
    setLoadingRecords(true);
    api.get(`/patient-records/patient/${selectedPatientId}`)
      .then(res => {
        setRecords(res.data);
        setLoadingRecords(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingRecords(false);
      });
  }, [selectedPatientId]);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Patient History Lookup</h1>

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

      {loadingPatients ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading patient roster...</p>
      ) : patients.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>No patients registered on your schedule.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '400px' }}>
            <label style={{ fontSize: '0.85rem', color: '#00e676' }}>Select Patient</label>
            <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)}>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.email})
                </option>
              ))}
            </select>
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
            EHR Consultation History
          </h2>

          {loadingRecords ? (
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Retrieving secure patient records...</p>
          ) : records.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>No records logged for this patient.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {records.map(rec => {
                const docName = rec.doctor?.user ? (`Dr. ${rec.doctor.user.firstName} ${rec.doctor.user.lastName}`) : 'Specialist';
                return (
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
                        <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{rec.diagnosis}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#00e676' }}>Logged by {docName} ({rec.doctor?.specialization})</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{formatDate(rec.visitDate)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                      <strong>Clinical Notes:</strong> {rec.notes}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
