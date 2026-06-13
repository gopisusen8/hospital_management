import React from 'react';
import PatientDashboard from './Dashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';


export default function UnifiedHome() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', color: '#00f2fe' }}>CareFlow Unified Dashboard</h1>
      {/* Patient Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', color: '#00f2fe', marginBottom: '0.5rem' }}>Patient View</h2>
        <PatientDashboard />
      </section>
      {/* Doctor Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', color: '#00e676', marginBottom: '0.5rem' }}>Doctor View</h2>
        <DoctorDashboard />
      </section>
      {/* Admin Section */}
      <section>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', color: '#ba68c8', marginBottom: '0.5rem' }}>Admin View</h2>
        <AdminDashboard />
      </section>
    </div>
  );
}
