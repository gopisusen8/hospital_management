import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from 'common';

export default function Dashboard() {
  const [apptStats, setApptStats] = useState({ total: 0, confirmed: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const doc = JSON.parse(localStorage.getItem('doctor'));
      if (doc?.id) {
        api.get(`/appointments/doctor/${doc.id}`)
          .then(res => {
            const appts = res.data || [];
            const confirmed = appts.filter(a => a.status?.toUpperCase() === 'CONFIRMED').length;
            const completed = appts.filter(a => a.status?.toUpperCase() === 'COMPLETED').length;
            const pending = appts.filter(a => a.status?.toUpperCase() === 'REQUESTED').length;
            setApptStats({ total: appts.length, confirmed, completed, pending });
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const doctorName = (() => {
    try {
      const doc = JSON.parse(localStorage.getItem('doctor'));
      const user = JSON.parse(localStorage.getItem('user'));
      if (doc) return doc.specialization || 'Doctor';
      if (user) return user.username;
    } catch (e) {}
    return 'Doctor';
  })();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Clinical Dashboard</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
        Manage patient consults, write prescriptions, and adjust your availability slots.
      </p>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00e676' }}>Appointment Summary</h3>
            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading...</p>
            ) : (
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#00f2fe' }}>{apptStats.confirmed}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0 0' }}>Confirmed</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#ffb300' }}>{apptStats.pending}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0 0' }}>Pending</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#00e676' }}>{apptStats.completed}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0 0' }}>Completed</p>
                </div>
              </div>
            )}
          </div>
          <Link to="/appointments" style={{ color: '#00e676', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            Open Consult List &rarr;
          </Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00e676' }}>Active Schedule</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0.5rem 0' }}>Manage Your Slots</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Create, view and delete availability time slots for patients to book.</p>
          </div>
          <Link to="/manage-availability" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
            Edit Slots
          </Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00e676' }}>EHR & Patient Records</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>All Records Encrypted</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Diagnosis notes and clinical records are AES-128 encrypted at rest.</p>
          </div>
          <Link to="/patient-history" style={{ color: '#00e676', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            Search Patient History &rarr;
          </Link>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: '1.5rem' }}>Workstation Actions</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <Link to="/appointments" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
          <h4 style={{ margin: 0 }}>View Appointments</h4>
        </Link>
        <Link to="/patient-history" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
          <h4 style={{ margin: 0 }}>Patient History Search</h4>
        </Link>
        <Link to="/create-prescription" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✏️</div>
          <h4 style={{ margin: 0 }}>Write Prescription</h4>
        </Link>
        <Link to="/manage-availability" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕒</div>
          <h4 style={{ margin: 0 }}>Manage Slots</h4>
        </Link>
      </div>
    </div>
  );
}
