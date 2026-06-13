import React, { useState } from 'react';

const DUMMY_AUDITS = [
  { id: 1, actor: 'systemadmin', action: 'ONBOARD_DOCTOR', details: 'Added Dr. Marcus Vance to Neurology', ipAddress: '192.168.1.45', timestamp: 'Today 10:20 AM' },
  { id: 2, actor: 'drjenkins', action: 'WRITE_PRESCRIPTION', details: 'Prescribed Lisinopril to John Doe', ipAddress: '192.168.1.102', timestamp: 'Today 09:45 AM' },
  { id: 3, actor: 'john_doe', action: 'INITIATE_PAYMENT', details: 'Simulated payment initiation for Invoice #101', ipAddress: '192.168.1.201', timestamp: 'Yesterday 04:12 PM' }
];

export default function AuditLogsView() {
  const [filterAction, setFilterAction] = useState('All');

  const filtered = DUMMY_AUDITS.filter(log => 
    filterAction === 'All' || log.action === filterAction
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>System Audit Trail</h1>

      {/* Filter */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
        <select 
          style={{ minWidth: '200px' }} 
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
        >
          <option value="All">All Actions</option>
          <option value="ONBOARD_DOCTOR">ONBOARD_DOCTOR</option>
          <option value="WRITE_PRESCRIPTION">WRITE_PRESCRIPTION</option>
          <option value="INITIATE_PAYMENT">INITIATE_PAYMENT</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(log => (
          <div key={log.id} className="glass-card" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  background: 'rgba(186, 104, 200, 0.15)',
                  border: '1px solid rgba(186, 104, 200, 0.3)',
                  borderRadius: '10px',
                  color: '#ba68c8',
                  fontWeight: 'bold'
                }}>{log.action}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>By {log.actor}</span>
              </div>
              <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{log.details}</p>
            </div>
            
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
              <p style={{ margin: 0 }}>{log.timestamp}</p>
              <p style={{ margin: 0 }}>IP: {log.ipAddress}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
