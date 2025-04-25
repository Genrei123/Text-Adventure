import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaYoutube, FaDiscord, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FooterLine from './FooterLine';
import "../App.css";

const Footer = () => {
  useEffect(() => {
    document.body.style.margin = '0';
  }, []);

  const footerLinks = [
    { title: 'About Us', path: '/AboutUs' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'Terms of Service', path: '/terms' },
    { title: 'Contact', path: '/contact' },
    { title: 'FAQ', path: '/faq' }
  ];

  const socialLinks = [
    { icon: <FaFacebook size={24} />, url: 'https://www.facebook.com/SageAITextAdventures/', color: 'hover:text-blue-500' },
    { icon: <FaInstagram size={24} />, url: 'https://www.instagram.com/sageai.2025/', color: 'hover:text-pink-500' },
    { icon: <FaYoutube size={24} />, url: 'https://www.youtube.com/@SageAI-TextAdventures', color: 'hover:text-red-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <footer className="w-full relative flex flex-col justify-between items-center bg-[#563C2D] text-[#B28F4C] overflow-hidden">
      {/* Decorative Patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B28F4C] to-transparent"></div>
        <div className="absolute top-10 left-0 w-20 h-20 rounded-full bg-[#B28F4C] blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#B28F4C] blur-3xl"></div>
      </div>

      <motion.div 
        className="container mx-auto px-6 pt-20 pb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 relative z-10">
          {/* Left Section - Logo & Tagline */}
          <motion.div 
            className="flex flex-col items-center md:items-start space-y-4"
            variants={itemVariants}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#B28F4C] font-playfair">SAGE AI.</h2>
            <div className="text-lg text-white font-cinzel mt-3 space-y-1 text-center md:text-left">
              <p>Where stories are guided by</p>
              <p>One's intuition and knowledge</p>
              <p className="text-[#B28F4C] mt-4">Bred Series @2024</p>
            </div>
          </motion.div>
          
          {/* Middle Section - Quick Links */}
          <motion.div 
            className="flex flex-col items-center space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-white mb-2 font-cinzel">Explore</h3>
            <ul className="flex flex-col items-center space-y-4">
              {footerLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link 
                    to={link.path} 
                    className="text-lg text-white hover:text-[#F1DC68] transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Right Section - Owl Image & Social */}
          <motion.div 
            className="flex flex-col items-center md:items-end space-y-6 relative"
            variants={itemVariants}
          >
            <motion.img 
              src="/owl.png" 
              alt="Owl" 
              className="w-[150px] md:w-[180px] h-auto object-contain"
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ rotate: 5, scale: 1.05 }}
            />
            
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl font-bold text-white font-cinzel">Connect With Us</h3>
              <div className="flex justify-center space-x-5">
                {socialLinks.map((social, index) => (
                  <motion.a 
                    key={index} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-white ${social.color} transition-colors duration-300`}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Newsletter */}
        {/* <motion.div 
          className="bg-[#3F2B1F] p-8 rounded-lg shadow-lg max-w-2xl mx-auto mb-10 relative z-10"
          variants={itemVariants}
        >
          <h3 className="text-xl text-white font-bold mb-3 text-center font-cinzel">Join the Realm Newsletter</h3>
          <p className="text-gray-300 mb-4 text-center">Stay updated with the latest stories and adventures</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow py-2 px-4 bg-[#2A1B12] text-white border border-[#634729] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B28F4C]"
            />
            <button 
              className="bg-[#B28F4C] hover:bg-[#9D7B3A] text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </motion.div> */}
      </motion.div>
      
      {/* <FooterLine className="z-10" /> */}
      
      {/* Copyright */}
      <motion.div 
        className="w-full py-4 bg-[#3F2B1F] text-center text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>© 2024 SAGE AI. All rights reserved. Created with imagination.</p>
      </motion.div>
    </footer>
  );
};

export default Footer;