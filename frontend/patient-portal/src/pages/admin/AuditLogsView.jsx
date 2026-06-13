import React, { useState, useEffect } from 'react';
import { api } from 'common';

export default function AuditLogsView() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/audit-logs');
      // Sort audits by newest first
      const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setAudits(sorted);
    } catch (err) {
      console.error(err);
      setError('Failed to load system audit logs.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = audits.filter(log => 
    filterAction === 'All' || log.action === filterAction
  );

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading system audit trail...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ff1744' }}>
        {error}
      </div>
    );
  }

  // Get unique actions for filter options dynamically
  const uniqueActions = Array.from(new Set(audits.map(a => a.action)));

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
          {uniqueActions.map(act => (
            <option key={act} value={act}>{act}</option>
          ))}
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
              <p style={{ margin: 0 }}>{formatDateTime(log.timestamp)}</p>
              {log.ipAddress && <p style={{ margin: 0 }}>IP: {log.ipAddress}</p>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
            No audit logs found.
          </p>
        )}
      </div>
    </div>
  );
}
