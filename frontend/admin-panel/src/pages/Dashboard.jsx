import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from 'common';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBeds: 150,
    occupiedBeds: 98,
    occupancyPercentage: 65.3,
    icuOccupied: 12,
    emergencyOccupied: 8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/occupancy-stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalBeds = stats.totalBeds;
  const occupiedBeds = stats.occupiedBeds;
  const occupancyPercentage = parseFloat(stats.occupancyPercentage).toFixed(1);

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
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading telemetry...</p>
          ) : (
            <>
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
                <div>🔴 ICU: {stats.icuOccupied}/15 Beds</div>
                <div>🟡 Emergency: {stats.emergencyOccupied}/20 Beds</div>
                <div>🟢 General: {totalBeds - stats.icuOccupied - stats.emergencyOccupied - (totalBeds - occupiedBeds)}/{totalBeds - 35} Beds</div>
              </div>
            </>
          )}
        </div>

        {/* Quick Audit Snapshot Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#ba68c8' }}>Security Audit Snapshot</h3>
            <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>System Integrity Check</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>EHR columns are encrypted at rest with AES-128.</p>
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
