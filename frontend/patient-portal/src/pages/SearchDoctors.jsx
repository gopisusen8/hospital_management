import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from 'common';

export default function SearchDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors')
      .then(res => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching doctors:', err);
        setLoading(false);
      });
  }, []);

  const filtered = doctors.filter(doc => {
    const docName = `Dr. ${doc.user.firstName} ${doc.user.lastName}`;
    const matchesSearch = docName.toLowerCase().includes(search.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = filterSpec === 'All' || doc.specialization === filterSpec;
    return matchesSearch && matchesSpec;
  });

  // Extract unique specializations for filter dropdown
  const specializations = ['All', ...new Set(doctors.map(d => d.specialization))];

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading providers list...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Search Doctors</h1>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        alignItems: 'center'
      }}>
        <input 
          type="text" 
          placeholder="Search by name or specialty..." 
          style={{ flex: 1, minWidth: '250px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          style={{ minWidth: '180px' }} 
          value={filterSpec}
          onChange={(e) => setFilterSpec(e.target.value)}
        >
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec === 'All' ? 'All Specialties' : spec}</option>
          ))}
        </select>
      </div>

      {/* Doctor Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {filtered.map(doc => (
          <div key={doc.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  Dr. {doc.user.firstName} {doc.user.lastName}
                </h3>
                <span style={{ fontSize: '0.9rem', color: '#ffb300' }}>★ {doc.rating || 5.0}</span>
              </div>
              <p style={{ color: '#00f2fe', margin: '0.25rem 0', fontWeight: 600 }}>{doc.specialization}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0', fontSize: '0.9rem' }}>{doc.department}</p>
              <p style={{ margin: '1rem 0 0 0', fontWeight: 500 }}>Consultation Fee: <span style={{ color: '#00f2fe' }}>${doc.consultationFee}</span></p>
            </div>
            <Link 
              to="/book-appointment" 
              state={{ doctorId: doc.id, doctorName: `Dr. ${doc.user.firstName} ${doc.user.lastName}`, consultationFee: doc.consultationFee }} 
              className="btn-primary" 
              style={{ textDecoration: 'none', textAlign: 'center', marginTop: '1.5rem', display: 'block' }}
            >
              Book Consultation
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
            No doctors found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
}
