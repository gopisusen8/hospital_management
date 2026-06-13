import React, { useState } from 'react';

const INITIAL_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', department: 'Cardiology Center', status: 'Active' },
  { id: 2, name: 'Dr. Marcus Vance', specialization: 'Neurology', department: 'Neurology & Brain Center', status: 'Active' },
  { id: 3, name: 'Dr. Anita Patel', specialization: 'Pediatrics', department: 'Children Health Wing', status: 'On Leave' }
];

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [name, setName] = useState('');
  const [spec, setSpec] = useState('');
  const [dept, setDept] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !spec || !dept) return;

    setDoctors(prev => [
      ...prev,
      { id: Date.now(), name, specialization: spec, department: dept, status: 'Active' }
    ]);
    setName('');
    setSpec('');
    setDept('');
  };

  const handleDelete = (id) => {
    setDoctors(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Manage Doctors</h1>

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Full Name</label>
              <input type="text" placeholder="Dr. Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Specialization</label>
              <input type="text" placeholder="e.g. Cardiology" value={spec} onChange={(e) => setSpec(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Department</label>
              <input type="text" placeholder="e.g. Heart Clinic" value={dept} onChange={(e) => setDept(e.target.value)} required />
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
                  <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{doc.name}</h4>
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
          </div>
        </div>
      </div>
    </div>
  );
}
