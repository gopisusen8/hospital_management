import React, { useState } from 'react';

const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Cardiology', head: 'Dr. Sarah Jenkins', rooms: 15, occupied: 12 },
  { id: 2, name: 'Neurology', head: 'Dr. Marcus Vance', rooms: 10, occupied: 5 },
  { id: 3, name: 'Pediatrics', head: 'Dr. Anita Patel', rooms: 20, occupied: 14 }
];

export default function ManageDepartments() {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [name, setName] = useState('');
  const [head, setHead] = useState('');
  const [rooms, setRooms] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !head || !rooms) return;

    setDepartments(prev => [
      ...prev,
      { id: Date.now(), name, head, rooms: parseInt(rooms), occupied: 0 }
    ]);
    setName('');
    setHead('');
    setRooms('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Manage Departments</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        {/* Create Department Form */}
        <div className="glass-panel">
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#ba68c8' }}>Create Department</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Department Name</label>
              <input type="text" placeholder="e.g. Oncology" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Department Head</label>
              <input type="text" placeholder="e.g. Dr. Vance" value={head} onChange={(e) => setHead(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Number of Beds/Rooms</label>
              <input type="number" placeholder="e.g. 15" value={rooms} onChange={(e) => setRooms(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Establish Department</button>
          </form>
        </div>

        {/* Departments List */}
        <div className="glass-panel" style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#ba68c8' }}>Hospital Wings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {departments.map(dept => (
              <div key={dept.id} style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem' }}>{dept.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#ba68c8', fontWeight: 600 }}>Head: {dept.head}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  <span>Allocated Rooms: {dept.rooms}</span>
                  <span>Occupancy: {((dept.occupied / dept.rooms) * 100).toFixed(0)}% ({dept.occupied} filled)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
