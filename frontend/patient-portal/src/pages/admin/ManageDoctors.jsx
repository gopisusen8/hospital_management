import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [spec, setSpec] = useState('');
  const [dept, setDept] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load doctors list.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // 1. Register user
      await api.post('/auth/register', {
        username,
        password,
        email,
        role: 'ROLE_DOCTOR',
        firstName,
        lastName,
        phone
      });

      // 2. Fetch updated doctors list to find the newly registered doctor record
      const res = await api.get('/doctors');
      const newDoc = res.data.find(d => d.user?.username === username);

      if (newDoc) {
        // 3. Update their specialization, department, and set a default fee
        await api.put(`/doctors/${newDoc.id}`, {
          specialization: spec,
          department: dept,
          consultationFee: 150.0
        });
      }

      setSuccess(`Provider Dr. ${firstName} ${lastName} registered successfully!`);
      
      // Clear form
      setUsername('');
      setPassword('');
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setSpec('');
      setDept('');

      // Refresh list
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to onboard doctor.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor and their user account?')) {
      return;
    }
    try {
      await api.delete(`/doctors/${id}`);
      setDoctors(prev => prev.filter(doc => doc.id !== id));
      setSuccess('Doctor removed successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to delete doctor.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading providers list...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Manage Doctors</h1>

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        {/* Register Doctor Form */}
        <div className="glass-panel">
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#ba68c8' }}>Onboard Provider</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.85rem' }}>First Name</label>
                <input type="text" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Last Name</label>
                <input type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Username</label>
              <input type="text" placeholder="doctor2" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Email</label>
              <input type="email" placeholder="doctor2@careflow.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Phone</label>
              <input type="text" placeholder="+15550001234" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Specialization</label>
              <input type="text" placeholder="e.g. Pediatrics" value={spec} onChange={(e) => setSpec(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Department</label>
              <select value={dept} onChange={(e) => setDept(e.target.value)} required>
                <option value="" disabled style={{ background: '#121212', color: 'rgba(255,255,255,0.4)' }}>Select Department</option>
                <option value="Cardiology Center" style={{ background: '#121212' }}>Cardiology Center</option>
                <option value="Pediatrics" style={{ background: '#121212' }}>Pediatrics</option>
                <option value="Neurology Clinic" style={{ background: '#121212' }}>Neurology Clinic</option>
                <option value="Orthopedic Center" style={{ background: '#121212' }}>Orthopedic Center</option>
                <option value="Dermatology Clinic" style={{ background: '#121212' }}>Dermatology Clinic</option>
                <option value="General Outpatient" style={{ background: '#121212' }}>General Outpatient</option>
                <option value="Oncology Department" style={{ background: '#121212' }}>Oncology Department</option>
                <option value="Gastroenterology Unit" style={{ background: '#121212' }}>Gastroenterology Unit</option>
                <option value="Mental Health Clinic" style={{ background: '#121212' }}>Mental Health Clinic</option>
                <option value="Endocrinology Clinic" style={{ background: '#121212' }}>Endocrinology Clinic</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Save Provider</button>
          </form>
        </div>

        {/* Doctors List */}
        <div className="glass-panel" style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#ba68c8' }}>Active Medical Staff</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {doctors.map(doc => (
              <div key={doc.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                    Dr. {doc.user?.firstName} {doc.user?.lastName}
                  </h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#ba68c8' }}>
                    {doc.specialization} - <span style={{ color: 'rgba(255,255,255,0.5)' }}>{doc.department}</span>
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(doc.id)} 
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    fontSize: '1.25rem'
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
            {doctors.length === 0 && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No active providers found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
