import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function AuditLogsView() {
  const [logs, setLogs] = useState([]);
  const [filterAction, setFilterAction] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/audit-logs')
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading audit trail logs.');
        setLoading(false);
      });
  }, []);

  const filtered = logs.filter(log => 
    filterAction === 'All' || log.action === filterAction
  );

  const formatTime = (timeStr) => {
    try {
      return new Date(timeStr).toLocaleString();
    } catch (e) {
      return timeStr;
    }
  };

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
          <option value="ACCESS_PATIENT_RECORDS">ACCESS_PATIENT_RECORDS</option>
          <option value="CREATE_PATIENT_RECORD">CREATE_PATIENT_RECORD</option>
          <option value="ACCESS_PRESCRIPTIONS">ACCESS_PRESCRIPTIONS</option>
          <option value="CREATE_PRESCRIPTION">CREATE_PRESCRIPTION</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading audit trail...</p>
      ) : error ? (
        <p style={{ color: '#ff1744' }}>{error}</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>No matching audit logs found.</p>
      ) : (
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
                <p style={{ margin: 0 }}>{formatTime(log.timestamp)}</p>
                <p style={{ margin: 0 }}>IP: {log.ipAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
