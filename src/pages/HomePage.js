import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, TrendingUp, Clock, DollarSign, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Box from '@mui/material/Box';

const HomePage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [venuesError, setVenuesError] = useState('');

  // Helper function to safely parse venue data
  const parseVenueData = (venue) => {
    try {
      return {
        id: venue.id || venue._id || venue.propertyId || Math.random().toString(36).substr(2, 9),
        name: venue.propertyName || venue.name || venue.title || 'Venue Name',
        location: venue.location || venue.address || 'Location',
        capacity: `${venue.seatingCapacity || venue.capacity || 0} guests`,
        price: `₹${venue.price || venue.rate || '15,000'}/day`,
        rating: venue.rating || 4.5,
        description: venue.description || venue.desc || 'Beautiful venue for your special occasion.',
        images: venue.images && Array.isArray(venue.images) && venue.images.length > 0 
          ? venue.images 
          : [
              'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
        amenities: venue.suitableEvents 
          ? (typeof venue.suitableEvents === 'string' 
              ? venue.suitableEvents.split(',').map(event => event.trim()) 
              : Array.isArray(venue.suitableEvents) 
                ? venue.suitableEvents 
                : ['Parking', 'Catering', 'Audio/Visual', 'Decoration'])
          : ['Parking', 'Catering', 'Audio/Visual', 'Decoration']
      };
    } catch (error) {
      console.error('Error parsing venue data:', error, venue);
      return null;
    }
  };

  // Mock venues data for demo
  const getMockVenues = () => [
    {
      id: 1,
      name: 'Grand Palace Hall',
      location: 'Downtown, 2.5km away',
      capacity: '500 guests',
      price: '₹25,000/day',
      rating: 4.9,
      images: [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      available: true
    },
    {
      id: 2,
      name: 'Royal Banquet Center',
      location: 'City Center, 1.8km away',
      capacity: '300 guests',
      price: '₹18,000/day',
      rating: 4.7,
      images: [
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      available: true
    },
    {
      id: 3,
      name: 'Elegant Event Space',
      location: 'Suburbs, 5.2km away',
      capacity: '200 guests',
      price: '₹12,000/day',
      rating: 4.6,
      images: [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      available: true
    }
  ];

  const fetchVenues = async () => {
    setVenuesLoading(true);
    setVenuesError('');
    
    try {
      // Use mock data for demo
      const mockVenues = getMockVenues();
      setVenues(mockVenues);
    } catch (error) {
      console.error('Error loading venues:', error);
      setVenuesError('Error loading venues');
      setVenues([]);
    } finally {
      setVenuesLoading(false);
    }
  };

  // Load venues on component mount
  useEffect(() => {
    fetchVenues();
  }, []);

  // Mock admin stats and recent activity
  const adminStats = [
    { label: 'Total Venues', value: 12, icon: MapPin, color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Bookings', value: 2847, icon: Calendar, color: 'bg-green-100 text-green-700' },
    { label: 'Upcoming Events', value: 8, icon: TrendingUp, color: 'bg-orange-100 text-orange-700' },
    { label: 'Revenue', value: '₹12,50,000', icon: DollarSign, color: 'bg-yellow-100 text-yellow-700' },
  ];
  const recentActivity = [
    { id: 1, action: 'Booking', detail: 'Rahul & Priya Wedding', date: '2025-02-15', user: 'Rahul Sharma' },
    { id: 2, action: 'Edit', detail: 'Updated Grand Palace Hall', date: '2025-01-28', user: 'Admin' },
    { id: 3, action: 'Booking', detail: 'Tech Corp Annual Meet', date: '2025-01-30', user: 'Sarah Johnson' },
    { id: 4, action: 'Cancel', detail: 'Amit Birthday Party', date: '2025-01-25', user: 'Amit Kumar' },
  ];

  const stats = [
    { label: 'Available Venues', value: '156', icon: MapPin, color: 'text-blue-600' },
    { label: 'Total Bookings', value: '2,847', icon: Calendar, color: 'text-green-600' },
    { label: 'Happy Customers', value: '1,200+', icon: Users, color: 'text-purple-600' },
    { label: 'Average Rating', value: '4.8', icon: Star, color: 'text-yellow-600' },
  ];

  const recentVenues = [
    {
      id: 1,
      name: 'Grand Palace Hall',
      location: 'Downtown, 2.5km away',
      capacity: '500 guests',
      price: '₹25,000/day',
      rating: 4.9,
      images: [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      available: true
    },
    {
      id: 2,
      name: 'Royal Banquet Center',
      location: 'City Center, 1.8km away',
      capacity: '300 guests',
      price: '₹18,000/day',
      rating: 4.7,
      images: [
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      available: true
    },
    {
      id: 3,
      name: 'Elegant Event Space',
      location: 'Suburbs, 5.2km away',
      capacity: '200 guests',
      price: '₹12,000/day',
      rating: 4.6,
      images: [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      available: false
    }
  ];

  const quickActions = [
    { title: 'Browse Venues', desc: 'Find perfect halls near you', link: '/venues', icon: MapPin, color: 'bg-blue-500' },
    { title: 'My Bookings', desc: 'Manage your reservations', link: '/bookings', icon: Calendar, color: 'bg-green-500' },
    { title: 'Contact Support', desc: 'Get help when needed', link: '/contact', icon: Users, color: 'bg-purple-500' },
  ];

  if (user?.role === 'admin') {
    quickActions.push({ title: 'Upcoming Events', desc: 'Manage all events', link: '/upcoming-events', icon: TrendingUp, color: 'bg-orange-500' });
  }

  const handleImageClick = (venue, imageIndex) => {
    setSelectedVenue(venue);
    setCurrentModalImageIndex(imageIndex);
    setSelectedImage(getImageUrl(venue.images[imageIndex]));
  };

  // Helper function to check login and redirect if needed
  const checkLoginAndRedirect = () => {
    if (!user) {
      alert('Please login to book this venue. You will be redirected to the login page.');
      navigate('/login');
      return false;
    }
    return true;
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedVenue(null);
    setCurrentModalImageIndex(0);
  };

  const nextImage = () => {
    if (selectedVenue) {
      const nextIndex = (currentModalImageIndex + 1) % selectedVenue.images.length;
      setCurrentModalImageIndex(nextIndex);
      setSelectedImage(getImageUrl(selectedVenue.images[nextIndex]));
    }
  };

  const prevImage = () => {
    if (selectedVenue) {
      const prevIndex = currentModalImageIndex === 0 ? selectedVenue.images.length - 1 : currentModalImageIndex - 1;
      setCurrentModalImageIndex(prevIndex);
      setSelectedImage(getImageUrl(selectedVenue.images[prevIndex]));
    }
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

  // Venue Card Component with Image Carousel
  const VenueCard = ({ venue }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-rotate images for each venue
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [venue.images.length]);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <div className="relative h-48 overflow-hidden">
            {venue.images.map((image, imgIndex) => (
              <img
                key={imgIndex}
                src={getImageUrl(image)}
                alt={`${venue.name} - Image ${imgIndex + 1}`}
                className={`w-full h-48 object-cover absolute inset-0 transition-opacity duration-1000 cursor-pointer ${
                  imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => handleImageClick(venue, imgIndex)}
              />
            ))}
            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {venue.images.map((_, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    imgIndex === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
              venue.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {venue.available ? 'Available' : 'Booked'}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{venue.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{venue.rating}</span>
            </div>
            {user?.role === 'admin' ? (
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/bookings')}
              >
                Manage
              </button>
            ) : venue.available ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (checkLoginAndRedirect()) {
                    // Store only essential venue data without images to avoid localStorage quota issues
                    const essentialVenueData = {
                      id: venue.id,
                      name: venue.name,
                      location: venue.location,
                      capacity: venue.capacity,
                      price: venue.price,
                      rating: venue.rating,
                      description: venue.description,
                      amenities: venue.amenities,
                      // Store image count instead of full images
                      imageCount: venue.images ? venue.images.length : 0
                    };
                    localStorage.setItem('selectedVenue', JSON.stringify(essentialVenueData));
                    navigate(`/book-venue/${venue.id}`);
                  }
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                Book Now
              </button>
            ) : (
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Box
      sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)' }}
      className="dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
    >
      <button className="arrow absolute top-4 left-4 z-50 flex items-center" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 mr-1" /> Back
      </button>
      <div className="min-h-screen bg-transparent text-gray-900 dark:text-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginTop: '72px' }}>
          {user?.role === 'admin' && (
            <>
              {/* Dashboard Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {adminStats.map(stat => (
                  <div key={stat.label} className={`rounded-xl shadow p-6 flex flex-col items-center border border-gray-200 bg-white font-serif ${stat.color}`} style={{ minHeight: 120 }}>
                    <stat.icon className="w-8 h-8 mb-2" />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm font-medium uppercase tracking-wide text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button onClick={() => navigate('/venues')} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Manage Venues</button>
                <button onClick={() => navigate('/bookings')} className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">Manage Bookings</button>
                <button onClick={() => navigate('/upcoming-events')} className="px-5 py-2 rounded-lg bg-orange-600 text-white font-semibold shadow hover:bg-orange-700 transition">Upcoming Events</button>
                <button onClick={() => navigate('/contact')} className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">Contact Support</button>
              </div>
              {/* Recent Activity Table */}
              <div className="bg-white rounded-xl shadow p-6 mb-10 border border-gray-200">
                <div className="font-serif text-lg font-bold mb-4 text-gray-800">Recent Activity</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-3 font-semibold">Action</th>
                        <th className="py-2 px-3 font-semibold">Detail</th>
                        <th className="py-2 px-3 font-semibold">Date</th>
                        <th className="py-2 px-3 font-semibold">User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map(act => (
                        <tr key={act.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">{act.action}</td>
                          <td className="py-2 px-3">{act.detail}</td>
                          <td className="py-2 px-3">{act.date}</td>
                          <td className="py-2 px-3">{act.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {/* Featured Venues Section (still visible for admin) */}
          {venuesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading venues...</p>
            </div>
          ) : venuesError ? (
            <div className={`text-center py-12 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              <div className="text-xl font-semibold mb-2">⚠️ Error Loading Venues</div>
              <div className="text-sm">{venuesError}</div>
              <button 
                onClick={fetchVenues} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : venues.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="text-6xl mb-4">🏛️</div>
              <div className="text-xl font-semibold mb-2">No Venues Available</div>
              <div className="text-sm">
                {user?.role === 'admin' 
                  ? "You haven't added any venues yet. Add your first venue to get started!"
                  : "No venues are currently available. Please check back later."
                }
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </main>

        {/* Enhanced Image Modal with Navigation */}
        {selectedImage && selectedVenue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={closeImageModal}>
            <div className="relative max-w-4xl max-h-full p-4">
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                onClick={closeImageModal}
              >
                <X className="w-8 h-8" />
              </button>
              
              {/* Navigation Arrows */}
              {selectedVenue.images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              
              <img
                src={selectedImage}
                alt={`${selectedVenue.name} - Image ${currentModalImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Image Counter */}
              {selectedVenue.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {currentModalImageIndex + 1} / {selectedVenue.images.length}
                </div>
              )}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </Box>
  );
};

export default HomePage;
