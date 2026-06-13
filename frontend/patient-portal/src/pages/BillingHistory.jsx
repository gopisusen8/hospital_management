import React from 'react';
import { Link } from 'react-router-dom';

const DUMMY_BILLS = [
  { id: 101, appointmentDate: 'May 04, 2026', doctorName: 'Dr. Anita Patel', description: 'Pediatric Consult & Flu Shot', amount: 150.0, status: 'UNPAID', dueDate: 'June 18, 2026' },
  { id: 102, appointmentDate: 'Oct 12, 2025', doctorName: 'Dr. Sarah Jenkins', description: 'Cardiology Consult & ECG', amount: 250.0, status: 'PAID', dueDate: 'Oct 27, 2025' }
];

export default function BillingHistory() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Billing History</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {DUMMY_BILLS.map(bill => (
          <div key={bill.id} className="glass-card" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Invoice #{bill.id}</span>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: bill.status === 'PAID' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 179, 0, 0.1)',
                  color: bill.status === 'PAID' ? '#00e676' : '#ffb300',
                  border: bill.status === 'PAID' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(255, 179, 0, 0.3)'
                }}>{bill.status}</span>
              </div>
              <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{bill.description}</h3>
              <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Provider: {bill.doctorName} | Visit Date: {bill.appointmentDate}
              </p>
              {bill.status === 'UNPAID' && (
                <p style={{ margin: '0.25rem 0 0 0', color: '#ffb300', fontSize: '0.85rem', fontWeight: 500 }}>
                  Due Date: {bill.dueDate}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>${bill.amount.toFixed(2)}</span>
              {bill.status === 'UNPAID' && (
                <Link to="/make-payment" state={{ billId: bill.id, amount: bill.amount }} className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1.25rem' }}>
                  Pay
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
