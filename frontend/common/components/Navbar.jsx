import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRole, logout } from '../utils/jwtHelper';

export default function Navbar({ portalName }) {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      color: '#fff',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#000',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
        }}>H</div>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          CareFlow <span style={{ fontWeight: 300, fontSize: '0.9rem', color: '#00f2fe' }}>{portalName}</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to={role ? "/dashboard" : "/"} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>Home</Link>
        {role && (
          <>
            <span style={{
              fontSize: '0.8rem',
              padding: '0.25rem 0.6rem',
              background: 'rgba(0, 242, 254, 0.15)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '20px',
              color: '#00f2fe',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}>{role.replace('ROLE_', '')}</span>
            <button onClick={handleLogout} style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 8, 68, 0.3)',
              transition: 'transform 0.1s, opacity 0.2s'
            }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
