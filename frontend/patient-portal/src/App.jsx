import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Footer, ProtectedRoute, login, isAuthenticated } from 'common';

// Import Pages
import Dashboard from './pages/Dashboard';
import SearchDoctors from './pages/SearchDoctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MedicalRecords from './pages/MedicalRecords';
import Prescriptions from './pages/Prescriptions';
import BillingHistory from './pages/BillingHistory';
import MakePayment from './pages/MakePayment';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login simulation for skeleton purposes
    login('dummy-jwt-token', 'ROLE_PATIENT', { username, email: username + '@example.com' });
    navigate('/dashboard');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', marginTop: 0, textAlign: 'center' }}>Patient Portal</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Access your digital health workspace
        </p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Username</label>
            <input 
              type="text" 
              placeholder="e.g. johndoe" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#00f2fe' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar portalName="Patient Portal" />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/search-doctors" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <SearchDoctors />
              </ProtectedRoute>
            } />
            <Route path="/book-appointment" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <BookAppointment />
              </ProtectedRoute>
            } />
            <Route path="/my-appointments" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <MyAppointments />
              </ProtectedRoute>
            } />
            <Route path="/medical-records" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <MedicalRecords />
              </ProtectedRoute>
            } />
            <Route path="/prescriptions" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <Prescriptions />
              </ProtectedRoute>
            } />
            <Route path="/billing-history" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <BillingHistory />
              </ProtectedRoute>
            } />
            <Route path="/make-payment" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <MakePayment />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
