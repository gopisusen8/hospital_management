import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, getUser } from 'common';

export default function BillingHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getUser();
    if (!user || !user.id) {
      setError('Please log in again.');
      setLoading(false);
      return;
    }

    api.get(`/billing/patient/${user.id}`)
      .then(res => {
        setBills(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading bills.');
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
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
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Billing History</h1>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>Loading billing information...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#ff1744', marginTop: '2rem' }}>{error}</p>
      ) : bills.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>No bills found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bills.map(bill => {
            const finalTotal = bill.amount + (bill.tax || 0) - (bill.discount || 0);
            const docName = bill.appointment?.doctor?.user ? (`Dr. ${bill.appointment.doctor.user.firstName} ${bill.appointment.doctor.user.lastName}`) : 'Provider';
            const spec = bill.appointment?.doctor?.specialization || 'General Consult';
            
            return (
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
                      ...getStatusStyle(bill.status)
                    }}>{bill.status}</span>
                  </div>
                  <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{spec} Consultation</h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                    Provider: {docName} | Tax: ${bill.tax?.toFixed(2)} | Discount: -${bill.discount?.toFixed(2)}
                  </p>
                  {bill.status === 'UNPAID' && (
                    <p style={{ margin: '0.25rem 0 0 0', color: '#ffb300', fontSize: '0.85rem', fontWeight: 500 }}>
                      Due Date: {formatDate(bill.dueDate)}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>${finalTotal.toFixed(2)}</span>
                  {bill.status === 'UNPAID' && (
                    <Link to="/make-payment" state={{ billId: bill.id, amount: finalTotal }} className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1.25rem' }}>
                      Pay
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
