import React, { useEffect } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import FooterLine from './FooterLine';

const Footer = () => {
  useEffect(() => {
    document.body.style.margin = '0';
  }, []);

  return (
    <footer className="w-full h-[425px] relative flex flex-col justify-between items-center p-5 bg-[#563C2D] text-[#B28F4C]">
        <div className="w-full flex items-center justify-between">
          {/* Center-left content */}
          <div className="flex-1 flex flex-col items-start justify-center font-playfair absolute left-40 top-20">
              <h1 className="text-6xl font-bold mb-2">SAGE AI.</h1>
                <p className="text-xl text-white font-cinzel">Where stories are guided by</p>
                <p className="text-xl text-white font-cinzel">One's intuition and knowledge</p>
                <p className="text-xl text-white font-cinzel">Bred Series @2024</p>
          </div>
          <img src="/src/assets/owl.png" alt="Owl" className="absolute right-40 top-[-280px] h-[700px] z-0" />
                {/* Right-side links */}
                <div className="flex flex-col items-start absolute right-40 top-24 text-xl font-playfair">
            <p className="mb-2 cursor-pointer hover:underline hover:text-white">About Us</p>
            <p className="mb-2 cursor-pointer hover:underline hover:text-white">Contact</p>
            <p className="mb-2 cursor-pointer hover:underline hover:text-white">Privacy Policy</p>
            <p className="cursor-pointer hover:underline hover:text-white">Terms of Service</p>
            <br></br>
          {/* Social media icons */}
          <div className="flex justify-center mt-2 space-x-4">
            <FaFacebook className="cursor-pointer hover:text-blue-500" />
            <FaInstagram className="cursor-pointer hover:text-pink-500" />
            <FaYoutube className="cursor-pointer hover:text-red-500" />
            <FaLinkedin className="cursor-pointer hover:text-blue-700" />
          </div>
        </div>
      </div>
      
      <FooterLine className="z-10" />
    </footer>
  );
};

export default Footer;
