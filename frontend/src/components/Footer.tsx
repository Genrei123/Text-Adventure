import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import owlImage from '../assets/owl.png';

const Footer = () => {
  return (
    <footer className="w-full h-[425px] relative gap-0 opacity-100 flex justify-between items-center p-5 bg-gray-800 text-white">
      <div className="text-left">
        <h1>Title</h1>
        <p>Short description</p>
      </div>
      <div className="text-right">
        <div className="flex items-center">
          <div>
            <p>About Us</p>
            <p>Contact</p>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>
          <Image src={owlImage} alt="Owl" width={50} height={50} className="ml-4" />
        </div>
        <div className="flex justify-between mt-2">
          <FaFacebook />
          <FaInstagram />
          <FaYoutube />
          <FaLinkedin />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
