import React from 'react';

const DUMMY_INVOICES = [
  { id: 101, patientName: 'John Doe', amount: 150.00, status: 'UNPAID', date: 'June 04, 2026' },
  { id: 102, patientName: 'Alice Green', amount: 250.00, status: 'PAID', date: 'May 12, 2026' },
  { id: 103, patientName: 'Robert Vance', amount: 350.00, status: 'PAID', date: 'April 20, 2026' }
];

export default function BillingOverview() {
  const totalRevenue = DUMMY_INVOICES
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + i.amount, 0);

  const outstanding = DUMMY_INVOICES
    .filter(i => i.status === 'UNPAID')
    .reduce((sum, i) => sum + i.amount, 0);

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
          {DUMMY_INVOICES.map(inv => (
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
                <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{inv.patientName}</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Invoice #{inv.id} | Issued: {inv.date}
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
        </div>
      </div>
    </div>
  );
}
