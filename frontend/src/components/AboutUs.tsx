import React from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';
import { FaUsers, FaLightbulb, FaMagic, FaBookOpen } from 'react-icons/fa';

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const teamMembers = [
    {
      name: "Genrey Cristobal",
      role: "Project Development Lead",
      image: "/genrey.png", 
      bio: "Leads the overall development and technical direction of the SAGE.AI platform.",
    },
    {
      name: "Jhon Keneth Ryan Namias",
      role: "System Analyst and Database Administrator",
      image: "/kenn.jpg", 
      bio: "Designs and optimizes the database architecture that powers our complex narrative systems.",
    },
    {
      name: "Emannuel Pabua",
      role: "Game Director",
      image: "/eman.jpg", 
      bio: "Oversees the creative vision of our interactive storytelling experiences and gameplay mechanics.",
    },
    {
      name: "Ervhyne Dalugdog",
      role: "Business Analyst",
      image: "/Placeholder.png", 
      bio: "Analyzes user data and market trends to guide platform improvements and business strategy.",
    },
    {
      name: "Kevin Llanes",
      role: "Lead Frontend Developer",
      image: "/keb.png", 
      bio: "Architects the user interface design and oversees frontend implementation for seamless user experiences.",
    },
    {
      name: "Gian Higino Fungo",
      role: "Frontend Developer",
      image: "/gia.jpg", 
      bio: "Specializes in creating immersive and responsive UI components for the platform.",
    },
    {
      name: "Mark Relan Gercee Acedo",
      role: "Frontend Developer",
      image: "/mark.png", 
      bio: "Focuses on optimizing performance and accessibility in the user interface.",
    },
    {
      name: "Ronan Renz Valencia",
      role: "Frontend Developer",
      image: "/nan.jpg", 
      bio: "Develops robust APIs and services that power the AI storytelling engine.",
    },
    {
      name: "Garvy Ren Capalac",
      role: "Backend Developer",
      image: "/garvs.jpg", 
      bio: "Implements complex algorithms and data processing for the narrative generation system.",
    }
  ];

  const values = [
    {
      icon: <FaLightbulb className="text-4xl text-[#F1DC68] mb-4" />,
      title: "Innovation",
      description: "Continuously pushing the boundaries of AI storytelling technology."
    },
    {
      icon: <FaUsers className="text-4xl text-[#F1DC68] mb-4" />,
      title: "Community",
      description: "Creating a vibrant ecosystem of creators, storytellers, and adventurers."
    },
    {
      icon: <FaMagic className="text-4xl text-[#F1DC68] mb-4" />,
      title: "Imagination",
      description: "Believing in the limitless potential of human and artificial creativity."
    },
    {
      icon: <FaBookOpen className="text-4xl text-[#F1DC68] mb-4" />,
      title: "Accessibility",
      description: "Making powerful storytelling tools available to all, regardless of technical expertise."
    }
  ];

  return (
    <div className="bg-[#1E1E1E] text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-[50vh] bg-cover bg-center flex items-center justify-center relative"
          style={{ backgroundImage: 'url(/LandingBG2.png)' }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <motion.div 
            className="text-center relative z-10 px-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#F1DC68] font-cinzel mb-4">About SAGE AI</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 font-cinzel">
              A Project from University of Caloocan City
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Our Story Section */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-[#B28F4C] font-cinzel mb-8 text-center"
            variants={fadeIn}
          >
            Our Story
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              variants={fadeIn}
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 10, duration: 1 }}
              whileHover={{ scale: 1.08, rotate: 5, transition: { type: "spring", stiffness: 200 } }}
              whileTap={{ scale: 0.95, rotate: -5 }}
            >
              <div className="rounded-lg overflow-hidden">
                <motion.img 
                  src="/Logo.png" 
                  alt="SAGE AI Origins" 
                  className="mx-auto w-40 h-40 md:w-64 md:h-64 object-cover"
                  initial={false}
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-6"
              variants={fadeIn}
            >
              <p className="text-lg">
                SAGE AI was born from a simple question: <span className="text-[#F1DC68] font-semibold">What if stories could truly respond to your imagination?</span>
              </p>
              
              <p className="text-lg">
                Developed in 2024 as a third year project at the University of Caloocan City, we set out to create a platform where the boundaries between reader and creator blur, where every choice shapes a unique narrative journey, and where AI serves as a sage guide through limitless worlds of adventure.
              </p>
              
              <p className="text-lg">
                Our team of student developers and storytellers came together with a shared passion for interactive fiction and a vision to revolutionize how stories are experienced in the digital age.
              </p>
              
              <p className="text-lg">
                SAGE AI stands at the forefront of AI-driven interactive storytelling, offering experiences that adapt to your choices, learn from your preferences, and surprise you with unexpected twists and turns.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Our Vision Section */}
        <motion.section 
          className="mb-20 bg-[#121212] py-12 px-6 rounded-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#B28F4C] font-cinzel mb-8 text-center">Our Vision</h2>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl md:text-2xl italic text-[#F1DC68]">
              "To break the boundaries between technology and creativity, offering a platform where stories are not just read, but experienced and shaped by the user's intuition and knowledge."
            </p>
            
            <div className="mt-10 text-lg">
              <p>
                We envision a future where AI and human creativity work in harmony, where everyone can be both audience and author, and where stories evolve and grow in ways that were never before possible.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Our Values Section */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-[#B28F4C] font-cinzel mb-12 text-center"
            variants={fadeIn}
          >
            Our Values
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-[#2A2A2A] p-6 rounded-lg text-center hover:bg-[#333] transition-colors duration-300 border border-[#444]"
                variants={fadeIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                {value.icon}
                <h3 className="text-xl font-bold text-[#F1DC68] mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-[#B28F4C] font-cinzel mb-12 text-center"
            variants={fadeIn}
          >
            Meet the Team
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-[#2A2A2A] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-[#444]"
                variants={fadeIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="hover:h-48 h-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center" 
                  />
                </div>
                <div className="hover:hidden p-6">
                  <h3 className="text-xl font-bold text-[#F1DC68] mb-1">{member.name}</h3>
                  <p className="text-[#B28F4C] mb-3">{member.role}</p>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Join Us Section */}
        <motion.section 
          className="text-center py-12 px-4 bg-gradient-to-b from-[#2A1B12] to-[#463125] rounded-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#F1DC68] font-cinzel mb-6">Academic Project</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            SAGE.AI was developed as a third year project by BS Computer Science students at the University of Caloocan City. We welcome feedback and are proud to showcase this as part of our academic portfolio.
          </p>
          <button className="bg-[#B28F4C] hover:bg-[#9D7B3A] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
                  onClick={() => window.location.href = '/contact'}>
            Contact Our Team
          </button>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
