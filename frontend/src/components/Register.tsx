import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import '../App.css';
import axios from '../axiosConfig/axiosConfig';

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
  const [successMessage, setSuccessMessage] = useState<string>('');
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
      const now = new Date().toISOString();
      // Regular registration



      
      try {
        const response = await axios.post('/api/register', {
          username,
          email,
          password,
          private: true,
          model: 'gpt-4',
          admin: false,
          createdAt: now,
          updatedAt: now,
        });
        setSuccessMessage('Registration successful! Please check your email for the verification code.');
        setTimeout(() => navigate('/verify-email'), 3000);
      } catch (error) {
        setErrors({ general: error.response?.data?.message || 'Registration failed.' });
      } finally {
        setIsProcessing(false);
      }


      

      onRegister(username, false);
      setSuccessMessage('Registration successful! Redirecting to login...');

      axios.post('/api/register', {
        username: username,
        email: email,
        password: password
      }).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.error(error);
      });
      
      // Wait for 3 seconds to show success message before redirecting
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/login');
      }, 3000);
    }
  };

  /**
   * Handles social registration (Google/Facebook)
   * 
   * TODO: Backend Integration Guide
   * 1. OAuth2 Configuration:
   *    - Replace the setTimeout with actual OAuth2 flow
   *    - Implement proper OAuth2 client configuration for each provider
   *    - Handle OAuth2 callback URLs and state management
   * 
   * 2. API Endpoints Needed:
   *    - POST /api/auth/social/google
   *    - POST /api/auth/social/facebook
   *    - Response should include: { userId, username, email, token }
   * 
   * 3. Error Handling:
   *    - Add try-catch blocks around API calls
   *    - Handle specific OAuth errors (e.g., cancelled by user, token expired)
   *    - Show appropriate error messages to user
   * 
   * Example Integration:
   * try {
   *   setIsProcessing(true);
   *   setSuccessMessage(`Logging in with ${provider}...`);
   * 
   *   // 1. Initialize OAuth2 flow
   *   const authResponse = await initializeOAuth2Flow(provider);
   * 
   *   // 2. Exchange OAuth2 token for our API token
   *   const apiResponse = await fetch(`/api/auth/social/${provider.toLowerCase()}`, {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ 
   *       token: authResponse.token,
   *       // Add any other necessary OAuth data
   *     })
   *   });
   * 
   *   const userData = await apiResponse.json();
   *   
   *   if (!apiResponse.ok) {
   *     throw new Error(userData.message || 'Authentication failed');
   *   }
   * 
   *   // 3. Handle successful authentication
   *   setSuccessMessage(`${provider} login successful! Redirecting...`);
   *   onRegister(userData.username, true);
   * 
   *   // 4. Store token and redirect
   *   localStorage.setItem('token', userData.token);
   *   setTimeout(() => {
   *     setIsProcessing(false);
   *     navigate('/');
   *   }, 1500);
   * 
   * } catch (error) {
   *   setSuccessMessage('Authentication failed. Please try again.');
   *   setTimeout(() => setIsProcessing(false), 2000);
   * }
   * 
   * @param {string} provider - The social login provider ('Google' or 'Facebook')
   */
  const handleSocialRegister = async (provider: string) => {
    // Current frontend-only implementation
    setIsProcessing(true);
    setSuccessMessage(`Logging in with ${provider}...`);

    // Simulated OAuth flow - Replace with actual OAuth2 implementation
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Simulated successful authentication
    setSuccessMessage(`${provider} login successful! Redirecting...`);
    onRegister(`${provider} User`, true);
    
    // Simulated token storage and redirect
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex">
      {/* Left Side - Logo Section */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="text-xl font-cinzel text-white">SAGE.AI</div>
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
              <button
                onClick={() => handleSocialRegister('Facebook')}
                className="p-2 rounded-full bg-[#3D2E22] hover:bg-[#4D3E32] disabled:opacity-50"
                disabled={isProcessing}
              >
                <FaFacebook className="text-[#8B7355]" size={20} />
              </button>
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
    </div>
  );
};

export default Register;