import React from 'react';

const Loader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent"></div>
    {message && <p className="mt-4 text-gray-400">{message}</p>}
  </div>
);

export default Loader;