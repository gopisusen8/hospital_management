import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back!</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
        Here is a summary of your recent health activities and appointments.
      </p>

      {/* Grid of Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00f2fe' }}>Next Appointment</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Dr. Sarah Jenkins</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Cardiology - Room 402</p>
            <p style={{ color: '#00f2fe', fontWeight: 500 }}>Oct 14, 2026 at 10:00 AM</p>
          </div>
          <Link to="/my-appointments" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            View Details &rarr;
          </Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00f2fe' }}>Outstanding Bills</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0' }}>$150.00</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Consultation & Lab test bill due in 5 days</p>
          </div>
          <Link to="/make-payment" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
            Pay Now
          </Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00f2fe' }}>Recent Prescription</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Lisinopril 10mg</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Take once daily in the morning</p>
            <p style={{ color: '#00f2fe', fontWeight: 500 }}>Prescribed by Dr. Jenkins</p>
          </div>
          <Link to="/prescriptions" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            View Prescriptions &rarr;
          </Link>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: '1.5rem' }}>Portal Activities</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <Link to="/search-doctors" className="glass-card" style={{ textDecoration: 'none', color: '#inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
          <h4 style={{ margin: 0 }}>Search Doctors</h4>
        </Link>
        <Link to="/book-appointment" className="glass-card" style={{ textDecoration: 'none', color: '#inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
          <h4 style={{ margin: 0 }}>Book Appointment</h4>
        </Link>
        <Link to="/medical-records" className="glass-card" style={{ textDecoration: 'none', color: '#inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
          <h4 style={{ margin: 0 }}>Medical Records</h4>
        </Link>
        <Link to="/billing-history" className="glass-card" style={{ textDecoration: 'none', color: '#inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
          <h4 style={{ margin: 0 }}>Billing History</h4>
        </Link>
      </div>
    </div>
  );
}
