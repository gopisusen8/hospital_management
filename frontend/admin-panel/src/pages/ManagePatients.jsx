import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load registered patients list.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
    const username = (patient.username || '').toLowerCase();
    const email = (patient.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || username.includes(query) || email.includes(query);
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading patients directory...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', margin: 0 }}>Registered Patients</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0 0 0' }}>
            Roster of clinical user profiles registered on CareFlow
          </p>
        </div>
        <div style={{
          background: 'rgba(186, 104, 200, 0.1)',
          border: '1px solid rgba(186, 104, 200, 0.3)',
          borderRadius: '20px',
          padding: '0.4rem 1rem',
          color: '#ba68c8',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          Total Patients: {filteredPatients.length}
        </div>
      </div>

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

      {/* Search Filter input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="🔍 Search patients by name, username, or email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.85rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1rem',
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Patients List */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredPatients.map(patient => (
            <div key={patient.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '1.25rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '10px'
            }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', color: '#ba68c8' }}>
                  {patient.firstName || 'Anonymous'} {patient.lastName || ''}
                </h3>
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Username: <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{patient.username}</strong>
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                  <span>✉️ {patient.email}</span>
                  <span>📞 {patient.phone || 'No phone recorded'}</span>
                </div>
              </div>
              
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
                <div>Joined</div>
                <div style={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', marginTop: '0.15rem' }}>
                  {formatDate(patient.createdAt)}
                </div>
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', margin: '2rem 0' }}>
              No patients found matching your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
