import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, DollarSign, Star, ArrowLeft, X, ChevronLeft, ChevronRight, Plus, Upload, Loader2, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const VenuesPage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [venues, setVenues] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({});
  const [newVenue, setNewVenue] = useState({
    propertyName: '',
    seatingCapacity: '',
    suitableEvents: '',
    location: '',
    images: []
  });

  const fetchVenues = async () => {
    setVenuesLoading(true);
    setVenuesError('');
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/properties/getByAdminId?adminId=${user?.id || 1}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.data)) {
        setVenues(data.data); // <-- use data.data from API
      } else {
        setVenuesError(data.message || 'Error loading venues');
        setVenues([]);
      }
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
  }, [user]);

  const handleAddVenue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!newVenue.propertyName || !newVenue.seatingCapacity || !newVenue.location) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Prepare suitableEvents as array if needed
      const suitableEvents = Array.isArray(newVenue.suitableEvents)
        ? newVenue.suitableEvents
        : newVenue.suitableEvents
          ? newVenue.suitableEvents.split(',').map(e => e.trim())
          : [];

      // Prepare FormData
      const formData = new FormData();
      formData.append('propertyName', newVenue.propertyName);
      formData.append('seatingCapacity', newVenue.seatingCapacity);
      formData.append('adminId', user?.id);
      formData.append('location', newVenue.location);

      // Suitable events (array)
      suitableEvents.forEach(event => formData.append('suitableEvents[]', event));

      // Images (array of File or base64)
      newVenue.images.forEach((img) => {
        if (img instanceof File) {
          formData.append('images', img); // File object
        } else {
          formData.append('images', img); // base64 string or URL
        }
      });

      // Call addVenue API with FormData
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/properties/addProperties`,
        {
          method: 'POST',
          body: formData, // No need for Content-Type header
        }
      );
      const data = await response.json();
      console.log('API response:', data);
      if (response.ok) {
        setSuccess('Venue added successfully!');
        setShowAddModal(false);
        setNewVenue({
          propertyName: '',
          seatingCapacity: '',
          suitableEvents: '',
          location: '',
          images: []
        });
        fetchVenues();
      } else {
        setError(data.message || 'Add venue failed');
      }
    } catch (error) {
      console.error('Add venue error:', error);
      setError('Failed to add venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVenue(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewVenue(prev => ({
      ...prev,
      images: [...prev.images, ...files] // Store File objects directly
    }));
  };

  const removeImage = (index) => {
    setNewVenue(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Helper function to safely parse venue data
  const parseVenueData = (venue) => {
    try {
      return {
        id: venue.id || venue._id || venue.propertyId || Math.random().toString(36).substr(2, 9),
        name: venue.propertyName || venue.name || venue.title || 'Venue Name',
        location: venue.location || venue.address || 'Location',
        capacity: `{venue.seatingCapacity || venue.capacity || 0} guests`,
        price: `₹{venue.price || venue.rate || '15,000'}/day`,
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
    if (!user) {
      alert('Please login to book this venue. You will be redirected to the login page.');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleBookVenue = (venueId) => {
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      localStorage.setItem('selectedVenue', JSON.stringify({
        id: venue.id,
        name: venue.propertyName,
        location: venue.location,
        capacity: `${venue.seatingCapacity} guests`,
        price: venue.price ? `₹${venue.price}/day` : '₹15,000/day',
        rating: venue.rating || 4.5,
        description: venue.description || 'Beautiful venue for your special occasion.',
        images: Array.isArray(venue.images) ? venue.images : [],
        amenities: Array.isArray(venue.suitableEvents)
          ? venue.suitableEvents
          : typeof venue.suitableEvents === 'string'
            ? venue.suitableEvents.split(',').map(e => e.trim())
            : ['Parking', 'Catering', 'Audio/Visual', 'Decoration']
      }));
      navigate(`/book-venue/${venueId}`);
    } else {
      alert('Venue not found. Please try again.');
    }
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
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300`}>
      <div className="relative">
          <div className="relative h-48 overflow-hidden">
            {venue.images.map((image, imgIndex) => (
              <img
                key={imgIndex}
                src={getImageUrl(image)} // Use getImageUrl for preview
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
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-semibold">{venue.rating}</span>
      </div>
            {/* Booking count badge */}
            <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
              <Calendar className="h-3 w-3 text-white mr-1" />
              <span className="text-xs font-semibold text-white">
                {bookingCounts[venue.id] || 0} bookings
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{venue.name}</h3>
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
          <div className="mb-4">
            <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Amenities:</h4>
            <div className="flex flex-wrap gap-1">
          {venue.amenities.map((amenity, index) => (
                <span key={index} className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              {amenity}
            </span>
          ))}
            </div>
        </div>
        <div className="flex gap-2">
          {user?.role === 'admin' ? (
            <>
              <button className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Edit Venue</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">Delete</button>
                <button
                  onClick={() => handleBookVenue(venue.id)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white ml-2"
                >
                  Book
                </button>
            </>
          ) : (
              <button
                onClick={() => handleBookVenue(venue.id)}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                Book Now
              </button>
          )}
        </div>
      </div>
    </div>
  );
  };

  const fetchVenueNamesByAdmin = async (adminId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/properties/getByAdminId?adminId=${adminId}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      if (response.ok) {
        // data should contain the venue names for this admin
        console.log('Venue names for admin:', data);
        // You can set state here if needed, e.g. setVenueNames(data.propertyNames);
        return data;
      } else {
        console.error('Failed to fetch venue names:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Network error fetching venue names:', error);
      return [];
    }
  };

  // Example usage: fetch venue names when admin logs in or modal opens
  useEffect(() => {
    if (user?.role === 'admin' && user?.id) {
      fetchVenueNamesByAdmin(user.id);
    }
  }, [user]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <button className={`arrow absolute top-4 left-4 z-50 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`} onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 mr-1" /> Back
      </button>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginTop: '72px' }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Venues</h1>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Discover the perfect venue for your special occasion</p>
             </div>
          {user?.role === 'admin' && (
                   <button
              className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg font-medium transition-colors duration-200 flex items-center z-50"
              onClick={() => setShowAddModal(true)}
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Venue
                   </button>
          )}
                 </div>
     
        {/* Venues Grid */}
        {venuesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className={`ml-3 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Loading venues...</span>
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
            <div className="text-xl font-semibold mb-2">No Venues Found</div>
            <div className="text-sm mb-4">
              {user?.role === 'admin' 
                ? "You haven't added any venues yet. Click 'Add New Venue' to get started!"
                : "No venues are currently available. Please check back later."
              }
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Venue
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={{
  id: venue.id,
  name: venue.propertyName,
  location: venue.location,
  capacity: `${venue.seatingCapacity} guests`,
  price: venue.price ? `₹${venue.price}/day` : '₹15,000/day',
  rating: venue.rating || 4.5,
  description: venue.description || 'Beautiful venue for your special occasion.',
 images: Array.isArray(venue.images) && venue.images.some(img => typeof img === 'string' && img.trim() !== '')
  ? venue.images.filter(img => typeof img === 'string' && img.trim() !== '')
  : [
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
  amenities: Array.isArray(venue.suitableEvents)
    ? venue.suitableEvents
    : typeof venue.suitableEvents === 'string'
      ? venue.suitableEvents.split(',').map(e => e.trim())
      : ['Parking', 'Catering', 'Audio/Visual', 'Decoration']
}} />
            ))}
          </div>
        )}
               </div>
     
      {/* Add Venue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add New Venue
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddVenue} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Venue Name *
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={newVenue.propertyName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter venue name"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={newVenue.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter venue location"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={newVenue.seatingCapacity}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter capacity (e.g., 500)"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Suitable Events
                </label>
                <input
                  type="text"
                  name="suitableEvents"
                  value={newVenue.suitableEvents}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Wedding, Birthday, Corporate Events"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Upload className="inline-block w-4 h-4 mr-2" />
                  Venue Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`block w-full text-sm border rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold transition-all duration-200 ${
                    isDark 
                      ? 'text-gray-300 border-gray-600 bg-gray-700 file:bg-purple-600 file:text-white hover:file:bg-purple-700' 
                      : 'text-gray-900 border-gray-300 bg-gray-50 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                  }`}
                />
                
                {newVenue.images.length > 0 && (
                  <div className="mt-3">
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Uploaded Images ({newVenue.images.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {newVenue.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={getImageUrl(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isDark 
                      ? 'bg-gray-600 text-white hover:bg-gray-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Adding Venue...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Venue
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="relative">
              <img
                src={selectedImage}
                alt="Venue"
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {selectedVenue && selectedVenue.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VenuesPage;