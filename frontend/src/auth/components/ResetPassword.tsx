import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../../App.css';
import axios from '../../../config/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordInput from './PasswordInput';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isTokenChecking, setIsTokenChecking] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // First verify the token is valid when component loads
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error('Invalid reset token');
        setIsTokenChecking(false);
        return;
      }

      try {
        setIsTokenChecking(true);
        const response = await axios.post('/auth/validate-reset-token', { token });
        if (response.data && response.data.message === 'Valid reset token') {
          setIsTokenValid(true);
        } else {
          toast.error('This password reset link is invalid or has expired');
          setTimeout(() => navigate('/forgot-password'), 3000);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        toast.error('This password reset link is invalid or has expired');
        setTimeout(() => navigate('/forgot-password'), 3000);
      } finally {
        setIsTokenChecking(false);
      }
    };

    validateToken();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !isTokenValid) {
      toast.error('Invalid or expired reset token');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsProcessing(true);
    toast.info('Resetting password...');

    try {
      const response = await axios.post('/auth/reset-password', { 
        token, 
        newPassword 
      });

      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. The link may be expired or invalid.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isTokenChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
           style={{ backgroundImage: `url('/fadeLogin.png')` }}>
        <div className="w-full max-w-md px-6 py-8">
          <div className="bg-[#3D2E22] rounded-xl shadow-2xl border border-[#8B7355]/50 p-8 text-center">
            <h1 className="text-3xl font-cinzel text-white mb-6">Verifying Link</h1>
            <div className="py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-t-[#C8A97E] border-[#8B7355]/30 animate-spin"></div>
              <p className="text-lg text-[#C8A97E]">Verifying your reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/fadeLogin.png')` }}
    >
      <div className="w-full max-w-md px-6 py-8">
        <div className="bg-[#3D2E22] rounded-xl shadow-2xl border border-[#8B7355]/50 p-8 text-center">
          <h1 className="text-3xl font-cinzel text-white mb-6">Reset Password</h1>
          
          {!isTokenValid ? (
            <div className="py-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#3D2E22] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-lg text-[#C8A97E] mb-4">Invalid Reset Link</p>
              <p className="mb-6 text-[#8B7355]">This password reset link is invalid or has expired. Please request a new one.</p>
              <Link
                to="/forgot-password"
                className="inline-block px-6 py-3 font-cinzel bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded transition duration-300"
              >
                Request New Link
              </Link>
            </div>
          ) : (
            <div className="py-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#3D2E22] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              
              <p className="text-lg text-[#C8A97E] mb-4">Create New Password</p>
              <p className="mb-6 text-[#8B7355]">Enter your new password below. Make sure it's strong and secure.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-left">
                  <label className="block text-sm font-cinzel text-[#C8A97E] mb-2">New Password</label>
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2A1F17] border border-[#8B7355] rounded text-sm text-white placeholder-[#8B7355] focus:border-[#C8A97E] focus:outline-none"
                    placeholder="Enter new password"
                    disabled={isProcessing}
                    showValidation={true}
                  />
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-cinzel text-[#C8A97E] mb-2">Confirm Password</label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2A1F17] border border-[#8B7355] rounded text-sm text-white placeholder-[#8B7355] focus:border-[#C8A97E] focus:outline-none"
                    placeholder="Confirm your password"
                    disabled={isProcessing}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full px-6 py-3 font-cinzel bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded transition duration-300"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </div>
          )}
          
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
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;