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
      const response = await axios.post('/auth/forgot-password', { email });
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E]">
      <div className="w-full max-w-[480px] p-6 bg-[#2A2A2A] rounded-lg shadow-lg">
        <h2 className="text-3xl font-cinzel text-white mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-cinzel text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
              placeholder="Your email"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-[#C8A97E] hover:bg-[#D8B98E] text-white rounded font-cinzel" disabled={isProcessing}>
            Send Reset Link
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-[#C8A97E] hover:text-[#D8B98E] text-sm">
            Back to Login
          </Link>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;