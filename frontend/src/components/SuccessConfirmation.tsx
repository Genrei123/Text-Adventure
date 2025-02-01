import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const SuccessConfirmation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-cinzel">
      <div className="bg-gray-800 p-8 rounded shadow-md w-800 max-w-2xl text-white">
        <h1 className="text-xl font-bold mb-4 text-center font-cinzel">Success</h1>
        <p className="mb-4 text-center">Your password has been reset successfully. You can now log in with your new password.</p>
        <Link to="/login" className="text-lg text-gray-400 hover:underline font-playfair mb-8 block text-center">Back to Login</Link>
      </div>
    </div>
  );
};

export default SuccessConfirmation;