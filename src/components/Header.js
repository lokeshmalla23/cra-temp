import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import { IoMoon, IoSunny } from 'react-icons/io5';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/venues', label: 'Venues' },
    // { path: '/contact', label: 'Contact' },
  ];

  // Add Bookings link only for logged-in users
  if (user) {
    navItems.push({ path: '/bookings', label: 'Bookings' });
  }

  // Add admin-specific items if user is logged in and is admin
  if (user && user.role === 'admin') {
    navItems.push({ path: '/upcoming-events', label: 'Upcoming Events' });
  }

  return (
    <header style={{ 
      background: isDark ? '#1f2937' : '#fff', 
      borderBottom: isDark ? '2px solid #374151' : '2px solid #e5e7eb', 
      fontFamily: 'serif', 
      boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.03)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', height: 72, justifyContent: 'space-between' }}>
        <Link to="/" style={{ 
          fontWeight: 'bold', 
          fontSize: 28, 
          color: isDark ? '#f9fafb' : '#1e293b', 
          letterSpacing: 1, 
          textDecoration: 'none', 
          fontFamily: 'serif',
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}> 
          <img 
            src="/sv.png" 
            alt="SHUBHA VEDIKA Logo" 
            style={{ 
              height: '106px',   
              marginLeft: '-100px',
              width: 'auto',
              filter: isDark ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.3s ease'
            }}
          />
          SHUBHA VEDIKA
        </Link>
        <nav style={{ display: 'flex', gap: 32 }}>
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                color: isActive(path) ? '#bfa046' : (isDark ? '#f9fafb' : '#1e293b'),
                fontWeight: isActive(path) ? 700 : 500,
                textDecoration: 'none',
                fontSize: 18,
                padding: '8px 16px',
                borderRadius: 6,
                background: isActive(path) ? (isDark ? '#374151' : '#f9f7f1') : 'transparent',
                transition: 'all 0.3s ease',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={toggleTheme}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#bfa046', 
              fontSize: 18, 
              cursor: 'pointer', 
              marginRight: 16,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
            title="Toggle theme"
          >
            {isDark ? <IoMoon size={24} /> : <IoSunny size={24} />}
          </button>
          {user ? (
            <>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginRight: 12
              }}>
                <span style={{ 
                  color: isDark ? '#f9fafb' : '#1e293b', 
                  fontSize: 16,
                  fontWeight: 500,
                  transition: 'color 0.3s ease'
                }}>
                  {user.name || user.username}
                </span>
                <span style={{ 
                  background: user.role === 'admin' ? '#8b5cf6' : '#3b82f6',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginTop: 2
                }}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                style={{ 
                  background: '#bfa046', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 4, 
                  padding: '8px 16px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: '#a8903a'
                  }
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ 
              color: '#bfa046', 
              fontWeight: 600, 
              textDecoration: 'none', 
              fontSize: 16,
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#a8903a'
              }
            }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 