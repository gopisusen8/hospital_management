import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DUMMY_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', department: 'Cardiology Center', fee: 150, rating: 4.9 },
  { id: 2, name: 'Dr. Marcus Vance', specialization: 'Neurology', department: 'Neurology & Brain Center', fee: 200, rating: 4.8 },
  { id: 3, name: 'Dr. Anita Patel', specialization: 'Pediatrics', department: 'Children Health Wing', fee: 100, rating: 4.95 },
  { id: 4, name: 'Dr. David Kim', specialization: 'Orthopedics', department: 'Bone & Joint Clinic', fee: 120, rating: 4.7 }
];

export default function SearchDoctors() {
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');

  const filtered = DUMMY_DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = filterSpec === 'All' || doc.specialization === filterSpec;
    return matchesSearch && matchesSpec;
  });

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
          <option value="All">All Specialties</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Orthopedics">Orthopedics</option>
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
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{doc.name}</h3>
                <span style={{ fontSize: '0.9rem', color: '#ffb300' }}>★ {doc.rating}</span>
              </div>
              <p style={{ color: '#00f2fe', margin: '0.25rem 0', fontWeight: 600 }}>{doc.specialization}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0', fontSize: '0.9rem' }}>{doc.department}</p>
              <p style={{ margin: '1rem 0 0 0', fontWeight: 500 }}>Consultation Fee: <span style={{ color: '#00f2fe' }}>${doc.fee}</span></p>
            </div>
            <Link 
              to="/book-appointment" 
              state={{ doctorId: doc.id, doctorName: doc.name }} 
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
