import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar, Footer, ProtectedRoute, login } from 'common';

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
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login('dummy-admin-jwt-token', 'ROLE_ADMIN', { username, email: username + '@admin-careflow.com' });
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', marginTop: 0, textAlign: 'center' }}>Admin Command Panel</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Hospital Administration Workspace
        </p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#ba68c8' }}>Admin Username</label>
            <input 
              type="text" 
              placeholder="e.g. systemadmin" 
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
