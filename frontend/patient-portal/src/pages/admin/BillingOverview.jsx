import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function BillingOverview() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/billing');
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load billing history invoices.');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + i.amount, 0);

  const outstanding = invoices
    .filter(i => i.status === 'UNPAID')
    .reduce((sum, i) => sum + i.amount, 0);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading billing details...
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
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Billing & Revenue Overview</h1>

      {/* Revenue stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card">
          <h4 style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>Total Revenue Collected</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0', color: '#00e676' }}>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="glass-card">
          <h4 style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>Total Outstanding Invoices</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0', color: '#ffb300' }}>${outstanding.toFixed(2)}</p>
        </div>
      </div>

      {/* Invoices log */}
      <div className="glass-panel">
        <h3 style={{ margin: '0 0 1.25rem 0', color: '#ba68c8' }}>Recent Patient Invoices</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {invoices.map(inv => (
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
                <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  {inv.patient ? `${inv.patient.firstName} ${inv.patient.lastName}` : 'Unknown Patient'}
                </h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Invoice #{inv.id} | Due Date: {inv.dueDate}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>${inv.amount.toFixed(2)}</span>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: inv.status === 'PAID' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 179, 0, 0.1)',
                  color: inv.status === 'PAID' ? '#00e676' : '#ffb300',
                  border: inv.status === 'PAID' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255, 179, 0, 0.3)'
                }}>{inv.status}</span>
              </div>
            </div>
          ))}
          {invoices.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No patient invoices found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
