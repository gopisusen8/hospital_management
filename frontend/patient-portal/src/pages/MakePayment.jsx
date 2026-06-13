import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MakePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const billId = location.state?.billId || 101;
  const amount = location.state?.amount || 150.0;
  
  const [method, setMethod] = useState('UPI');
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  const handlePay = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      navigate('/billing-history');
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginTop: 0, marginBottom: '1.5rem' }}>Make Payment</h1>

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
                <option value="CASH">Cash at Desk</option>
              </select>
            </div>

            {method === 'UPI' && (
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
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPI:invoice${billId}`} 
                  alt="UPI Payment QR Code" 
                  style={{ borderRadius: '8px', border: '4px solid #fff', width: '150px', height: '150px' }}
                />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Scan this QR code using any UPI app to complete checkout simulation.
                </p>
                <input 
                  type="text" 
                  placeholder="Enter Mock Transaction Reference" 
                  style={{ width: '100%', textAlign: 'center' }}
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Confirm Mock Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
