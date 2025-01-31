import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../App.css';
import axios from '../axiosConfig/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsProcessing(true);
    toast.info('Resetting password...');

    try {
      const response = await axios.post('/api/reset-password', { token, newPassword });
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E]">
      <div className="w-full max-w-[480px] p-6 bg-[#2A2A2A] rounded-lg shadow-lg">
        <h2 className="text-3xl font-cinzel text-white mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-cinzel text-white mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
              placeholder="New password"
            />
          </div>
          <div>
            <label className="block text-sm font-cinzel text-white mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
              placeholder="Confirm password"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-[#C8A97E] hover:bg-[#D8B98E] text-white rounded font-cinzel" disabled={isProcessing}>
            Reset Password
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPassword;