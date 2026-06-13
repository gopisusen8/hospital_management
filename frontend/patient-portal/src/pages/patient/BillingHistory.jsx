import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, getUser } from 'common';

export default function BillingHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!user?.id) return;
    
    api.get(`/billing/patient/${user.id}`)
      .then(res => {
        setBills(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching billing history:', err);
        setLoading(false);
      });
  }, [user?.id]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Billing History</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {bills.map(bill => (
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
              <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                {bill.appointment ? bill.appointment.reason : 'Consultation Bill'}
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Provider: Dr. {bill.appointment?.doctor.user.lastName} | Due Date: {new Date(bill.dueDate).toLocaleDateString()}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                ${(bill.amount + bill.tax - bill.discount).toFixed(2)}
              </span>
              {bill.status === 'UNPAID' && (
                <Link 
                  to="/make-payment" 
                  state={{ billId: bill.id, amount: bill.amount + bill.tax - bill.discount }} 
                  className="btn-primary" 
                  style={{ textDecoration: 'none', padding: '0.5rem 1.25rem' }}
                >
                  Pay
                </Link>
              )}
            </div>
          </div>
        ))}
        {bills.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
            No billing records found.
          </p>
        )}
      </div>
    </div>
  );
}
