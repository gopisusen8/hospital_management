import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar, Footer, ProtectedRoute, login, api } from 'common';

// Import Pages
import Dashboard from './pages/Dashboard';
import ManageDoctors from './pages/ManageDoctors';
import ManageDepartments from './pages/ManageDepartments';
import BillingOverview from './pages/BillingOverview';
import AuditLogsView from './pages/AuditLogsView';
import Reports from './pages/Reports';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, role, id, email } = response.data;
      if (role !== 'ROLE_ADMIN') {
        setError('Unauthorized: Access restricted to Administrators.');
        return;
      }
      login(token, role, { id, username, email });
      setError('');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid admin credentials');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', marginTop: 0, textAlign: 'center' }}>Admin Command Panel</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Hospital Administration Workspace
        </p>
        {error && (
          <div style={{
            background: 'rgba(255, 8, 68, 0.15)',
            border: '1px solid rgba(255, 8, 68, 0.4)',
            color: '#ffb199',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#ba68c8' }}>Admin Username</label>
            <input 
              type="text" 
              placeholder="e.g. admin" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#ba68c8' }}>Security Key</label>
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
        <Navbar portalName="Admin Panel" />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/manage-doctors" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <ManageDoctors />
              </ProtectedRoute>
            } />
            <Route path="/manage-departments" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <ManageDepartments />
              </ProtectedRoute>
            } />
            <Route path="/billing-overview" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <BillingOverview />
              </ProtectedRoute>
            } />
            <Route path="/audit-logs" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AuditLogsView />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Reports />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
