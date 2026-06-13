import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from 'common';

export default function Dashboard() {
  const user = getUser();
  const greeting = user ? `Dr. ${user.firstName} ${user.lastName}` : 'Clinician';

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {greeting}!</h1>
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
            <h3 style={{ marginTop: 0, color: '#00e676' }}>Today's Consultations</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0' }}>8</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>3 slots remaining, 5 completed</p>
          </div>
          <Link to="/appointments" style={{ color: '#00e676', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            Open Consult List &rarr;
          </Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00e676' }}>Active Schedule</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0.5rem 0' }}>June 15 - June 19</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>25 open slots created for next week</p>
          </div>
          <Link to="/manage-availability" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
            Edit Slots
          </Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00e676' }}>Clinical Audit Logs</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Last login: Today 08:30 AM</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>All updates logged automatically by system security</p>
          </div>
          <Link to="/my-schedule" style={{ color: '#00e676', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            Check Schedule Grid &rarr;
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
