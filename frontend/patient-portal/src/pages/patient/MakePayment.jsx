import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, getUser } from 'common';

export default function MakePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [billId, setBillId] = useState(location.state?.billId || '');
  const [amount, setAmount] = useState(location.state?.amount || 0.0);
  
  const [method, setMethod] = useState('UPI');
  const [payment, setPayment] = useState(null);
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBill, setLoadingBill] = useState(!location.state?.billId);

  // Auto-resolve unpaid bill if not provided in routing state
  useEffect(() => {
    if (!billId) {
      const user = getUser();
      if (user?.id) {
        api.get(`/billing/patient/${user.id}`)
          .then(res => {
            const unpaid = res.data.filter(b => b.status === 'UNPAID');
            if (unpaid.length > 0) {
              setBillId(unpaid[0].id);
              setAmount(unpaid[0].amount + unpaid[0].tax - unpaid[0].discount);
            }
            setLoadingBill(false);
          })
          .catch(err => {
            console.error('Error fetching bills:', err);
            setLoadingBill(false);
          });
      } else {
        setLoadingBill(false);
      }
    } else {
      setLoadingBill(false);
    }
  }, [billId]);

  // Initiate payment record on backend
  useEffect(() => {
    if (!billId) return;
    
    api.post(`/payments/initiate/${billId}?method=${method}`)
      .then(res => setPayment(res.data))
      .catch(err => console.error('Error initiating payment:', err));
  }, [billId, method]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!payment?.id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const mockTx = txId || 'TXN-' + Math.floor(Math.random() * 10000000);
      await api.post(`/payments/confirm/${payment.id}`, { transactionId: mockTx });
      setSuccess(true);
      setTimeout(() => {
        navigate('/billing-history');
      }, 2000);
    } catch (err) {
      setError('Error confirming payment. Please verify your reference number.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingBill) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Checking outstanding invoices...
      </div>
    );
  }

  if (!billId) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        No outstanding invoices found. Please go to <a href="/billing-history" style={{ color: '#00f2fe' }}>Billing History</a>.
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginTop: 0, marginBottom: '1.5rem' }}>Make Payment</h1>

        {error && (
          <div style={{
            background: 'rgba(255, 23, 68, 0.1)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#ff1744',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{
            background: 'rgba(0, 230, 118, 0.1)',
            border: '1px solid rgba(0, 230, 118, 0.4)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: '#00e676',
            marginBottom: '1rem'
          }}>
            <h3 style={{ margin: 0 }}>Payment Confirmed!</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Your transaction has been verified. Returning to Billing...
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Invoice ID</span>
              <span style={{ fontWeight: 'bold' }}>#{billId}</span>
            </div>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Total Amount</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#00f2fe' }}>${amount.toFixed(2)}</span>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Payment Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: '100%' }}>
                <option value="UPI">Simulate UPI (QR Code)</option>
                <option value="CARD">Debit / Credit Card</option>
              </select>
            </div>

            {method === 'UPI' && payment && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <img 
                  src={payment.qrCodeUrl} 
                  alt="UPI Payment QR Code" 
                  style={{ borderRadius: '8px', border: '4px solid #fff', width: '150px', height: '150px' }}
                />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Scan this QR code using any UPI app to complete checkout simulation.
                </p>
                <input 
                  type="text" 
                  placeholder="Enter Transaction Reference ID" 
                  style={{ width: '100%', textAlign: 'center' }}
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying transaction...' : 'Confirm Simulated Payment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
