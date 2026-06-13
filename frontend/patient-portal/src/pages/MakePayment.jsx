import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, getUser } from 'common';

export default function MakePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const stateBillId = location.state?.billId || null;
  const stateAmount = location.state?.amount || null;

  const [unpaidBills, setUnpaidBills] = useState([]);
  const [selectedBillId, setSelectedBillId] = useState(stateBillId || '');
  const [amount, setAmount] = useState(stateAmount || 0);

  const [method, setMethod] = useState('UPI');
  const [paymentRecord, setPaymentRecord] = useState(null);
  const [txId, setTxId] = useState('');
  const [initiated, setInitiated] = useState(false);
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [expired, setExpired] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch unpaid bills if none provided in state
  useEffect(() => {
    if (!stateBillId) {
      const user = getUser();
      if (user && user.id) {
        api.get(`/billing/patient/${user.id}`)
          .then(res => {
            const unpaid = res.data.filter(b => b.status === 'UNPAID');
            setUnpaidBills(unpaid);
            if (unpaid.length > 0) {
              setSelectedBillId(unpaid[0].id);
              setAmount(unpaid[0].amount + unpaid[0].tax - unpaid[0].discount);
            }
          })
          .catch(err => console.error(err));
      }
    }
  }, [stateBillId]);

  // Update amount when selected bill changes
  const handleBillSelect = (e) => {
    const bId = parseInt(e.target.value);
    setSelectedBillId(bId);
    const bill = unpaidBills.find(b => b.id === bId);
    if (bill) {
      setAmount(bill.amount + bill.tax - bill.discount);
    }
  };

  // Timer countdown hook
  useEffect(() => {
    if (!initiated || success || expired) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          setError('Payment session has timed out. The appointment has been auto-cancelled.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initiated, success, expired]);

  // Initiate Payment
  const handleInitiate = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedBillId) {
      setError('Please select a bill to pay.');
      return;
    }
    try {
      const response = await api.post(`/payments/initiate/${selectedBillId}?method=${method}`);
      setPaymentRecord(response.data);
      setInitiated(true);
      setTimeLeft(120);
      setExpired(false);
    } catch (err) {
      console.error(err);
      setError('Failed to initiate payment.');
    }
  };

  // Confirm Payment
  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    if (expired) {
      setError('Cannot confirm payment: Session expired.');
      return;
    }
    if (!txId.trim()) {
      setError('Please enter a transaction reference.');
      return;
    }
    try {
      await api.post(`/payments/confirm/${paymentRecord.id}`, {
        transactionId: txId
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/billing-history');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Confirmation failed. Please check your reference and try again.');
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div className="glass-panel">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Make Payment</h1>

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

        {success ? (
          <div style={{
            background: 'rgba(0, 230, 118, 0.1)',
            border: '1px solid rgba(0, 230, 118, 0.4)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: '#00e676',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: 0 }}>Payment Confirmed!</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Your transaction has been verified. Returning to Billing...
            </p>
          </div>
        ) : !initiated ? (
          <form onSubmit={handleInitiate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {!stateBillId ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Select Outstanding Invoice</label>
                {unpaidBills.length === 0 ? (
                  <select disabled><option>No outstanding invoices found</option></select>
                ) : (
                  <select value={selectedBillId} onChange={handleBillSelect}>
                    {unpaidBills.map(b => (
                      <option key={b.id} value={b.id}>
                        Invoice #{b.id} - {b.appointment?.doctor?.specialization || 'Consult'} (${(b.amount + b.tax - b.discount).toFixed(2)})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Invoice ID</span>
                <span style={{ fontWeight: 'bold' }}>#{selectedBillId}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Total Amount (inc. Tax/Discount)</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#00f2fe' }}>${amount.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Payment Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="UPI">Simulate UPI (QR Code)</option>
                <option value="CARD">Debit / Credit Card</option>
                <option value="CASH">Cash at Front Desk</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={!selectedBillId}>
              Initiate Payment
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              background: expired ? 'rgba(255, 8, 68, 0.1)' : 'rgba(0, 242, 254, 0.1)',
              border: expired ? '1px solid rgba(255, 8, 68, 0.3)' : '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontWeight: 'bold',
              color: expired ? '#ff1744' : '#00f2fe',
              fontSize: '1.1rem',
              width: '100%',
              textAlign: 'center'
            }}>
              {expired ? 'EXPIRED' : `Time Remaining: ${formatTime(timeLeft)}`}
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Invoice ID</span>
              <span style={{ fontWeight: 'bold' }}>#{selectedBillId}</span>
            </div>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Amount Due</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#00f2fe' }}>${amount.toFixed(2)}</span>
            </div>

            {method === 'UPI' && paymentRecord?.qrCodeUrl && (
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
                  src={paymentRecord.qrCodeUrl} 
                  alt="Simulated UPI QR Code" 
                  style={{ borderRadius: '8px', border: '4px solid #fff', width: '200px', height: '200px', filter: expired ? 'grayscale(100%) opacity(50%)' : 'none' }}
                />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                  Scan the generated QR code above with any UPI app.
                </p>
              </div>
            )}

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Transaction ID / Receipt Reference</label>
              <input 
                type="text" 
                placeholder={expired ? "Session expired" : "e.g. TXN987654321"} 
                style={{ width: '100%', textAlign: 'center' }}
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                disabled={expired}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button type="button" className="btn-secondary" onClick={() => setInitiated(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={expired}>
                I have completed payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
