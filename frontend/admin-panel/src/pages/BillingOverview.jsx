import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function BillingOverview() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/billing')
      .then(res => {
        setInvoices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading billing summary.');
        setLoading(false);
      });
  }, []);

  const totalRevenue = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + (i.amount + i.tax - i.discount), 0);

  const outstanding = invoices
    .filter(i => i.status === 'UNPAID')
    .reduce((sum, i) => sum + (i.amount + i.tax - i.discount), 0);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID': return { background: 'rgba(0, 230, 118, 0.1)', color: '#00e676', border: '1px solid rgba(0, 230, 118, 0.3)' };
      case 'UNPAID': return { background: 'rgba(255, 179, 0, 0.1)', color: '#ffb300', border: '1px solid rgba(255, 179, 0, 0.3)' };
      case 'CANCELLED': return { background: 'rgba(255, 23, 68, 0.1)', color: '#ff1744', border: '1px solid rgba(255, 23, 68, 0.3)' };
      default: return { background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' };
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Billing & Revenue Overview</h1>

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

      {/* Revenue stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card">
          <h4 style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>Total Revenue Collected</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0', color: '#00e676' }}>
            ${loading ? '0.00' : totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="glass-card">
          <h4 style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>Total Outstanding Invoices</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0', color: '#ffb300' }}>
            ${loading ? '0.00' : outstanding.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Invoices log */}
      <div className="glass-panel">
        <h3 style={{ margin: '0 0 1.25rem 0', color: '#ba68c8' }}>Recent Patient Invoices</h3>
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No bills generated in the system yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {invoices.map(inv => {
              const patientName = inv.patient ? `${inv.patient.firstName} ${inv.patient.lastName}` : 'Guest Patient';
              const finalTotal = inv.amount + (inv.tax || 0) - (inv.discount || 0);
              return (
                <div key={inv.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{patientName}</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                      Invoice #{inv.id} | Due Date: {formatDate(inv.dueDate)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>${finalTotal.toFixed(2)}</span>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      ...getStatusStyle(inv.status)
                    }}>{inv.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
