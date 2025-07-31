import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer style={{ 
      background: isDark ? '#1f2937' : '#f9f7f1', 
      color: isDark ? '#f9fafb' : '#1e293b', 
      fontFamily: 'serif', 
      borderTop: isDark ? '2px solid #374151' : '2px solid #e5e7eb', 
      marginTop: 48,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 2rem 1rem 2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32 }}>
        <div style={{ flex: 2 }}>
          <div style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 8 }}>SHUBHA VEDIKA</div>
          <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: 16, maxWidth: 400 }}>
            Your premier destination for booking the perfect function hall for any occasion. From weddings to corporate events, we help you find the ideal venue within your area.
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Quick Links</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><a href="/venues" style={{ color: '#bfa046', textDecoration: 'none', fontSize: 16, transition: 'color 0.3s ease' }}>Browse Venues</a></li>
            <li><a href="/bookings" style={{ color: '#bfa046', textDecoration: 'none', fontSize: 16, transition: 'color 0.3s ease' }}>My Bookings</a></li>
            <li><a href="/ContactPage" style={{ color: '#bfa046', textDecoration: 'none', fontSize: 16, transition: 'color 0.3s ease' }}>Contact Us</a></li>
            <li><a href="#" style={{ color: '#bfa046', textDecoration: 'none', fontSize: 16, transition: 'color 0.3s ease' }}>Help Center</a></li>
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Contact Info</div>
          <div style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: 16 }}>
            <div>Phone: +91 98765 43210</div>
            <div>Email: info@eventhall.com</div>
            <div>123 Event Street, City</div>
          </div>
        </div>
      </div>
      <div style={{ 
        borderTop: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
        marginTop: 24, 
        padding: '1rem 2rem 0 2rem', 
        textAlign: 'center', 
        color: '#bfa046', 
        fontSize: 15 
      }}>
        © 2025 SHUBHA VEDIKA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
