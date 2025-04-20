import React, { useEffect } from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FooterLine from './FooterLine';
import "../App.css";

const Footer = () => {
  useEffect(() => {
    document.body.style.margin = '0';
  }, []);

  return (
    <footer className="w-full min-h-[500px] relative flex flex-col justify-between items-center p-5 bg-[#563C2D] text-[#B28F4C]">
      <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-4 relative">
        {/* Center-left content */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center font-playfair md:absolute md:left-10 lg:left-40 md:top-20 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">SAGE AI.</h1>
          <p className="text-lg md:text-xl text-white font-cinzel">Where stories are guided by</p>
          <p className="text-lg md:text-xl text-white font-cinzel">One's intuition and knowledge</p>
          <p className="text-lg md:text-xl text-white font-cinzel">Bred Series @2024</p>
        </div>

        {/* Right-side links */}
        <div className="flex flex-col items-center md:items-start md:absolute md:right-10 lg:right-40 md:top-24 text-lg md:text-xl font-playfair mt-4 md:mt-0">
          <Link to="/about" className="mb-2 cursor-pointer hover:underline hover:text-white">About Us</Link>
          <Link to="/privacy" className="mb-2 cursor-pointer hover:underline hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="cursor-pointer hover:underline hover:text-white">Terms of Service</Link>
          <br />
          {/* Social media icons */}
          <div className="flex justify-center mt-2 space-x-4">
            <a href="https://www.facebook.com/SageAITextAdventures/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="cursor-pointer hover:text-blue-500" />
            </a>
            <a href="https://www.instagram.com/sageai.2025/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="cursor-pointer hover:text-pink-500" />
            </a>
            <a href="https://www.youtube.com/@SageAI-TextAdventures" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="cursor-pointer hover:text-red-500" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Removed the owl from here and moved it to FooterLine */}
      <FooterLine className="z-10" />
    </footer>
  );
};

export default Footer;