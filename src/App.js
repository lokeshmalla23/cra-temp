import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.js';
import LoginPage from './pages/LoginPage.js';
import SignupPage from './pages/SignupPage.js';
import HomePage from './pages/HomePage.js';
import VenuesPage from './pages/VenuesPage.js';
import BookingsPage from './pages/BookingsPage.js';
import ContactPage from './pages/ContactPage.js';
import UpcomingEventsPage from './pages/UpcomingEventsPage.js';
import BookVenuePage from './pages/BookVenuePage.js';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { ThemeProvider, useTheme } from './contexts/ThemeContext.js';
import Box from '@mui/material/Box';

function AppRoutes() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/venues" element={<VenuesPage />} />
      <Route path="/bookings" element={user ? <BookingsPage /> : <Navigate to="/login" />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/upcoming-events" element={user?.role === 'admin' ? <UpcomingEventsPage /> : <Navigate to="/home" />} />
      <Route path="/book-venue/:venueId" element={<BookVenuePage />} />
    </Routes>
  );
}

function AppContainer() {
  const { isDark } = useTheme();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: isDark 
          ? 'linear-gradient(to bottom right, #1f2937, #111827)' 
          : 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
        transition: 'all 0.3s ease',
        color: isDark ? '#f9fafb' : '#1f2937'
      }} 
      className={`transition-colors duration-300 ${isDark ? 'dark' : ''}`}
    >
      <AppRoutes />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContainer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 