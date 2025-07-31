import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (formData) => {
    try {
      const response = await fetch(process.env.REACT_APP_SIGNUP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, ...data };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const login = async ({ identifier, password, role = 'user' }) => {
    try {
      setLoading(true);

      // Determine if identifier is email or phone number
      const isEmail = identifier.includes('@');
      const emailOrPhone = isEmail ? identifier : identifier;

      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/loginByEmailOrPhoneNumber?emailOrPhone=${emailOrPhone}&password=${password}&role=${role}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.code === 200) {
        // Transform API response to match our user structure
        const userData = {
          id: data.data.id,
          username: data.data.name,
          name: data.data.name,
          email: data.data.email,
          mobileNumber: data.data.mobileNumber,
          role: data.data.role,
        };

        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          message: data.message || 'Login failed. Please check your credentials.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Network error. Please check your connection and try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    
    // Reset user state
    setUser(null);
    
    console.log('All localStorage data cleared on logout');
    
    // Redirect to landing page
    window.location.href = '/';
  };

  const addVenue = async (venueData) => {
    try {
      console.log('Sending venue data:', venueData);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/properties/addProperties`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyName: venueData.propertyName,
            seatingCapacity: venueData.seatingCapacity,
            adminId: venueData.adminId,
            suitableEvents: venueData.suitableEvents,
            images: venueData.images,
            location: venueData.location,
          }),
        }
      );
      const data = await response.json();
      console.log('API response:', data);
      if (response.ok) {
        return { success: true, ...data };
      } else {
        return { success: false, message: data.message || 'Add venue failed' };
      }
    } catch (error) {
      console.error('Add venue error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const getVenueNamesByAdmin = async (adminId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/properties/getPropertyNames?adminId=${adminId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await response.json();
      if (response.ok) {
        return { success: true, ...data };
      } else {
        return { success: false, message: data.message || 'Failed to fetch venue names' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, addVenue, getVenueNamesByAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
