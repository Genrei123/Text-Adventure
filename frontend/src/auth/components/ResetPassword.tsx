import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../App.css';
import axios from '../../../config/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordInput from '../../components/PasswordInput';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    console.log('Token from URL:', token);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid reset token');
      console.error('No token found');
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
      console.log('Sending reset request with:', { token, newPassword });
      
      const response = await axios.post('/auth/reset-password', { 
        token, 
        newPassword 
      });

      console.log('Reset password response:', response.data);

      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(
        'Failed to reset password. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C1810]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#3D2E22] rounded-xl">
        <h2 className="text-2xl font-bold text-white text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
            placeholder="New password"
            disabled={isProcessing}
          />
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
            placeholder="Confirm password"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isProcessing 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-green-700 hover:bg-green-800'
            } text-white transition-colors`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;