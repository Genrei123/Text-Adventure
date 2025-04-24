import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import axiosInstance from '../../../config/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useLoading } from '../../context/LoadingContext';
import LoadingLink from '../../components/LoadingLink';

import RegisterCarousel from './RegisterCarousel';

/**
 * Interface for Register component props
 * @property {function} onRegister - Callback function to handle user registration
 */
interface RegisterProps {
  onRegister: (username: string, isSocialLogin: boolean) => void;
}

/**
 * Interface for form validation errors
 * Each field can have an optional error message
 */


/**
 * Register Component
 * Handles new user registration with form validation and social registration options
 * 
 * Features:
 * - Form validation for all fields
 * - Password strength requirements
 * - Terms acceptance requirement
 * - Social registration options
 * - Navigation to login after successful registration
 * 
 * @param {RegisterProps} props - Component props
 */
const Register: React.FC<RegisterProps> = ({ }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { navigateWithLoading } = useLoading();

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleRegister = async (formData: {
    username: string;
    email: string;
    password: string;
  }) => {
    setIsProcessing(true);
    toast.info('Registering...');

    try {
      await axiosInstance.post('/auth/register', formData);
      toast.success('Registration successful! A verification email has been sent.');
      setTimeout(() => {
        navigateWithLoading('/login');
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSocialRegister = async (provider: string) => {
      setIsProcessing(true);
      toast.info(`Connecting to ${provider}...`);
  
      try {
        window.location.href = import.meta.env.VITE_SITE_URL + `/oauth/${provider.toLowerCase()}`;
    
      } catch (error) {
        console.error(`Error during ${provider} login:`, error);
        toast.error(`Failed to log in with ${provider}.`);
        setIsProcessing(false);
      }
  };

  
  return (
    // register design
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#1E1E1E] relative overflow-hidden">
      {/* Sage AI Logo as Navigation to Landing Page */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 hover:opacity-80 transition-opacity duration-300"
      >
        <img 
          src="/Logo SageAI.png" 
          alt="Sage AI" 
          className="w-24 h-auto" 
        />
      </Link>
      
      {/* Background image - responsive handling */}
      <div className="absolute inset-0 w-full h-full">
        {/* Mobile background - solid color already set in parent */}
        {/* Desktop background image */}
        <img 
          src={('/register.gif')} 
          className="hidden md:block absolute inset-0 w-full h-full object-cover" 
          alt="Background" 
        />
        {/* Fade overlay for better text contrast */}
        <img 
          src={('/fadeLogin.png')} 
          className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block" 
          alt="Fade overlay" 
        />
      </div>
      
      {/* Left side - empty on mobile, takes space on desktop */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center z-10 px-4 py-8 md:py-0">
        <div className="w-full max-w-[480px] relative">
          {/* Success Message Overlay */}
          {(isProcessing) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-[#1E1E1E] bg-opacity-95 p-6 rounded-lg border border-[#C8A97E] shadow-lg">
                <div className="text-center">
                  <div className="mb-4 text-[#C8A97E] font-cinzel text-xl">
                    Registering...
                  </div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A97E] mx-auto"></div>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-4xl font-cinzel text-white mb-12 text-center">Enter the World</h2>
          
          <RegisterCarousel onSubmit={handleRegister} />

          {/* Social Registration Section */}
          <div className="mt-8">
            <div className="text-center text-sm text-[#8B7355] mb-4">Start by Using</div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSocialRegister('Google')}
                className="p-2 rounded-full bg-[#3D2E22] hover:bg-[#4D3E32] disabled:opacity-50"
                disabled={isProcessing}
              >
                <FaGoogle className="text-[#8B7355]" size={20} />
              </button>
              {/* <button
                onClick={() => handleSocialRegister('Facebook')}
                className="p-2 rounded-full bg-[#3D2E22] hover:bg-[#4D3E32] disabled:opacity-50"
                disabled={isProcessing}
              >
                <FaFacebook className="text-[#8B7355]" size={20} />
              </button> */}
            </div>
          </div>

          {/* Login Link Section */}
          <div className="mt-6 text-center">
            <div className="text-[#8B7355] text-sm">Continue your journey?</div>
            <LoadingLink 
              to="/login" 
              className={`text-[#C8A97E] hover:text-[#D8B98E] text-sm ${
                isProcessing ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Login
            </LoadingLink>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;