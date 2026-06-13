import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar, Footer, ProtectedRoute, login } from 'common';

// Import Pages
import Dashboard from './pages/Dashboard';
import ManageAvailability from './pages/ManageAvailability';
import AppointmentsList from './pages/AppointmentsList';
import PatientHistory from './pages/PatientHistory';
import CreatePrescription from './pages/CreatePrescription';
import MySchedule from './pages/MySchedule';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login('dummy-doctor-jwt-token', 'ROLE_DOCTOR', { username, email: username + '@careflow.com' });
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', marginTop: 0, textAlign: 'center' }}>Doctor Portal</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Clinical Workstation & Care Planner
        </p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#00e676' }}>Provider ID</label>
            <input 
              type="text" 
              placeholder="e.g. drjenkins" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#00e676' }}>Access Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Verify & Enter</button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar portalName="Doctor Workspace" />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/manage-availability" element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <ManageAvailability />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <AppointmentsList />
              </ProtectedRoute>
            } />
            <Route path="/patient-history" element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <PatientHistory />
              </ProtectedRoute>
            } />
            <Route path="/create-prescription" element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <CreatePrescription />
              </ProtectedRoute>
            } />
            <Route path="/my-schedule" element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <MySchedule />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
