import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(item => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  // FAQ categories
  const categories = [
    'all',
    'account',
    'subscription',
    'gameplay',
    'technical',
    'content',
    'billing'
  ];

  // FAQ data
  const faqData = [
    {
      question: "What is SAGE.AI?",
      answer: "SAGE.AI is an AI-driven interactive storytelling platform where you embark on infinite adventures shaped by your imagination. Our platform combines advanced AI technology with creative storytelling to deliver personalized narrative experiences that adapt to your choices and preferences.",
      category: "general"
    },
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Enter the World' button on our landing page or the 'Register' link in the navigation menu. Follow the prompts to enter your email, create a password, and set up your profile. Once you've verified your email address, you'll have full access to the platform.",
      category: "account"
    },
    {
      question: "Is SAGE.AI free to use?",
      answer: "SAGE.AI offers both free and premium subscription options. The free tier gives you access to basic features and a limited number of stories per month. Premium subscriptions provide unlimited access to all stories, advanced features, priority support, and exclusive content.",
      category: "subscription"
    },
    {
      question: "What subscription plans do you offer?",
      answer: "We offer several subscription plans: Monthly ($9.99/month), Quarterly ($24.99/3 months), and Annual ($89.99/year). Each plan provides full access to premium features. We also offer a special Creator tier ($19.99/month) that includes advanced tools for developing and sharing your own interactive stories.",
      category: "subscription"
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time by going to your Account Settings and selecting 'Manage Subscription'. Click on 'Cancel Subscription' and follow the prompts. Your subscription will remain active until the end of the current billing period.",
      category: "billing"
    },
    {
      question: "Can I use SAGE.AI on my mobile device?",
      answer: "Yes! SAGE.AI is fully responsive and works on desktop, tablet, and mobile devices. For the best mobile experience, we recommend using our progressive web app (PWA) which you can add to your home screen for quick access.",
      category: "technical"
    },
    {
      question: "How does the AI storytelling work?",
      answer: "Our AI storytelling system uses advanced language models trained on a vast corpus of literature and interactive narratives. The AI adapts to your choices, learning your preferences over time to create more personalized adventures. Each decision you make influences the direction of the story, creating unique narrative paths.",
      category: "gameplay"
    },
    {
      question: "Can I create my own stories?",
      answer: "Yes! Premium subscribers can access our Story Creator tools to develop their own interactive narratives. You can customize characters, settings, plot points, and decision branches, then publish your creations for other users to enjoy. Creator tier subscribers get access to advanced AI-assistance tools for story development.",
      category: "content"
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use industry-standard encryption and secure payment processors to ensure your financial information is protected. We never store complete credit card details on our servers. All transactions are processed through reputable payment gateways that comply with PCI DSS standards.",
      category: "billing"
    },
    {
      question: "What if I forget my password?",
      answer: "If you forget your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you a secure link to reset your password. For security reasons, this link expires after 24 hours.",
      category: "account"
    },
    {
      question: "How do I report a technical issue?",
      answer: "Technical issues can be reported through the 'Help' section in your account dashboard or by emailing support@sageai.com. Please provide as much detail as possible, including screenshots and steps to reproduce the issue. Our technical team will investigate and respond as quickly as possible.",
      category: "technical"
    },
    {
      question: "Are there age restrictions for using SAGE.AI?",
      answer: "SAGE.AI is designed for users aged 13 and older. Users between 13-18 years old should have parental consent before creating an account. We offer content rating filters that parents can enable to ensure age-appropriate storytelling experiences.",
      category: "account"
    }
  ];

  // Filter FAQs based on search term and active category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-4xl md:text-5xl font-bold text-[#F1DC68] font-cinzel mb-4">Frequently Asked Questions</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Find answers to the most common questions about SAGE.AI
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Search and Filter */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 bg-[#2A2A2A] text-white border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B28F4C] focus:border-transparent"
              />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors duration-300 ${
                    activeCategory === category
                      ? 'bg-[#B28F4C] text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#444] hover:text-white'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          className="max-w-4xl mx-auto bg-[#2A2A2A] rounded-lg overflow-hidden shadow-xl border border-[#444]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <motion.div 
                key={index}
                className="border-b border-[#444] last:border-b-0"
                variants={fadeIn}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#333] transition-colors duration-300"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-lg font-semibold text-[#F1DC68]">{faq.question}</span>
                  <FaChevronDown 
                    className={`text-[#B28F4C] transform transition-transform duration-300 ${openItems.includes(index) ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-[#222] text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="px-6 py-10 text-center"
              variants={fadeIn}
            >
              <p className="text-gray-400">No results found for "{searchTerm}". Please try a different search term or browse all categories.</p>
              <button
                className="mt-4 px-4 py-2 bg-[#B28F4C] text-white rounded-md hover:bg-[#9D7B3A] transition-colors duration-300"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className="max-w-4xl mx-auto mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#B28F4C] mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Our support team is here to help. Contact us directly and we'll get back to you as soon as possible.
          </p>
          <button 
            className="bg-[#B28F4C] hover:bg-[#9D7B3A] text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Support
          </button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ; 