import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Footer, ProtectedRoute, login, getRole, logout, api, Profile } from 'common';

// Import Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import SearchDoctors from './pages/patient/SearchDoctors';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import Prescriptions from './pages/patient/Prescriptions';
import BillingHistory from './pages/patient/BillingHistory';
import MakePayment from './pages/patient/MakePayment';

// Import Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import ManageAvailability from './pages/doctor/ManageAvailability';
import AppointmentsList from './pages/doctor/AppointmentsList';
import PatientHistory from './pages/doctor/PatientHistory';
import CreatePrescription from './pages/doctor/CreatePrescription';
import MySchedule from './pages/doctor/MySchedule';

// Import Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageDepartments from './pages/admin/ManageDepartments';
import BillingOverview from './pages/admin/BillingOverview';
import AuditLogsView from './pages/admin/AuditLogsView';
import Reports from './pages/admin/Reports';
import ManagePatients from './pages/admin/ManagePatients';

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
      
      let userDetails = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.phone
      };

      if (response.data.role === 'ROLE_DOCTOR') {
        const doctorRes = await api.get(`/doctors/user/${response.data.id}`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`
          }
        });
        userDetails.doctorId = doctorRes.data.id;
        userDetails.doctorInfo = doctorRes.data;
      }
      
      login(response.data.token, response.data.role, userDetails);
      document.documentElement.setAttribute('data-role', response.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    }
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
        <h2 style={{ fontFamily: 'Outfit, sans-serif', marginTop: 0, textAlign: 'center' }}>CareFlow Portal</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Access your digital health workspace
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
            <label style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>Username</label>
            <input 
              type="text" 
              placeholder="Enter username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>Password</label>
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
        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1.25rem', color: 'rgba(255,255,255,0.6)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', {
        username,
        password,
        email,
        role: 'ROLE_PATIENT',
        firstName,
        lastName,
        phone
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Try again.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', marginTop: 0, textAlign: 'center' }}>Patient Registration</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Create your digital care account
        </p>
        {error && (
          <div style={{
            background: 'rgba(255, 23, 68, 0.1)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#ff1744',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            background: 'rgba(0, 230, 118, 0.1)',
            border: '1px solid rgba(0, 230, 118, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#00e676',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>First Name</label>
              <input type="text" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Last Name</label>
              <input type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Username</label>
            <input type="text" placeholder="e.g. john_doe" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Email Address</label>
            <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Phone Number</label>
            <input type="text" placeholder="+15551234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Create Account</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1.25rem', color: 'rgba(255,255,255,0.6)' }}>
          Already have an account? <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function DynamicDashboard() {
  const role = getRole();
  if (role === 'ROLE_ADMIN') {
    return <AdminDashboard />;
  } else if (role === 'ROLE_DOCTOR') {
    return <DoctorDashboard />;
  } else if (role === 'ROLE_PATIENT') {
    return <PatientDashboard />;
  }
  return <Navigate to="/" replace />;
}

function DynamicProfile() {
  const role = getRole();
  let themeColor = '#00f2fe';
  if (role === 'ROLE_DOCTOR') themeColor = '#00e676';
  if (role === 'ROLE_ADMIN') themeColor = '#ba68c8';
  return <Profile themeColor={themeColor} />;
}

function ThemeSynchronizer() {
  const location = useLocation();
  useEffect(() => {
    const role = getRole();
    if (role) {
      document.documentElement.setAttribute('data-role', role);
    } else {
      document.documentElement.removeAttribute('data-role');
    }
  }, [location]);
  return null;
}

function AppContent() {
  const role = getRole();
  let portalName = "Portal";
  if (role === 'ROLE_ADMIN') portalName = "Admin Panel";
  else if (role === 'ROLE_DOCTOR') portalName = "Doctor Workspace";
  else if (role === 'ROLE_PATIENT') portalName = "Patient Portal";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ThemeSynchronizer />
      <Navbar portalName={portalName} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Unified Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DynamicDashboard />
            </ProtectedRoute>
          } />

          {/* Shared Profile */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <DynamicProfile />
            </ProtectedRoute>
          } />

          {/* Patient Portal Routes */}
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

          {/* Doctor Workspace Routes */}
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

          {/* Admin Panel Routes */}
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
          <Route path="/manage-patients" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <ManagePatients />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
