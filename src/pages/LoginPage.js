import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, Loader2, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import Box from '@mui/material/Box';
import Header from '../components/Header';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = await login(formData);
      
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
      setError('Login failed. Please try again.');
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
               Sign in to your account
             </h2>
             <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
               Welcome back! Please enter your details
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
                 <label htmlFor="identifier" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                   Email or Phone Number
                 </label>
                 <input
                   id="identifier"
                   name="identifier"
                   type="text"
                   required
                   value={formData.identifier}
                   onChange={handleChange}
                   className={`mt-1 appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                     isDark 
                       ? 'border-gray-600 placeholder-gray-500 text-white bg-gray-700' 
                       : 'border-gray-300 placeholder-gray-500 text-gray-900'
                   }`}
                   placeholder="Enter email or phone number"
                 />
               </div>
 
               <div>
                 <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                     className={`appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10 transition-all duration-200 ${
                       isDark 
                         ? 'border-gray-600 placeholder-gray-500 text-white bg-gray-700' 
                         : 'border-gray-300 placeholder-gray-500 text-gray-900'
                     }`}
                     placeholder="Enter password"
                   />
                   <button
                     type="button"
                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
                     onClick={() => setShowPassword(!showPassword)}
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
                       Signing in...
                     </>
                   ) : (
                     'Sign in'
                   )}
                 </button>
               </div>
 
               <div className="text-center">
                 <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                   Don't have an account?{' '}
                   <Link 
                     to="/signup" 
                     className={`font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                   >
                     Sign up
                   </Link>
                 </p>
               </div>
             </form>
           </div>

           {/* Demo Credentials */}
           {/* <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
             <p className="font-medium mb-2">Demo Credentials:</p>
             <div className="space-y-1">
               <p><strong>Admin:</strong> 9876543210 / Ganesh123</p>
               <p><strong>Email:</strong> ganesh@gmail.com / Ganesh123</p>
             </div>
           </div> */}
         </div>
       </div>
     </>
   );
};

export default LoginPage;