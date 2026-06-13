import React from 'react';

const WEEKLY_PLAN = [
  { day: 'Monday', shift: 'Morning Shift', hours: '08:00 AM - 01:00 PM', duty: 'Outpatient Clinic' },
  { day: 'Tuesday', shift: 'All Day', hours: '09:00 AM - 05:00 PM', duty: 'General Consultations' },
  { day: 'Wednesday', shift: 'Afternoon Shift', hours: '02:00 PM - 07:00 PM', duty: 'Emergency Care Rotation' },
  { day: 'Thursday', shift: 'Morning Shift', hours: '08:00 AM - 01:00 PM', duty: 'Cardiac Ward Rounds' },
  { day: 'Friday', shift: 'All Day', hours: '09:00 AM - 05:00 PM', duty: 'General Consultations' }
];

export default function MySchedule() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>My Shift Schedule</h1>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff', fontFamily: 'inherit' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#00e676' }}>Day</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#00e676' }}>Shift</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#00e676' }}>Working Hours</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#00e676' }}>Duty Location</th>
            </tr>
          </thead>
          <tbody>
            {WEEKLY_PLAN.map((item, idx) => (
              <tr key={idx} style={{ 
                borderBottom: idx < WEEKLY_PLAN.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                transition: 'background 0.2s'
              }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{item.day}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>{item.shift}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: '#00b0ff' }}>{item.hours}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'rgba(255,255,255,0.7)' }}>{item.duty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
