import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, ArrowLeft, Star, MapPin, Users, DollarSign, Quote, X, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [currentReview, setCurrentReview] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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
      location: 'Downtown',
      capacity: '500 guests',
      price: '₹25,000/day',
      rating: 4.9,
      images: [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      description: 'Luxurious hall perfect for grand celebrations'
    },
    {
      id: 2,
      name: 'Royal Banquet Center',
      location: 'City Center',
      capacity: '300 guests',
      price: '₹18,000/day',
      rating: 4.7,
      images: [
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      description: 'Elegant banquet hall with modern amenities'
    },
    {
      id: 3,
      name: 'Crystal Ballroom',
      location: 'Business District',
      capacity: '800 guests',
      price: '₹35,000/day',
      rating: 4.8,
      images: [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      description: 'Premium ballroom for upscale events'
    },
    {
      id: 4,
      name: 'Garden Pavilion',
      location: 'Garden District',
      capacity: '150 guests',
      price: '₹8,000/day',
      rating: 4.4,
      images: [
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      description: 'Beautiful outdoor venue with garden setting'
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

  // Mock reviews data for demonstration
  const reviews = [
    {
      id: 1,
      name: 'Rahul Sharma',
      event: 'Wedding',
      rating: 5,
      comment: 'Perfect venue for our special day! The staff was amazing and everything went smoothly.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'Priya Patel',
      event: 'Birthday Party',
      rating: 5,
      comment: 'Excellent service and beautiful venue. Our guests loved the atmosphere!',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      event: 'Corporate Event',
      rating: 4,
      comment: 'Professional setup and great facilities. Highly recommended for business events.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleGetStarted = () => {
    // Always allow browsing venues, no login required
    navigate('/venues');
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

  // Helper function to check login and redirect if needed
  const checkLoginAndRedirect = () => {
    console.log('Checking login status:', !!user); // Debug log
    if (!user) {
      alert('Please login to book this venue. You will be redirected to the login page.');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleBookVenue = (venueId) => {
    // Check if user is logged in before allowing booking
    if (checkLoginAndRedirect()) {
      // Find the venue data
      const venue = venues.find(v => v.id === venueId);
      if (venue) {
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
        // Navigate to booking page
        navigate(`/book-venue/${venueId}`);
      } else {
        alert('Venue not found. Please try again.');
      }
    }
  };

  const handleVenueClick = (venueId) => {
    // Allow venue browsing without login - just navigate to venues page
    navigate(`/venues`);
  };

  const handleImageClick = (venue, imageIndex) => {
    setSelectedVenue(venue);
    setCurrentModalImageIndex(imageIndex);
    setSelectedImage(getImageUrl(venue.images[imageIndex]));
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

  // Venue Card Component with Image Carousel
  const VenueCard = ({ venue, index }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-rotate images for each venue
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [venue.images.length]);

    if (viewMode === 'list') {
      // List View Layout
      return (
        <div 
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex`}
          style={{ animation: `slideInUp 0.6s ease-out ${index * 0.1}s both` }}
          onClick={() => handleVenueClick(venue.id)}
        >
          {/* Image Section */}
          <div className="relative w-64 h-48 flex-shrink-0">
            <div className="relative h-full overflow-hidden">
              {venue.images.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={getImageUrl(image)}
                  alt={`${venue.name} - Image ${imgIndex + 1}`}
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 cursor-pointer ${
                    imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(venue, imgIndex);
                  }}
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
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-semibold">{venue.rating}</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{venue.name}</h3>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{venue.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-sm">{venue.location}</span>
                </div>
                <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-sm">{venue.capacity}</span>
                </div>
                <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span className="text-sm font-semibold">{venue.price}</span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookVenue(venue.id);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 text-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      );
    }

    // Grid View Layout (existing code)
    return (
      <div 
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
        style={{ animation: `slideInUp 0.6s ease-out ${index * 0.1}s both` }}
        onClick={() => handleVenueClick(venue.id)}
      >
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(venue, imgIndex);
                }}
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
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-semibold">{venue.rating}</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{venue.name}</h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{venue.description}</p>
          <div className="space-y-2 mb-4">
            <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">{venue.location}</span>
            </div>
            <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">{venue.capacity}</span>
            </div>
            <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="text-sm font-semibold">{venue.price}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBookVenue(venue.id);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffffff' }}>
      <Header />

      {/* Hero Section - Reduced height */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(205deg, #010101ff, #6d14b1ff)',
          px: 2,
          mt: '72px', // Account for fixed header
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: '#cb1851ff',
            top: '10%',
            left: '10%',
            opacity: 0.3,
            zIndex: 0,
            filter: 'blur(100px)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: '#f3f3f3ff',
            bottom: '15%',
            right: '10%',
            opacity: 0.3,
            zIndex: 0,
            filter: 'blur(100px)',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            color: 'white',
            maxWidth: '64rem',
            mx: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 0 }}>
            <img
              src="/sv.png"
              alt="Logo"
              style={{ 
                height: '300px', 
                width: 'auto', 
                marginRight: '1rem', 
                borderRadius: '1rem',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          </Box>

          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, animation: 'slideInUp 1s ease-out' }}>
            Find Your Dream Venue with <span style={{ color: '#d4af37' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Roboto' }}>SHUBA VEDIKA</p></span>
          </Typography>

          <Typography sx={{ fontSize: '1.25rem', mb: 4, color: '#dbeafe', animation: 'slideInUp 1s ease-out 0.3s both' }}>
            Book top function halls with ease and confidence. Celebrations made memorable.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', animation: 'slideInUp 1s ease-out 0.6s both', my: 4 }}>
            <Box
              component="button"
              sx={{
                bgcolor: '#3eceefff',
                color: '#1e3a8a',
                px: 4,
                py: 2,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 10px 15px rgba(208, 222, 228, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#0ea5e9',
                  transform: 'scale(1.05)',
                },
              }}
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight size={20} />
            </Box>
            <Link to="/login">
              <Box
                component="button"
                sx={{
                  bgcolor: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  px: 4,
                  py: 2,
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#d4af37',
                    color: '#1e3a8a',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Sign In
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Venues Showcase Section */}
      <Box sx={{ py: 10, bgcolor: isDark ? '#1f2937' : '#f8fafc' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 4 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2, color: isDark ? '#f9fafb' : '#1e293b', fontFamily: 'serif' }}>
            Our Premium Venues
          </Typography>
          <Typography sx={{ textAlign: 'center', fontSize: '1.125rem', mb: 8, color: isDark ? '#d1d5db' : '#64748b' }}>
            Discover our handpicked selection of the finest function halls
          </Typography>

          <div className="flex justify-between items-center mb-6">
            <Box sx={{ display: 'flex', gap: 1 }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Grid className="h-6 w-6" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <List className="h-6 w-6" />
              </button>
            </Box>
            <Link to="/venues">
              <Box
                component="button"
                sx={{
                  bgcolor: 'white',
                  color: '#1e3a8a',
                  px: 4,
                  py: 2,
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Browse All Venues
                <ArrowRight size={20} />
              </Box>
            </Link>
          </div>

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
              <div className="text-sm">We're currently setting up our premium venues. Please check back soon!</div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {venues.map((venue, index) => (
                    <VenueCard key={venue.id} venue={venue} index={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {venues.map((venue, index) => (
                    <VenueCard key={venue.id} venue={venue} index={index} />
                  ))}
                </div>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Client Reviews Carousel */}
      <Box sx={{ py: 10, bgcolor: '#1e293b', color: 'white' }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto', px: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'serif' }}>
            What Our Clients Say
          </Typography>
          <Typography sx={{ fontSize: '1.125rem', mb: 8, color: '#cbd5e1' }}>
            Real experiences from satisfied customers
          </Typography>

          <div className="relative">
            <div className="flex justify-center mb-6">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${
                    index === currentReview ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={reviews[currentReview].image}
                  alt={reviews[currentReview].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(reviews[currentReview].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <p className="text-lg mb-4 italic">"{reviews[currentReview].comment}"</p>
              <div>
                <p className="font-semibold text-lg">{reviews[currentReview].name}</p>
                <p className="text-blue-400">{reviews[currentReview].event}</p>
              </div>
            </div>
          </div>
        </Box>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: '#1e293b', color: 'white' }}>
        <Box sx={{ maxWidth: '48rem', mx: 'auto', textAlign: 'center', px: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Find Your Perfect Venue?
          </Typography>
          <Typography sx={{ fontSize: '1.125rem', mb: 4 }}>
            Join thousands of satisfied customers who found their dream venues through SHUBA VEDIKA.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CheckCircle size={20} />
              <span>No Hidden Fees</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CheckCircle size={20} />
              <span>Instant Booking</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CheckCircle size={20} />
              <span>24/7 Support</span>
            </Box>
          </Box>

          <Link to="/venues">
            <Box
              component="button"
              sx={{
                bgcolor: 'white',
                color: '#1e3a8a',
                px: 4,
                py: 2,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  bgcolor: '#f1f5f9',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Browse Venues
              <ArrowRight size={20} />
            </Box>
          </Link>
        </Box>
      </Box>

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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default LandingPage;
