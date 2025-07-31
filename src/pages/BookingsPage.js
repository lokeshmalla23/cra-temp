import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const BookingsPage = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('eventDate');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  const mockBookings = [
    {
      id: 1,
      venueName: 'Grand Palace Hall',
      venueLocation: 'Downtown',
      eventDate: '2025-02-15',
      eventTime: '18:00',
      duration: '6 hours',
      guests: 150,
      totalAmount: 25000,
      status: 'confirmed',
      eventType: 'Wedding',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 43210',
      bookedDate: '2025-01-10'
    },
    {
      id: 2,
      venueName: 'Royal Banquet Center',
      venueLocation: 'City Center',
      eventDate: '2025-02-20',
      eventTime: '19:00',
      duration: '4 hours',
      guests: 80,
      totalAmount: 18000,
      status: 'pending',
      eventType: 'Birthday Party',
      customerName: 'Priya Patel',
      customerPhone: '+91 98765 43211',
      bookedDate: '2025-01-12'
    },
    {
      id: 3,
      venueName: 'Elegant Event Space',
      venueLocation: 'Suburbs',
      eventDate: '2025-01-25',
      eventTime: '15:00',
      duration: '5 hours',
      guests: 60,
      totalAmount: 12000,
      status: 'cancelled',
      eventType: 'Corporate Event',
      customerName: 'Amit Kumar',
      customerPhone: '+91 98765 43212',
      bookedDate: '2025-01-05'
    },
    {
      id: 4,
      venueName: 'Crystal Ballroom',
      venueLocation: 'Business District',
      eventDate: '2025-03-01',
      eventTime: '17:30',
      duration: '8 hours',
      guests: 200,
      totalAmount: 35000,
      status: 'confirmed',
      eventType: 'Anniversary',
      customerName: 'Sanjay Gupta',
      customerPhone: '+91 98765 43213',
      bookedDate: '2025-01-15'
    }
  ];

  const filteredBookings = bookings
    .filter((booking) => (filterStatus === 'all' ? true : booking.status.toLowerCase() === filterStatus))
    .sort((a, b) => {
      if (sortBy === 'eventDate') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'bookedDate') return 0; // If you have bookedDate, use it
      if (sortBy === 'amount') return (b.advanceAmount || 0) - (a.advanceAmount || 0);
      return 0;
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'booked':
        return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const handleEditBooking = (id) => {
    alert(`Editing booking ${id}...`);
  };

  const handleCancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      alert(`Cancelling booking ${id}...`);
    }
  };

  const handleViewDetails = (id) => {
    const booking = bookings.find(b => b.id === id);
    setSelectedBooking(booking || null);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/bookings/bookingsByProperty?adminId=${user?.id || ''}`,
          { method: 'GET' }
        );
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        } else {
          setError(data.message || 'Error loading bookings');
          setBookings([]);
        }
      } catch (err) {
        setError('Error loading bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchBookings();
  }, [user]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <button className="arrow absolute top-4 left-4 z-50 flex items-center" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 mr-1" /> Back
      </button>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {user?.role === 'admin' ? 'All Bookings' : 'My Bookings'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'admin' 
              ? 'Manage all venue bookings across the platform'
              : 'Track and manage your venue reservations'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockBookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">confirmed</p>
                <p className="text-2xl font-bold text-green-600">{mockBookings.filter(b => b.status === 'booked').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">pending</p>
                <p className="text-2xl font-bold text-yellow-600">{mockBookings.filter(b => b.status === 'pending').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">₹{mockBookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="booked">booked</option>
                <option value="pending">pending</option>
                <option value="cancelled">cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="eventDate">Sort by Event Date</option>
                <option value="bookedDate">Sort by Booking Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
            </div>

            {user?.role === 'admin' && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                Export Data
              </button>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Venue & Event
                  </th>
                  {user?.role === 'admin' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.venueName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.venueLocation}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {booking.eventType}
                        </div>
                      </div>
                    </td>
                    
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.phoneNumber || 'N/A'}
                          </div>
                        </div>
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.session}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {booking.noOfPersons} guests
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{booking.advanceAmount ? booking.advanceAmount.toLocaleString() : '0'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(booking.status.toLowerCase())}
                        <span className={`ml-2 ${getStatusBadge(booking.status.toLowerCase())}`}>
                          {booking.status}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(booking.id)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {booking.status !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => handleEditBooking(booking.id)}
                              className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                              title="Edit Booking"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title="Cancel Booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filterStatus !== 'all' 
                ? `No ${filterStatus} bookings to display.`
                : user?.role === 'admin'
                  ? 'No bookings have been made yet.'
                  : "You haven't made any bookings yet."
              }
            </p>
            {user?.role !== 'admin' && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Browse Venues
              </button>
            )}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg relative">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🔎Booking Details</h2>
              <div className="space-y-2">
                <div><strong>Customer:</strong> {selectedBooking.customerName}</div>
                <div><strong>Email:</strong> {selectedBooking.email}</div>
                <div><strong>Phone:</strong> {selectedBooking.phoneNumber || 'N/A'}</div>
                <div><strong>Event:</strong> {selectedBooking.eventName}</div>
                <div><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</div>
                <div><strong>Session:</strong> {selectedBooking.session}</div>
                <div><strong>No. of Persons:</strong> {selectedBooking.noOfPersons}</div>
                <div><strong>Status:</strong> {selectedBooking.status}</div>
                <div><strong>Booking From:</strong> {selectedBooking.bookingFrom}</div>
                <div><strong>Advance Amount:</strong> ₹{selectedBooking.advanceAmount || 0}</div>
                <div><strong>Paid:</strong> ₹{selectedBooking.paid || 0}</div>
                <div><strong>Taken By:</strong> {selectedBooking.takenBy || 'N/A'}</div>
                <div><strong>Property ID:</strong> {selectedBooking.propertyId}</div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </Box>
  );};

export default BookingsPage;