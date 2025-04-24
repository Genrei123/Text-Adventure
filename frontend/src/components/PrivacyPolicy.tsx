import React from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';

const PrivacyPolicy = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const sections = [
    {
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          details: "We collect information that you provide directly to us when you register for an account, create or modify your profile, set preferences, or make purchases through the Service. This information may include your name, email address, profile picture, and payment information."
        },
        {
          subtitle: "Usage Information",
          details: "We collect information about your usage of the Service, including the games you play, choices you make within stories, preferences, time spent on the platform, and other actions you take on our Service."
        },
        {
          subtitle: "Device Information",
          details: "We collect information about the device you use to access our Service, including the hardware model, operating system and version, unique device identifiers, and mobile network information."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Provide and Improve the Service",
          details: "We use your information to operate, maintain, enhance, and provide the features of our Service, to tailor your experience, and to improve the quality of stories and content we offer."
        },
        {
          subtitle: "Personalization",
          details: "We analyze your preferences and activity to personalize the content and experiences we offer you, including generating AI stories that match your interests and choices."
        },
        {
          subtitle: "Communications",
          details: "We may use your email address or other contact information to send you updates, newsletters, marketing communications, and responses to your inquiries."
        }
      ]
    },
    {
      title: "Information Sharing",
      content: [
        {
          subtitle: "With Your Consent",
          details: "We may share your information with third parties when you have given us your consent to do so."
        },
        {
          subtitle: "Service Providers",
          details: "We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf."
        },
        {
          subtitle: "Legal Requirements",
          details: "We may disclose your information if required to do so by law or in response to valid requests by public authorities."
        }
      ]
    },
    {
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Account Information",
          details: "You may update, correct, or delete your account information at any time by logging into your account settings."
        },
        {
          subtitle: "Marketing Communications",
          details: "You may opt out of receiving promotional communications from us by following the unsubscribe instructions included in each communication."
        },
        {
          subtitle: "Data Access and Portability",
          details: "Depending on your location, you may have the right to access personal information we hold about you and to request that we delete your personal information."
        }
      ]
    },
    {
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          details: "We take measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable and we cannot guarantee the security of our systems 100%."
        }
      ]
    },
    {
      title: "Data Retention",
      content: [
        {
          subtitle: "Duration",
          details: "We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it, or for other legitimate business purposes, including to meet our legal, regulatory, or other compliance obligations."
        }
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        {
          subtitle: "Age Restrictions",
          details: "Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information of a child under 13, we will take steps to delete such information as quickly as possible."
        }
      ]
    },
    {
      title: "Changes to This Policy",
      content: [
        {
          subtitle: "Updates",
          details: "We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice."
        }
      ]
    },
    {
      title: "Contact Us",
      content: [
        {
          subtitle: "Questions",
          details: "If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@sageai.com."
        }
      ]
    }
  ];

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
          <h1 className="text-4xl md:text-5xl font-bold text-[#F1DC68] font-cinzel mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Last Updated: June 14, 2024
          </p>
          <p className="mt-6 max-w-3xl mx-auto text-gray-300">
            At SAGE AI, we respect your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-4xl mx-auto bg-[#2A2A2A] rounded-lg p-8 shadow-xl border border-[#444]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
          }}
        >
          {sections.map((section, index) => (
            <motion.section 
              key={index} 
              className="mb-12 last:mb-0"
              variants={fadeIn}
            >
              <h2 className="text-2xl font-bold text-[#B28F4C] mb-6 pb-2 border-b border-[#444]">{section.title}</h2>
              
              {section.content.map((item, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <h3 className="text-xl font-semibold text-[#F1DC68] mb-2">{item.subtitle}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.details}</p>
                </div>
              ))}
            </motion.section>
          ))}
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-400">
            By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;