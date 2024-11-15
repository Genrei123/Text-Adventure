import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Searchbar: React.FC = () => {
  return (
    <div className="flex items-center border border-gray-700 rounded-full p-2 w-1/4 bg-[#563C2D]">
      <input 
        type="text" 
        className="flex-grow outline-none text-[#FFD700] bg-[#563C2D] ml-2 font-playfair placeholder-[#FFD700]" 
        placeholder="Search Stories..." 
      />
      <FaSearch className="text-[#FFD700] mr-2" />
    </div>
  );
};

export default Searchbar;
 