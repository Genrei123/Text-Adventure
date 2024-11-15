import React from 'react';
import '../App.css';

const Verification: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-cinzel">
      <div className="bg-gray-800 p-8 rounded shadow-md w-800 max-w-2xl text-white">

        
        {/* Verification Code Section */}
        <h1 className="text-xl font-bold mb-4 text-center font-cinzel">Enter Verification Code</h1>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            className="
              mt-1 block w-full px-3 py-2 border border-white
              rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
              focus:border-indigo-500 sm:text-sm font-playfair bg-[#563C2D]
              text-white placeholder-white font-playfair opacity-75
            "
            placeholder="Enter your code"
          />
          <button
            className="
              py-2 px-4 border border-transparent rounded-md shadow-sm
              text-sm font-medium text-white bg-gradient-to-r from-gray-600
              to-gray-800 hover:from-gray-700 hover:to-gray-900 focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            "
          >
            Verify
          </button>
        </div>
        <a
          href="#"
          className="text-lg text-gray-400 hover:underline font-playfair mb-8 block text-center"
        >
          Resend verification code
        </a>
      </div>
    </div>
  );
};

export default Verification;
