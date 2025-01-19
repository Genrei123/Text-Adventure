import React, { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from '../axiosConfig/axiosConfig';

interface LoginProps {
  onLogin: (username: string) => void;
}

interface ValidationErrors {
  username?: string;
  password?: string;
  general?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    /*TODO: Add validation for existing username */
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      setSuccessMessage('Logging in...');
      
      // Replaced with actual API call
      const response = await axios.post('/api/login', {
        email,
        password,
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        onLogin(data.user.email);
        navigate('/');
      } else {
        setErrors({ general: data.message });
      }
    }
  };

  /**
   * Handles social login (Google/Facebook)
   * 
   * TODO: Backend Integration Guide
   * 1. OAuth2 Configuration:
   *    - Replace the setTimeout with actual OAuth2 flow
   *    - Set up OAuth2 client credentials in environment variables
   *    - Configure OAuth2 scopes (email, profile, etc.)
   *    - Handle OAuth2 state parameter for security
   * 
   * 2. API Endpoints Needed:
   *    - POST /api/auth/social/login/google
   *    - POST /api/auth/social/login/facebook
   *    Expected Response:
   *    {
   *      success: boolean,
   *      data: {
   *        userId: string,
   *        username: string,
   *        email: string,
   *        token: string,
   *        refreshToken?: string
   *      },
   *      error?: string
   *    }
   * 
   * 3. Error Handling:
   *    - Handle OAuth2 popup blocked
   *    - Handle user cancelled login
   *    - Handle invalid/expired tokens
   *    - Handle network errors
   *    - Handle account linking (if user exists with same email)
   * 
   * Example Integration:
   * try {
   *   setIsProcessing(true);
   *   setSuccessMessage(`Connecting to ${provider}...`);
   * 
   *   // 1. Initialize OAuth2 flow
   *   const oauthProvider = new OAuth2Provider(provider);
   *   const authResponse = await oauthProvider.signIn();
   * 
   *   setSuccessMessage('Verifying credentials...');
   * 
   *   // 2. Verify with our backend
   *   const apiResponse = await fetch(`/api/auth/social/login/${provider.toLowerCase()}`, {
   *     method: 'POST',
   *     headers: {
   *       'Content-Type': 'application/json',
   *       'Accept': 'application/json'
   *     },
   *     body: JSON.stringify({
   *       token: authResponse.accessToken,
   *       provider: provider.toLowerCase()
   *     })
   *   });
   * 
   *   const userData = await apiResponse.json();
   * 
   *   if (!apiResponse.ok) {
   *     throw new Error(userData.error || 'Authentication failed');
   *   }
   * 
   *   // 3. Store authentication data
   *   localStorage.setItem('token', userData.data.token);
   *   if (userData.data.refreshToken) {
   *     localStorage.setItem('refreshToken', userData.data.refreshToken);
   *   }
   * 
   *   // 4. Update UI and redirect
   *   setSuccessMessage('Login successful! Redirecting...');
   *   onLogin(userData.data.username);
   *   setTimeout(() => {
   *     setIsProcessing(false);
   *     navigate('/');
   *   }, 1000);
   * 
   * } catch (error) {
   *   console.error('Social login error:', error);
   *   setErrors({ general: 'Login failed. Please try again.' });
   *   setSuccessMessage('');
   *   setIsProcessing(false);
   * }
   * 
   * @param {string} provider - The social login provider ('Google' or 'Facebook')
   */
  
  const handleSocialLogin = async (provider: string) => {
    setIsProcessing(true);
    setSuccessMessage(`Connecting to ${provider}...`);
  
    try {
      // Redirect to backend's full URL
      window.location.href = `http://localhost:3000/auth/${provider.toLowerCase()}`;
    } catch (error) {
      console.error(`Error during ${provider} login:`, error);
      setSuccessMessage(`Failed to log in with ${provider}.`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-start bg-cover bg-center fade-in" style={{ backgroundImage: "url('src/assets/Login.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      {/* Left Side - Logo */}
      <div className="w-full md:w-1/2 flex items-center justify-center h-screen">
      </div>
      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end p-4 md:p-0 mt-8 md:mt-0 md:mr-[250px]">
        <div className="w-full md:w-[480px] relative">
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
          
          <h2 className="text-4xl font-cinzel text-white mb-12 text-center md:animate-none">Gates of Realm</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-[#8B7355]">
                <input
                  type="checkbox"
                  className="mr-2 bg-[#3D2E22] border-[#8B7355]"
                />
                Keep my portal open
              </label>
              <a href="#" className="text-[#8B7355] hover:text-[#C8A97E]">
                Forgotten the secret words?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded font-cinzel"
            >
              Enter the Realm
            </button>
          </form>

          <div className="mt-8">
            <div className="text-center text-sm text-[#8B7355] mb-4">Enter Using</div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="p-2 rounded-full bg-[#3D2E22] hover:bg-[#4D3E32] disabled:opacity-50"
                disabled={isProcessing}
              >
                <FaGoogle className="text-[#8B7355]" size={20} />
              </button>
              <button
                onClick={() => handleSocialLogin('Facebook')}
                className="p-2 rounded-full bg-[#3D2E22] hover:bg-[#4D3E32] disabled:opacity-50"
                disabled={isProcessing}
              >
                <FaFacebook className="text-[#8B7355]" size={20} />
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-[#8B7355] text-sm">Mark your Name in the History</div>
            <Link to="/register" className="text-[#C8A97E] hover:text-[#D8B98E] text-sm">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
