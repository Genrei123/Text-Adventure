import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaDiscord } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-2xl text-[#F1DC68]" />,
      title: 'Our Location',
      details: 'University of Caloocan City - North, Caloocan City, Philippines'
    },
    {
      icon: <FaPhone className="text-2xl text-[#F1DC68]" />,
      title: 'Project Lead',
      details: 'Genrey O. Cristobal, Project Development Lead'
    },
    {
      icon: <FaEnvelope className="text-2xl text-[#F1DC68]" />,
      title: 'Email Address',
      details: 'cristobal.genreybscs2022@gmail.com'
    },
    {
      icon: <FaDiscord className="text-2xl text-[#F1DC68]" />,
      title: 'Discord Community',
      details: 'discord.gg/sageai-community'
    }
  ];

  const departments = [
    'General Inquiry',
    'Technical Support',
    'Billing and Subscriptions',
    'Content Creation',
    'Partnership Opportunities',
    'Press and Media'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    setFormSubmitted(true);
  };

  return (
    <div className="bg-[#1E1E1E] text-white min-h-screen">
      {/* Header */}
      <div 
        className="bg-gradient-to-b from-[#2A1B12] to-[#1E1E1E] py-20 px-4"
      >
        <motion.div 
          className="container mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#F1DC68] font-cinzel mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            className="bg-[#2A2A2A] rounded-lg p-8 shadow-xl border border-[#444]"
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-[#B28F4C] mb-6 pb-2 border-b border-[#444]"
              variants={fadeIn}
            >
              Send Us a Message
            </motion.h2>

            {formSubmitted ? (
              <motion.div 
                className="bg-[#2D3B2D] p-6 rounded-lg border border-[#4A5F4A] text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-[#A3E635] mb-3">Message Sent!</h3>
                <p className="text-gray-300">
                  Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                </p>
                <button 
                  className="mt-6 bg-[#4A5F4A] hover:bg-[#5A705A] text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      subject: '',
                      message: ''
                    });
                  }}
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form onSubmit={handleSubmit} className="space-y-6" variants={formVariants}>
                <motion.div variants={fadeIn}>
                  <label htmlFor="name" className="block text-[#B28F4C] mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full py-2 px-4 bg-[#1E1E1E] text-white border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B28F4C] focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label htmlFor="email" className="block text-[#B28F4C] mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full py-2 px-4 bg-[#1E1E1E] text-white border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B28F4C] focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label htmlFor="subject" className="block text-[#B28F4C] mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full py-2 px-4 bg-[#1E1E1E] text-white border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B28F4C] focus:border-transparent"
                  >
                    <option value="" disabled>Select a department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label htmlFor="message" className="block text-[#B28F4C] mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full py-2 px-4 bg-[#1E1E1E] text-white border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B28F4C] focus:border-transparent resize-none"
                    placeholder="Enter your message"
                  ></textarea>
                </motion.div>

                <motion.button
                  type="submit"
                  className="w-full bg-[#B28F4C] hover:bg-[#9D7B3A] text-white font-bold py-3 rounded-md transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </motion.form>
            )}
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h2 className="text-2xl font-bold text-[#B28F4C] mb-6 pb-2 border-b border-[#444]">
                Contact Information
              </h2>
              <p className="text-gray-300 mb-8">
                Our team is here to help! Reach out through any of the channels below and we'll respond as soon as possible.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <div className="bg-[#2A2A2A] p-3 rounded-full">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-[#F1DC68] font-semibold">{info.title}</h3>
                      <p className="text-gray-300">{info.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-[#2A2A2A] rounded-lg p-8 shadow-xl border border-[#444]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-[#B28F4C] mb-4">Business Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Monday - Friday:</span>
                  <span className="text-white">9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Saturday:</span>
                  <span className="text-white">10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sunday:</span>
                  <span className="text-white">Closed</span>
                </div>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                Note: Technical support is available 24/7 for premium subscribers.
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-[#B28F4C] mb-8 text-center">Frequently Asked Questions</h2>
          <p className="text-center text-gray-300 max-w-3xl mx-auto mb-10">
            Can't find the answer you're looking for? Feel free to contact us using the form above.
          </p>

          <div className="flex justify-center">
            <button 
              className="bg-[#B28F4C] hover:bg-[#9D7B3A] text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
              onClick={() => window.location.href = '/faq'}
            >
              Visit Our FAQ Page
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact; 