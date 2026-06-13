import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, getUser } from 'common';

export default function Dashboard() {
  const [nextAppointment, setNextAppointment] = useState(null);
  const [unpaidBills, setUnpaidBills] = useState(0.0);
  const [recentPrescription, setRecentPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchData = async () => {
      try {
        // 1. Fetch appointments
        const appointmentsRes = await api.get(`/appointments/patient/${user.id}`);
        const confirmed = appointmentsRes.data.filter(app => app.status === 'CONFIRMED');
        if (confirmed.length > 0) {
          // Sort by slot time (ascending) and get first
          confirmed.sort((a, b) => new Date(a.slot.startDateTime) - new Date(b.slot.startDateTime));
          setNextAppointment(confirmed[0]);
        }

        // 2. Fetch bills
        const billsRes = await api.get(`/billing/patient/${user.id}`);
        const unpaidTotal = billsRes.data
          .filter(b => b.status === 'UNPAID')
          .reduce((sum, b) => sum + (b.amount + b.tax - b.discount), 0.0);
        setUnpaidBills(unpaidTotal);

        // 3. Fetch prescriptions
        const prescriptionsRes = await api.get(`/prescriptions/patient/${user.id}`);
        if (prescriptionsRes.data.length > 0) {
          setRecentPrescription(prescriptionsRes.data[prescriptionsRes.data.length - 1]);
        }
      } catch (err) {
        console.error('Error fetching dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading dashboard telemetry...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back, {user?.username}!</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
        Here is a summary of your recent health activities and appointments.
      </p>

      {/* Grid of Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Next Appointment */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00f2fe' }}>Next Appointment</h3>
            {nextAppointment ? (
              <>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  Dr. {nextAppointment.doctor.user.firstName} {nextAppointment.doctor.user.lastName}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {nextAppointment.doctor.specialization} - {nextAppointment.doctor.department}
                </p>
                <p style={{ color: '#00f2fe', fontWeight: 500 }}>
                  {formatDate(nextAppointment.slot.startDateTime)}
                </p>
              </>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>No upcoming consultations.</p>
            )}
          </div>
          <Link to="/my-appointments" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            View Details &rarr;
          </Link>
        </div>

        {/* Outstanding Bills */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00f2fe' }}>Outstanding Bills</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>${unpaidBills.toFixed(2)}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              {unpaidBills > 0 ? 'Pending medical invoices require settlement' : 'All invoices fully settled.'}
            </p>
          </div>
          {unpaidBills > 0 && (
            <Link to="/make-payment" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
              Pay Now
            </Link>
          )}
        </div>

        {/* Recent Prescription */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#00f2fe' }}>Recent Prescription</h3>
            {recentPrescription ? (
              <>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  Prescribed on {new Date(recentPrescription.date).toLocaleDateString()}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                  {recentPrescription.instructions}
                </p>
                <p style={{ color: '#00f2fe', fontWeight: 500, fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  By Dr. {recentPrescription.doctor.user.lastName}
                </p>
              </>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>No prescription logs found.</p>
            )}
          </div>
          <Link to="/prescriptions" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
            View Prescriptions &rarr;
          </Link>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: '1.5rem' }}>Portal Activities</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <Link to="/search-doctors" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
          <h4 style={{ margin: 0 }}>Search Doctors</h4>
        </Link>
        <Link to="/book-appointment" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
          <h4 style={{ margin: 0 }}>Book Appointment</h4>
        </Link>
        <Link to="/medical-records" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
          <h4 style={{ margin: 0 }}>Medical Records</h4>
        </Link>
        <Link to="/billing-history" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
          <h4 style={{ margin: 0 }}>Billing History</h4>
        </Link>
      </div>
    </div>
  );
}
