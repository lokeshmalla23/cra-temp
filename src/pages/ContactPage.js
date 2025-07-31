import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Box from '@mui/material/Box';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  // ...rest of the code remains the same, just remove all type/interface usage

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <button className="arrow absolute top-4 left-4 z-50 flex items-center" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 mr-1" /> Back
      </button>
      <Header />
      {/* ...rest of the JSX remains the same... */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... */}
      </main>
      <Footer />
    </Box>
  );
};

export default ContactPage; 