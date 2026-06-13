import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, getUser } from 'common';

export default function Dashboard() {
  const [nextAppointment, setNextAppointment] = useState(null);
  const [outstandingBills, setOutstandingBills] = useState([]);
  const [recentPrescription, setRecentPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user?.id) { setLoading(false); return; }

    const patientId = user.id;

    Promise.allSettled([
      api.get(`/appointments/patient/${patientId}`),
      api.get(`/billing/patient/${patientId}`),
      api.get(`/prescriptions/patient/${patientId}`)
    ]).then(([apptRes, billRes, presRes]) => {
      // Appointments — find next upcoming confirmed/requested
      if (apptRes.status === 'fulfilled') {
        const now = new Date();
        const upcoming = (apptRes.value.data || [])
          .filter(a => {
            const s = a.status?.toUpperCase();
            return (s === 'CONFIRMED' || s === 'REQUESTED') && a.slot?.startDateTime && new Date(a.slot.startDateTime) > now;
          })
          .sort((a, b) => new Date(a.slot.startDateTime) - new Date(b.slot.startDateTime));
        setNextAppointment(upcoming[0] || null);
      }
      // Bills — outstanding unpaid
      if (billRes.status === 'fulfilled') {
        const unpaid = (billRes.value.data || []).filter(b => b.status?.toUpperCase() === 'UNPAID');
        setOutstandingBills(unpaid);
      }
      // Prescriptions — most recent active
      if (presRes.status === 'fulfilled') {
        const active = (presRes.value.data || []).filter(p => p.isActive !== false);
        setRecentPrescription(active[active.length - 1] || null);
      }
      setLoading(false);
    });
  }, []);

  const totalOwed = outstandingBills.reduce((sum, b) => sum + (b.amount || 0) + (b.tax || 0) - (b.discount || 0), 0);
  const user = getUser();
  const firstName = user?.username || 'Patient';

  const formatSlotTime = (slot) => {
    if (!slot?.startDateTime) return 'TBD';
    return new Date(slot.startDateTime).toLocaleString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
        Welcome back, <span style={{ color: '#00f2fe' }}>{firstName}</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
        Here is a live summary of your health activities and upcoming appointments.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading your health dashboard...</p>
        </div>
      ) : (
        <>
          {/* Live Summary Cards */}
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
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0' }}>
                      {nextAppointment.doctor?.user
                        ? `Dr. ${nextAppointment.doctor.user.firstName} ${nextAppointment.doctor.user.lastName}`
                        : 'Specialist'}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                      {nextAppointment.doctor?.specialization} · {nextAppointment.doctor?.department}
                    </p>
                    <p style={{ color: '#00f2fe', fontWeight: 500, margin: '0.25rem 0' }}>
                      {formatSlotTime(nextAppointment.slot)}
                    </p>
                  </>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', margin: '1rem 0' }}>No upcoming appointments</p>
                )}
              </div>
              <Link to="/my-appointments" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
                View All Appointments &rarr;
              </Link>
            </div>

            {/* Outstanding Bills */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ marginTop: 0, color: '#00f2fe' }}>Outstanding Bills</h3>
                {outstandingBills.length > 0 ? (
                  <>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0', color: '#ffb300' }}>
                      ${totalOwed.toFixed(2)}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                      {outstandingBills.length} unpaid invoice{outstandingBills.length > 1 ? 's' : ''} pending
                    </p>
                  </>
                ) : (
                  <p style={{ color: '#00e676', fontWeight: 600, margin: '1rem 0' }}>✓ No outstanding bills</p>
                )}
              </div>
              {outstandingBills.length > 0 ? (
                <Link to="/make-payment" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
                  Pay Now
                </Link>
              ) : (
                <Link to="/billing-history" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
                  View Billing History &rarr;
                </Link>
              )}
            </div>

            {/* Recent Prescription */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ marginTop: 0, color: '#00f2fe' }}>Recent Prescription</h3>
                {recentPrescription ? (
                  <>
                    <p style={{ fontSize: '1rem', fontWeight: 600, margin: '0.25rem 0', whiteSpace: 'pre-wrap' }}>
                      {recentPrescription.instructions?.slice(0, 80)}{recentPrescription.instructions?.length > 80 ? '...' : ''}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0.25rem 0' }}>
                      Issued {new Date(recentPrescription.date).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', margin: '1rem 0' }}>No prescriptions yet</p>
                )}
              </div>
              <Link to="/prescriptions" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' }}>
                View All Prescriptions &rarr;
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
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
        </>
      )}
    </div>
  );
}
