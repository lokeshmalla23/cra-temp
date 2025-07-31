import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Star, MapPin, Users, DollarSign, Calendar, Clock, User, Phone, Mail, Users as UsersIcon, CreditCard, Loader2 } from 'lucide-react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { useTheme } from '../contexts/ThemeContext.js';
import { useAuth } from '../contexts/AuthContext.js';

const BookVenuePage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();

  // --- Calendar State ---
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // --- Booking Data State ---
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');

  // --- Booking Form State ---
  const [bookingData, setBookingData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    eventName: '',
    noOfPersons: '',
    advanceAmount: '',
    paid: '',
    takenBy: ''
  });

  // --- Get Real Venue Data from localStorage ---
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch bookings for the venue (mock data for demo)
  const fetchBookings = async (propertyId) => {
    // Use mock data for demo
    setBookings([]);
    setBookingsLoading(false);
  };

  useEffect(() => {
    // Get venue data from localStorage
    const storedVenue = localStorage.getItem('selectedVenue');
    if (storedVenue) {
      try {
        const venue = JSON.parse(storedVenue);
        setVenueData(venue);
        // Fetch bookings for this venue
        if (venue.id) {
          fetchBookings(venue.id);
        }
      } catch (error) {
        console.error('Error parsing venue data:', error);
        // Fallback to mock data
        setVenueData({
          id: venueId,
          name: 'Venue Name',
          location: 'Location',
          capacity: '0 guests',
          price: '₹15,000/day',
          rating: 4.5,
          description: 'Beautiful venue for your special occasion.',
          images: [],
          amenities: []
        });
      }
    } else {
      // Fallback to mock data if no venue data found
      setVenueData({
        id: venueId,
        name: 'Venue Name',
        location: 'Location',
        capacity: '0 guests',
        price: '₹15,000/day',
        rating: 4.5,
        description: 'Beautiful venue for your special occasion.',
        images: [],
        amenities: []
      });
    }
    setLoading(false);
  }, [venueId]);

  // Get venue images with fallback
  const getVenueImages = () => {
    if (venueData?.images && venueData.images.length > 0) {
      return venueData.images;
    }
    // Return fallback images if no images in venue data
    return [
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600'
    ];
  };

  // Helper function to get image URL for preview
  const getImageUrl = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    // Handle base64 image objects from API
    if (image && typeof image === 'object' && image.image) {
      return image.image; // Return the base64 string
    }
    // Handle direct base64 strings
    if (typeof image === 'string' && image.startsWith('data:image')) {
      return image;
    }
    // Handle regular URLs
    if (typeof image === 'string') {
      return image;
    }
    // Fallback
    return image;
  };

  // Auto-rotate venue images
  useEffect(() => {
    if (!venueData) return;
    
    const images = getVenueImages();
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [venueData]);

  // --- Calendar Helpers ---
  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };
  const days = getMonthDays(currentMonth);
  const firstDayOfWeek = currentMonth.getDay();

  // --- Mock Data ---
  const sessionAvailability = {
    '2025-07-23': { afternoon: 'available', evening: 'available' },
    '2025-07-16': { afternoon: 'booked', evening: 'available' },
    '2025-07-18': { afternoon: 'booked', evening: 'booked' },
    '2025-07-25': { afternoon: 'available', evening: 'booked' },
    '2025-07-28': { afternoon: 'booked', evening: 'available' },
  };

  // --- Calendar Cell Status ---
  function getDayStatus(date) {
    const dateStr = date.toISOString().slice(0, 10);
    
    // Use mock data for demo
    const sessions = sessionAvailability[dateStr];
    if (!sessions) return 'available';
    if (sessions.afternoon === 'booked' && sessions.evening === 'booked') return 'fully';
    if (sessions.afternoon === 'booked' || sessions.evening === 'booked') return 'partial';
    return 'available';
  }

  // Get session availability for a specific date
  const getSessionAvailability = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const sessions = sessionAvailability[dateStr] || { afternoon: 'available', evening: 'available' };
    return sessions;
  };

  // --- Handlers ---
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedSession(null);
  };
  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedSession(null);
  };
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedSession(null);
    setShowBookingForm(false);
  };
  const handleBookSession = (session) => {
    setSelectedSession(session);
    setShowBookingForm(true);
    setBookingError('');
    setBookingSuccess(false);
  };

  // --- Booking Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (bookingError) setBookingError('');
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      // Validate required fields
      if (!bookingData.customerName || !bookingData.phoneNumber || !bookingData.email || 
          !bookingData.eventName || !bookingData.noOfPersons || !selectedDate || !selectedSession) {
        setBookingError('Please fill in all required fields');
        setBookingLoading(false);
        return;
      }

      // Get user from localStorage
      const userData = localStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;

      if (!currentUser || !currentUser.id) {
        setBookingError('User not found. Please login again.');
        setBookingLoading(false);
        return;
      }

      const bookingPayload = {
        date: selectedDate ? selectedDate.toISOString().slice(0, 10) : '',
        session: selectedSession === 'afternoon' ? 'Afternoon' : 'Evening',
        customerName: bookingData.customerName,
        phoneNumber: bookingData.phoneNumber,
        email: bookingData.email,
        eventName: bookingData.eventName,
        noOfPersons: parseInt(bookingData.noOfPersons),
        propertyId: venueData.id,
        customerId: currentUser.id,
        // status: 'Pending',
       bookingFrom: currentUser.role === 'admin' ? 'offline' : 'online',
        advanceAmount: bookingData.advanceAmount ? parseInt(bookingData.advanceAmount) : 0,
        takenBy: bookingData.takenBy || 'Online Booking',
        paid: bookingData.paid ? parseInt(bookingData.paid) : 0
      };

      // Call the Create Booking API
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/bookings/createBooking`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        }
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setBookingSuccess(true);
        setShowBookingForm(false);
        // Reset form
        setBookingData({
          customerName: '',
          phoneNumber: '',
          email: '',
          eventName: '',
          noOfPersons: '',
          advanceAmount: '',
          paid: '',
          takenBy: ''
        });
        setSelectedDate(null);
        setSelectedSession(null);
        // Optionally refresh bookings data
        if (venueData?.id) {
          fetchBookings(venueData.id);
        }
      } else {
        setBookingError(data.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Create booking error:', error);
      setBookingError('Network error. Please check your connection and try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // --- Render ---
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  // --- Session Details ---
  let sessionDetails = null;
  if (selectedDate) {
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const sessions = getSessionAvailability(selectedDate);
    sessionDetails = (
      <div className={`mt-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`font-semibold mb-4 text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Calendar className="inline-block w-5 h-5 mr-2" />
          Availability for {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'Selected Date'}
        </div>
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-blue-500" />
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Afternoon Session</div>
                <div className="text-sm text-gray-500">12:00 PM - 4:00 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                sessions.afternoon === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {sessions.afternoon === 'available' ? 'Available' : 'Booked'}
              </span>
              {sessions.afternoon === 'available' && !showBookingForm && (
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                  onClick={() => handleBookSession('afternoon')}
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
          <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-purple-500" />
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Evening Session</div>
                <div className="text-sm text-gray-500">6:00 PM - 10:00 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                sessions.evening === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {sessions.evening === 'available' ? 'Available' : 'Booked'}
              </span>
              {sessions.evening === 'available' && !showBookingForm && (
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                  onClick={() => handleBookSession('evening')}
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginTop: '72px' }}>
        {/* Back Button */}
        <button 
          className={`flex items-center mb-6 ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200`}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Venues
        </button>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading venue details...</p>
          </div>
        ) : !venueData ? (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="text-6xl mb-4">🏛️</div>
            <div className="text-xl font-semibold mb-2">Venue Not Found</div>
            <div className="text-sm mb-4">The venue you're looking for doesn't exist or has been removed.</div>
            <button
              onClick={() => navigate('/venues')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Other Venues
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venue Details Section */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
            {/* Image Carousel */}
            <div className="relative h-80 overflow-hidden">
              {(venueData.images && venueData.images.length > 0
  ? venueData.images
  : [
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600'
    ]
).map((image, imgIndex) => (
  <img
    key={imgIndex}
    src={getImageUrl(image)}
    alt={`${venueData.name} - Image ${imgIndex + 1}`}
    className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ${
      imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
    }`}
  />
))}
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {(venueData.images || []).map((_, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      imgIndex === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Venue Info */}
            <div className="p-6">
              <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {venueData?.name}
              </h1>
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {venueData?.description}
              </p>
              
              {/* Venue Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <MapPin className={`w-5 h-5 mr-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{venueData?.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className={`w-5 h-5 mr-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{venueData?.capacity}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className={`w-5 h-5 mr-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{venueData?.price}</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {(venueData.amenities || []).map((amenity, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDark 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={handlePrevMonth} 
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className={`text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <div className="text-2xl font-bold">{monthName}</div>
                <div className="text-lg text-gray-500">{year}</div>
              </div>
              <button 
                onClick={handleNextMonth} 
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className={`text-center font-medium text-sm py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array(firstDayOfWeek).fill(null).map((_, i) => <div key={i}></div>)}
              {days.map(date => {
                const status = getDayStatus(date);
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                
                let bg = '', border = '', text = '';
                if (status === 'fully') {
                  bg = 'bg-red-500'; border = 'border-red-600'; text = 'text-white';
                } else if (status === 'partial') {
                  bg = 'bg-yellow-500'; border = 'border-yellow-600'; text = 'text-white';
                } else {
                  bg = isDark ? 'bg-gray-700' : 'bg-gray-100'; 
                  border = isDark ? 'border-gray-600' : 'border-gray-200'; 
                  text = isDark ? 'text-white' : 'text-gray-900';
                }
                
                return (
                  <button
                    key={date.toISOString()}
                    className={`h-12 w-full rounded-lg border font-medium transition-all duration-200 ${bg} ${border} ${text} ${
                      isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    } ${isToday ? 'ring-2 ring-green-500' : ''} ${
                      status !== 'fully' ? 'hover:scale-105' : ''
                    }`}
                    disabled={status === 'fully'}
                    onClick={() => handleDateClick(date)}
                    title={status === 'fully' ? 'Fully Booked' : status === 'partial' ? 'Partially Booked' : 'Available'}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 text-sm items-center justify-center">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-4 h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}></span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-yellow-500 rounded"></span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Partially Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-red-500 rounded"></span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Fully Booked</span>
              </div>
            </div>

            {/* Bookings Loading State */}
            {bookingsLoading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading availability...</p>
              </div>
            )}

            {/* Bookings Error State */}
            {bookingsError && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                isDark ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="text-red-600 text-sm">
                  ⚠️ {bookingsError}
                </div>
                <button
                  onClick={() => venueData?.id && fetchBookings(venueData.id)}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Session Details */}
            {sessionDetails}
            
            {/* Booking Form */}
            {showBookingForm && selectedDate && selectedSession && (
              <div className={`mt-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`font-semibold mb-4 text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  📝 Complete Your Booking
                </div>
                
                {bookingError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    ✅ Booking created successfully! You will receive a confirmation email shortly.
                  </div>
                )}

                <form onSubmit={handleCreateBooking} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={bookingData.customerName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Enter customer name"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={bookingData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Event Name *
                      </label>
                      <input
                        type="text"
                        name="eventName"
                        value={bookingData.eventName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="e.g., Wedding, Birthday, Corporate"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Number of Persons *
                      </label>
                      <input
                        type="number"
                        name="noOfPersons"
                        value={bookingData.noOfPersons}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Enter number of guests"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Advance Amount (₹)
                      </label>
                      <input
                        type="number"
                        name="advanceAmount"
                        value={bookingData.advanceAmount}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Enter advance amount"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Amount Paid (₹)
                      </label>
                      <input
                        type="number"
                        name="paid"
                        value={bookingData.paid}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Enter amount paid"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Taken By
                      </label>
                      <input
                        type="text"
                        name="takenBy"
                        value={bookingData.takenBy}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="e.g., Receptionist, Manager"
                      />
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border ${isDark ? 'border-gray-600' : 'border-blue-200'}`}>
                    <div className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-blue-900'}`}>
                      📅 Booking Summary
                    </div>
                    <div className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-blue-800'}`}>
                      <div>Date: {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected'}</div>
                      <div>Session: {selectedSession === 'afternoon' ? 'Afternoon (12:00 PM - 4:00 PM)' : selectedSession === 'evening' ? 'Evening (6:00 PM - 10:00 PM)' : 'Not selected'}</div>
                      <div>Venue: {venueData?.name}</div>
                      <div>Location: {venueData?.location}</div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        isDark 
                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      disabled={bookingLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Creating Booking...
                        </>
                      ) : (
                        <>
                          <Calendar className="h-5 w-5 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {bookingSuccess && (
              <div className={`mt-6 p-4 rounded-lg text-center ${
                isDark ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="text-green-600 font-semibold">
                  ✅ Booking submitted successfully!
                </div>
                <div className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Date not available'} - {selectedSession || 'Session not available'} session
                </div>
              </div>
            )}

            {bookingError && (
              <div className={`mt-6 p-4 rounded-lg text-center ${
                isDark ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="text-red-600 font-semibold">
                  ❌ {bookingError}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </main>
      <Footer />
    </div>
  );
};

export default BookVenuePage;