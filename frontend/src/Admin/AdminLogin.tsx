import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../config/axiosConfig';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ general?: string }>({});
  const navigate = useNavigate();

  // Check if user is already logged in as admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUserStr = localStorage.getItem('adminUser');
    
    if (adminToken && adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        if (adminUser && adminUser.admin === true) {
          // User is already logged in as admin, redirect to admin page
          navigate('/Admin/Page');
        }
      } catch (error) {
        // Invalid user data in localStorage, clear it
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  }, [navigate]);

  // Update the handleEmailChange function
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force lowercase as user types for better visual feedback
    e.target.value = e.target.value.toLowerCase();
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrors({});
    toast.info('Logging in...');

    try {
      // Convert email to lowercase before sending to the server
      const normalizedEmail = email.toLowerCase().trim();
      
      // Use the configured axios instance with normalized email
      const response = await axiosInstance.post('/auth/login', { 
        email: normalizedEmail, 
        password 
      });
      const { token, user } = response.data;

      // Check if user exists and has admin privileges
      if (user && user.admin === true) {
        toast.success('Admin login successful!');
        // Store admin token in localStorage for future API calls
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        
        setTimeout(() => {
          navigate('/Admin/Page');
        }, 1500);
      } else {
        // User exists but is not an admin
        toast.error('Access denied. Admin privileges required.');
        setErrors({ general: 'This account does not have admin privileges.' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          // Authentication failed
          const errorMessage = data.message || 'Invalid credentials. Please check your email and password.';
          toast.error(errorMessage);
          setErrors({ general: errorMessage });
        } else {
          // Other API errors
          const errorMessage = data.message || 'Login failed. Please try again.';
          toast.error(errorMessage);
          setErrors({ general: errorMessage });
        }
      } else if (error.request) {
        // Network error
        toast.error('Network error. Please check your connection and try again.');
        setErrors({ general: 'Network error. Please check your connection and ensure the backend server is running.' });
      } else {
        // Unknown error
        toast.error('An unexpected error occurred. Please try again.');
        setErrors({ general: 'An unexpected error occurred.' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E]">
      <div className="w-full max-w-[480px] p-6 bg-[#2A2A2A] rounded-lg shadow-lg">
        <h2 className="text-3xl font-cinzel text-white mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-cinzel text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onPaste={(e) => {
                // Handle paste events to also force lowercase
                e.preventDefault();
                const text = e.clipboardData.getData('text').toLowerCase();
                setEmail(text);
              }}
              className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-cinzel text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
              placeholder="Your password"
              required
            />
          </div>
          {errors.general && (
            <div className="text-red-500 text-sm mt-2">{errors.general}</div>
          )}
          <button 
            type="submit" 
            className="w-full py-2 bg-[#C8A97E] hover:bg-[#D8B98E] text-white rounded font-cinzel" 
            disabled={isProcessing}
          >
            {isProcessing ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-[#C8A97E] hover:text-[#D8B98E] text-sm">
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link to="/" className="text-[#C8A97E] hover:text-[#D8B98E] text-sm">
            Back to Home
          </Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminLogin;