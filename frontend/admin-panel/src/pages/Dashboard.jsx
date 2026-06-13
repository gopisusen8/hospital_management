import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const totalBeds = 150;
  const occupiedBeds = 98;
  const occupancyPercentage = ((occupiedBeds / totalBeds) * 100).toFixed(1);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hospital Control Center</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
        Real-time occupancy telemetry, doctor logs, billing totals, and security audits.
      </p>

      {/* Grid of occupancy and status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Real-time Occupancy Card */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginTop: 0, color: '#ba68c8' }}>Real-time Bed Occupancy</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{occupancyPercentage}%</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              {occupiedBeds} / {totalBeds} Beds Filled
            </span>
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${occupancyPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #ba68c8 0%, #da8ae8 100%)', borderRadius: '6px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            <div>🔴 ICU: 12/15 Beds</div>
            <div>🟡 Emergency: 8/20 Beds</div>
            <div>🟢 General: 78/115 Beds</div>
          </div>
        </div>

        {/* Quick Audit Snapshot Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#ba68c8' }}>Security Audit Snapshot</h3>
            <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>System Integrity Check</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>0 security anomalies detected in last 24 hours.</p>
          </div>
          <Link to="/audit-logs" style={{ color: '#ba68c8', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            Review Audit Trail &rarr;
          </Link>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: '1.5rem' }}>Management Portlets</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <Link to="/manage-doctors" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍⚕️</div>
          <h4 style={{ margin: 0 }}>Manage Doctors</h4>
        </Link>
        <Link to="/manage-departments" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
          <h4 style={{ margin: 0 }}>Manage Departments</h4>
        </Link>
        <Link to="/billing-overview" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💵</div>
          <h4 style={{ margin: 0 }}>Billing Overview</h4>
        </Link>
        <Link to="/reports" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
          <h4 style={{ margin: 0 }}>Reports & Statistics</h4>
        </Link>
      </div>
    </div>
  );
}
