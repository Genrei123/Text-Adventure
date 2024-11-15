import React from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import '../App.css';

const Register: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-cinzel">
      <div className="bg-gray-800 p-8 rounded shadow-md w-600 max-w-lg text-white">
        <h1 className="text-2xl font-bold mb-6 text-center font-cinzel">ENTER THE WORLD</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white font-cinzel">Username</label>
            <input
              type="text"
              className="
                mt-1 block w-full px-3 py-2 border border-white
                rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                focus:border-indigo-500 sm:text-sm font-playfair bg-[#563C2D]
                text-white placeholder-white font-playfair opacity-75
              "
              placeholder="The name whispered in the legends"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white font-cinzel">Email</label>
            <input
              type="email"
              className="
                mt-1 block w-full px-3 py-2 border border-white
                rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                focus:border-indigo-500 sm:text-sm font-playfair bg-[#563C2D]
                text-white placeholder-white font-playfair opacity-75
              "
              placeholder="Where to send your quest updates"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white font-cinzel">PASSWORD</label>
            <input
              type="password"
              className="
                mt-1 block w-full px-3 py-2 border border-white
                rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                focus:border-indigo-500 sm:text-sm bg-[#563C2D] text-white
                placeholder-white font-playfair opacity-75
              "
              placeholder="Your secret Incantation"
            />
          </div>
         
          <div>
            <label className="block text-sm font-medium text-white font-cinzel">Confirm Password</label>
            <input
              type="password"
              className="
                mt-1 block w-full px-3 py-2 border border-white
                rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                focus:border-indigo-500 sm:text-sm bg-[#563C2D] text-white
                placeholder-white font-playfair opacity-75
              "
              placeholder="Repeat your secret Incantation"
            />
          </div>

          <div className="flex items-center mt-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
              I abide the rules of this realm
            </label>
          </div>

          <button
            type="submit"
            className="
              w-full flex justify-center py-2 px-4 border border-transparent
              rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r
              from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            "
          >
            START YOUR JOURNEY
          </button>
        </form>

        {/* Horizontal Line */}
        <div className="relative mt-6 flex items-center">
          <span className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 bg-gray-700 h-px"></span>
        </div>

        {/* Continue with Social Login */}
        <div className="relative mt-6 flex items-center justify-center">
          <span className="relative bg-gray-800 px-3 text-sm text-gray-400">
            or Start your journey with
          </span>
        </div>

        {/* Social Login Buttons */}
        <div className="mt-6 flex flex-col justify-center space-y-4">
          <div className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <button className="flex items-center">
              <FaFacebook size={18} />
              <span className="ml-2">Facebook</span>
            </button>
          </div>

          <div className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <button className="flex items-center">
              <FaGoogle size={18} />
              <span className="ml-2">Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;