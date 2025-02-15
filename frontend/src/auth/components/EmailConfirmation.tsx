import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const EmailConfirmation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-cinzel">
      <div className="bg-gray-800 p-8 rounded shadow-md w-800 max-w-2xl text-white">
        <h1 className="text-xl font-bold mb-4 text-center font-cinzel">Email Confirmation Required</h1>
        <p className="mb-4 text-center">A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.</p>
        <Link to="/login" className="text-lg text-gray-400 hover:underline font-playfair mb-8 block text-center">Back to Login</Link>
      </div>
    </div>
  );
};

export default EmailConfirmation;