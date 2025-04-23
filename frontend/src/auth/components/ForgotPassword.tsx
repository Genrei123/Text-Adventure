import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from '../../../config/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    toast.info('Sending reset link...');

    try {
      // Convert email to lowercase before sending to the API
      const normalizedEmail = email.toLowerCase().trim();
      
      await axios.post('/auth/forgot-password', { email: normalizedEmail });
      toast.success('Reset link sent! Please check your email.');
      setTimeout(() => {
        navigate('/email-confirmation');
      }, 3000);
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store the email as is for display, but will be normalized on submit
    setEmail(e.target.value);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/fadeLogin.png')` }}
    >
      <div className="w-full max-w-md px-6 py-8">
        <div className="bg-[#3D2E22] rounded-xl shadow-2xl border border-[#8B7355]/50 p-8 text-center">
          <h1 className="text-3xl font-cinzel text-white mb-6">Forgot Password</h1>
          
          <div className="py-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#3D2E22] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <p className="text-lg text-[#C8A97E] mb-4">Reset Your Password</p>
            <p className="mb-6 text-[#8B7355]">Enter your email address and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-left">
                <label className="block text-sm font-cinzel text-[#C8A97E] mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 bg-[#2A1F17] border border-[#8B7355] rounded text-sm text-white placeholder-[#8B7355] focus:border-[#C8A97E] focus:outline-none"
                  placeholder="Your email"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full px-6 py-3 font-cinzel bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded transition duration-300"
                disabled={isProcessing}
              >
                {isProcessing ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            
            <div className="mt-6">
              <Link
                to="/login"
                className="text-[#C8A97E] hover:text-[#D8B98E] transition-colors text-sm"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;