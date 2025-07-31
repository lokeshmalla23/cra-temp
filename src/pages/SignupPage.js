import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, Loader2, ArrowLeft, User, Shield, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import Box from '@mui/material/Box';
import Header from '../components/Header.js';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const { signup, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const result = await signup(formData);
      
      if (result.success) {
        // Navigate based on role
        if (formData.role === 'admin') {
          navigate('/home');
        } else {
          navigate('/home');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ marginTop: '72px' }}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-12 w-12 text-blue-600 mr-3" />
              <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>SHUBHA VEDIKA</span>
            </div>
            <h2 className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create your account
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Join us to discover amazing venues
            </p>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} py-8 px-6 shadow-xl rounded-2xl`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className={`${isDark ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'} border px-4 py-3 rounded-md text-sm`}>
                  {error}
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Shield className="inline-block w-4 h-4 mr-2" />
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.role === 'user'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.role === 'admin'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Shield className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Admin</span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <User className="inline-block w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-500' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Mail className="inline-block w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-500' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Phone className="inline-block w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-500' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter 10-digit phone number"
                />
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Lock className="inline-block w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full px-3 py-3 border rounded-md pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      isDark 
                        ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-500' 
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <Eye className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Lock className="inline-block w-4 h-4 mr-2" />
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-3 py-3 border rounded-md pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      isDark 
                        ? 'border-gray-600 text-white bg-gray-700 placeholder-gray-500' 
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <Eye className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  } transition-colors duration-200`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className={`font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Demo Info */}
          <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="font-medium mb-2">Demo Signup Example:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Name:</strong> pavan sai</p>
              <p><strong>Email:</strong> pavan@gmail.com</p>
              <p><strong>Phone:</strong> 8097654321</p>
              <p><strong>Password:</strong> pavan123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
