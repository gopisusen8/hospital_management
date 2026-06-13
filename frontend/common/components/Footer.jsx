import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      background: 'rgba(10, 10, 15, 0.95)',
      color: 'rgba(255, 255, 255, 0.5)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '0.85rem',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <p>&copy; {new Date().getFullYear()} CareFlow Hospital Management System. All rights reserved.</p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.3)' }}>
        Providing state-of-the-art clinical solutions and patient-centered workflows.
      </p>
    </footer>
  );
}
