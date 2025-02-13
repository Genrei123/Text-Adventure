import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import axiosInstance from '../../../config/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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
interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

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
const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  // Form state management
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Validates all form fields
   * Checks for:
   * - Username requirements (length, characters)
   * - Email format
   * - Password strength and match
   * - Terms acceptance
   * 
   * @returns {boolean} True if all validations pass, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Username validation
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance validation
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the rules of the realm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * Validates form and processes registration if valid
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      toast.info('Registering...');

      try {
        const response = await axiosInstance.post('/auth/register', { username, email, password });
        toast.success('Registration successful! A verification email has been sent to your email address.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSocialRegister = async (provider: string) => {
      setIsProcessing(true);
      toast.info(`Connecting to ${provider}...`);
  
      try {
        window.location.href = import.meta.env.VITE_SITE_URL + `/auth/${provider.toLowerCase()}`;
    
      } catch (error) {
        console.error(`Error during ${provider} login:`, error);
        toast.error(`Failed to log in with ${provider}.`);
        setIsProcessing(false);
      }
  };

  
  return (
    // register design
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-start bg-[#1E1E1E] md:bg-cover md:bg-center fade-in" style={{ backgroundImage: `url(${('/Register.png')})` }}>
      <img src={('/fadeLogin.png')} className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block" />
      <div className="w-1/2 flex items-center justify-center">
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[480px] relative">
          {/* Success Message Overlay */}
          {(successMessage && isProcessing) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-[#1E1E1E] bg-opacity-95 p-6 rounded-lg border border-[#C8A97E] shadow-lg">
                <div className="text-center">
                  <div className="mb-4 text-[#C8A97E] font-cinzel text-xl">
                    {successMessage}
                  </div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A97E] mx-auto"></div>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-4xl font-cinzel text-white mb-12 text-center">Enter the World</h2>
          
          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: undefined });
                }}
                className={`
                  w-full px-3 py-2 bg-[#3D2E22] border
                  rounded text-sm text-white placeholder-[#8B7355]
                  ${errors.username ? 'border-red-500' : 'border-[#8B7355]'}
                `}
                placeholder="The name whispered in legends"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: undefined });
                }}
                className={`
                  w-full px-3 py-2 bg-[#3D2E22] border
                  rounded text-sm text-white placeholder-[#8B7355]
                  ${errors.email ? 'border-red-500' : 'border-[#8B7355]'}
                `}
                placeholder="Where to send your quest updates"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined });
                }}
                className={`
                  w-full px-3 py-2 bg-[#3D2E22] border
                  rounded text-sm text-white placeholder-[#8B7355]
                  ${errors.password ? 'border-red-500' : 'border-[#8B7355]'}
                `}
                placeholder="Your secret incantation"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={`
                  w-full px-3 py-2 bg-[#3D2E22] border
                  rounded text-sm text-white placeholder-[#8B7355]
                  ${errors.confirmPassword ? 'border-red-500' : 'border-[#8B7355]'}
                `}
                placeholder="Repeat your mystical phrase"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setErrors({ ...errors, terms: undefined });
                }}
                className={`mr-2 bg-[#3D2E22] border-[#8B7355] rounded
                  ${errors.terms ? 'border-red-500' : ''}
                `}
              />
              <label htmlFor="terms" className="text-sm text-[#8B7355]">
                I agree to abide by the rules of this realm
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-400">{errors.terms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded font-cinzel"
            >
              Start Your Journey
            </button>
          </form>

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
            <Link 
              to="/login" 
              className={`text-[#C8A97E] hover:text-[#D8B98E] text-sm ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;