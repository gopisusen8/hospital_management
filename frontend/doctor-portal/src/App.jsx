import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar, Footer, ProtectedRoute, login, api, Profile } from 'common';

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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.role !== 'ROLE_DOCTOR') {
        setError('Unauthorized: Access denied.');
        return;
      }
      
      // Fetch associated Doctor profile using the userId
      const doctorRes = await api.get(`/doctors/user/${response.data.id}`, {
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      });
      
      login(response.data.token, response.data.role, {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.phone,
        doctorId: doctorRes.data.id,
        doctorInfo: doctorRes.data
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Provider ID or Password');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', marginTop: 0, textAlign: 'center' }}>Doctor Portal</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Clinical Workstation & Care Planner
        </p>
        {error && (
          <div style={{
            background: 'rgba(255, 23, 68, 0.1)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#ff1744',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#00e676' }}>Provider ID</label>
            <input 
              type="text" 
              placeholder="e.g. doctor1" 
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
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <Profile themeColor="#00e676" />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
