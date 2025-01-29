import React from 'react';

const EmailConfirmed: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-cinzel">
      <div className="bg-gray-800 p-8 rounded shadow-md w-800 max-w-2xl text-white">
        <h2 className="text-xl font-bold mb-4 text-center font-cinzel">Email Confirmed</h2>
        <p className="mb-4 text-center">Your email has been successfully verified!</p>
        <button onClick={() => window.location.href = "/login"} className="text-lg text-gray-400 hover:underline font-playfair mb-8 block text-center">Go to Login</button>
      </div>
    </div>
  );
};

export default EmailConfirmed;