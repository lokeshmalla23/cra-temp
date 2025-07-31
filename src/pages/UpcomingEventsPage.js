import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Eye,
  Search,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box, Typography, Button, InputBase, Select, MenuItem, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UpcomingEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEventType, setFilterEventType] = useState('all');
  const [sortBy, setSortBy] = useState('eventDate');

  const mockEvents = [ {
      id: 1,
      eventName: 'Rahul & Priya Wedding',
      eventType: 'Wedding',
      venueName: 'Grand Palace Hall',
      venueLocation: 'Downtown',
      eventDate: '2025-02-15',
      eventTime: '18:00',
      duration: '6 hours',
      guests: 150,
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 43210',
      customerEmail: 'rahul.sharma@email.com',
      totalAmount: 25000,
      status: 'upcoming',
      specialRequests: 'Red roses decoration, vegetarian catering'
    },
    {
      id: 2,
      eventName: 'Tech Corp Annual Meet',
      eventType: 'Corporate Event',
      venueName: 'Crystal Ballroom',
      venueLocation: 'Business District',
      eventDate: '2025-01-30',
      eventTime: '09:00',
      duration: '8 hours',
      guests: 200,
      customerName: 'Sarah Johnson',
      customerPhone: '+91 98765 43214',
      customerEmail: 'sarah.johnson@techcorp.com',
      totalAmount: 35000,
      status: 'today',
      specialRequests: 'Audio-visual equipment, corporate catering'
    },
    {
      id: 3,
      eventName: 'Amit\'s 30th Birthday',
      eventType: 'Birthday Party',
      venueName: 'Royal Banquet Center',
      venueLocation: 'City Center',
      eventDate: '2025-02-20',
      eventTime: '19:00',
      duration: '4 hours',
      guests: 80,
      customerName: 'Amit Kumar',
      customerPhone: '+91 98765 43212',
      customerEmail: 'amit.kumar@email.com',
      totalAmount: 18000,
      status: 'upcoming'
    },
    {
      id: 4,
      eventName: 'Golden Anniversary Celebration',
      eventType: 'Anniversary',
      venueName: 'Elegant Event Space',
      venueLocation: 'Suburbs',
      eventDate: '2025-03-01',
      eventTime: '17:30',
      duration: '5 hours',
      guests: 60,
      customerName: 'Mr. & Mrs. Gupta',
      customerPhone: '+91 98765 43213',
      customerEmail: 'gupta.family@email.com',
      totalAmount: 12000,
      status: 'upcoming'
    },
    {
      id: 5,
      eventName: 'University Graduation',
      eventType: 'Academic Event',
      venueName: 'Metropolitan Hall',
      venueLocation: 'Metro Area',
      eventDate: '2025-01-25',
      eventTime: '10:00',
      duration: '6 hours',
      guests: 300,
      customerName: 'Prof. David Wilson',
      customerPhone: '+91 98765 43215',
      customerEmail: 'david.wilson@university.edu',
      totalAmount: 28000,
      status: 'completed'
    }
  ]; 

  const filteredEvents = mockEvents
    .filter(event => {
      const matchesSearch =
        event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venueName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      const matchesType = filterEventType === 'all' || event.eventType === filterEventType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'eventDate') return new Date(a.eventDate) - new Date(b.eventDate);
      if (sortBy === 'customerName') return a.customerName.localeCompare(b.customerName);
      if (sortBy === 'amount') return b.totalAmount - a.totalAmount;
      return 0;
    });

  const handleViewEvent = (id) => alert(`Viewing event ${id}`);
  const handleEditEvent = (id) => alert(`Editing event ${id}`);
  const handleCancelEvent = (id) => window.confirm('Cancel?') && alert(`Cancelled ${id}`);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 60%, #e7e0d8 100%)' }} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <button className="arrow absolute top-4 left-4 z-50 flex items-center" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 mr-1" /> Back
      </button>
      <Header />

      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ fontFamily: 'serif', color: '#bfa046' }}>Upcoming Events</Typography>
        <Typography variant="body1" color="text.secondary" mb={4} sx={{ fontFamily: 'serif', fontSize: 18 }}>
          Manage and oversee all scheduled events across your venues
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          <Paper component="form" sx={{ display: 'flex', alignItems: 'center', width: 300, borderRadius: 8, boxShadow: '0 2px 8px #e5e7eb' }}>
            <IconButton sx={{ p: '10px' }}><Search /></IconButton>
            <InputBase
              placeholder="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
          </Paper>

          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {['all', 'upcoming', 'today', 'in-progress', 'completed'].map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>

          <Select value={filterEventType} onChange={(e) => setFilterEventType(e.target.value)}>
            {['all', 'Wedding', 'Corporate Event', 'Birthday Party', 'Anniversary', 'Academic Event'].map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>

          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="eventDate">Sort by Date</MenuItem>
            <MenuItem value="customerName">Sort by Customer</MenuItem>
            <MenuItem value="amount">Sort by Amount</MenuItem>
          </Select>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 4,
        }}>
          {filteredEvents.length ? (
            filteredEvents.map(event => (
              <Paper key={event.id} sx={{
                p: 3,
                borderRadius: 10,
                boxShadow: '0 4px 24px #e5e7eb',
                border: '1px solid #e5e7eb',
                position: 'relative',
                background: '#fff',
                fontFamily: 'serif',
                minHeight: 320,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                {/* Date Badge */}
                <div style={{ position: 'absolute', top: 18, right: 18, background: '#bfa046', color: '#fff', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 15, letterSpacing: 1 }}>
                  <Calendar style={{ width: 16, height: 16, marginRight: 4, display: 'inline' }} />
                  {new Date(event.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                </div>
                {/* Event Type Tag */}
                <div style={{ position: 'absolute', top: 18, left: 18, background: '#f3f4f6', color: '#bfa046', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 14, letterSpacing: 1, border: '1px solid #bfa046' }}>
                  {event.eventType}
                </div>
                {/* Event Name */}
                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'serif', color: '#1e293b', mt: 4, mb: 1, fontSize: 22 }}>{event.eventName}</Typography>
                {/* Venue & Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MapPin style={{ width: 18, height: 18, color: '#bfa046', marginRight: 4 }} />
                  <span style={{ color: '#374151', fontSize: 16 }}>{event.venueName}, {event.venueLocation}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Clock style={{ width: 18, height: 18, color: '#bfa046', marginRight: 4 }} />
                  <span style={{ color: '#374151', fontSize: 16 }}>{event.eventTime} ({event.duration})</span>
                </div>
                {/* Guests & Customer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Users style={{ width: 18, height: 18, color: '#bfa046', marginRight: 4 }} />
                  <span style={{ color: '#374151', fontSize: 16 }}>{event.guests} guests</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>Client:</span> {event.customerName}
                </div>
                {/* Amount */}
                <div style={{ color: '#bfa046', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  ₹{event.totalAmount.toLocaleString('en-IN')}
                </div>
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button variant="contained" size="small" sx={{ background: '#bfa046', color: '#fff', fontWeight: 600, borderRadius: 6, boxShadow: '0 2px 8px #e5e7eb', '&:hover': { background: '#a88c2c' } }} onClick={() => handleViewEvent(event.id)} startIcon={<Eye />}>View</Button>
                  <Button variant="outlined" size="small" sx={{ borderColor: '#bfa046', color: '#bfa046', fontWeight: 600, borderRadius: 6, '&:hover': { borderColor: '#a88c2c', color: '#a88c2c' } }} onClick={() => handleEditEvent(event.id)} startIcon={<Edit />}>Edit</Button>
                  <Button variant="outlined" color="error" size="small" sx={{ borderRadius: 6, fontWeight: 600 }} onClick={() => handleCancelEvent(event.id)} startIcon={<Trash2 />}>Cancel</Button>
                </div>
              </Paper>
            ))
          ) : (
            <Typography variant="body1">No events found.</Typography>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default UpcomingEventsPage;
