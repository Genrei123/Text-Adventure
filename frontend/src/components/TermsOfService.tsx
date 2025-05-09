import React from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';

const TermsOfService = () => {
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

  const sections = [
    {
      title: "Agreement to Terms",
      content: "By accessing or using the SAGE.AI platform, website, and services (collectively, the 'Service'), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service."
    },
    {
      title: "Description of Service",
      content: "SAGE.AI provides an AI-driven interactive storytelling platform that creates personalized narrative experiences based on user input and choices. The Service may include, but is not limited to, interactive stories, character creation, world-building tools, and community features."
    },
    {
      title: "User Accounts",
      subsections: [
        {
          subtitle: "Registration",
          content: "To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete."
        },
        {
          subtitle: "Account Security",
          content: "You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. We encourage you to use 'strong' passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account."
        },
        {
          subtitle: "Account Termination",
          content: "We reserve the right to disable any user account, at any time, in our sole discretion for any or no reason, including if you have violated these Terms."
        }
      ]
    },
    {
      title: "User Content",
      subsections: [
        {
          subtitle: "Content Ownership",
          content: "The Service allows you to create, upload, publish, send, or store content ('User Content'). You retain all rights in, and are solely responsible for, the User Content you create using our Service."
        },
        {
          subtitle: "Content License",
          content: "By creating or sharing User Content on or through the Service, you grant SAGE.AI a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to host, use, distribute, modify, run, copy, publicly perform or display, translate, and create derivative works of your User Content for the purpose of operating and improving the Service."
        },
        {
          subtitle: "Content Guidelines",
          content: "You agree not to create or share User Content that: (1) infringes on the rights of others; (2) is unlawful, defamatory, obscene, offensive, or otherwise objectionable; (3) contains malware or harmful code; or (4) violates these Terms or any other SAGE.AI policies."
        }
      ]
    },
    {
      title: "Subscription and Payments",
      subsections: [
        {
          subtitle: "Subscription Options",
          content: "SAGE.AI offers both free and paid subscription tiers. Paid subscriptions provide access to premium features, content, and capabilities."
        },
        {
          subtitle: "Payment Terms",
          content: "For paid subscriptions, you agree to pay all fees or charges to your account based on the pricing and billing terms presented at the time of purchase. You must provide current, complete, and accurate billing information."
        },
        {
          subtitle: "Cancellation",
          content: "You may cancel your subscription at any time through your account settings. Upon cancellation, your subscription will remain active until the end of your current billing period."
        },
        {
          subtitle: "Refunds",
          content: "Refunds are provided at SAGE.AI's discretion and in accordance with our Refund Policy, which is incorporated into these Terms by reference."
        }
      ]
    },
    {
      title: "Intellectual Property Rights",
      subsections: [
        {
          subtitle: "SAGE.AI Content",
          content: "The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of SAGE.AI and its licensors. The Service is protected by copyright, trademark, and other laws."
        },
        {
          subtitle: "AI-Generated Content",
          content: "Content generated by our AI systems is either owned by SAGE.AI or is licensed to users in accordance with the specific terms of their subscription plan. The specific ownership and usage rights for AI-generated content are detailed in our AI Content Policy."
        }
      ]
    },
    {
      title: "Prohibited Activities",
      content: "You agree not to: (1) use the Service in any way that could disable, overburden, damage, or impair the Service; (2) use any robot, spider, or other automatic device to access the Service; (3) introduce any viruses, trojan horses, worms, or other malicious or harmful material; (4) attempt to gain unauthorized access to secured portions of the Service; (5) use the Service to generate harmful, abusive, or unethical content."
    },
    {
      title: "Limitation of Liability",
      content: "In no event shall SAGE.AI, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
    },
    {
      title: "Indemnification",
      content: "You agree to defend, indemnify, and hold harmless SAGE.AI and its licensees and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses, resulting from or arising out of your use and access of the Service."
    },
    {
      title: "Changes to Terms",
      content: "We reserve the right to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
    },
    {
      title: "Governing Law",
      content: "These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions."
    },
    {
      title: "Contact Us",
      content: "If you have any questions about these Terms, please contact us at bscs3ase@gmail.com."
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
          <h1 className="text-4xl md:text-5xl font-bold text-[#F1DC68] font-cinzel mb-4">Terms of Service</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Last Updated: April 21, 2025
          </p>
          <p className="mt-6 max-w-3xl mx-auto text-gray-300">
            Please read these Terms of Service carefully before using SAGE.AI. By accessing or using our service, you agree to be bound by these terms.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-4xl mx-auto bg-[#2A2A2A] rounded-lg p-8 shadow-xl border border-[#444]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {sections.map((section, index) => (
            <motion.section 
              key={index} 
              className="mb-12 last:mb-0"
              variants={fadeIn}
            >
              <h2 className="text-2xl font-bold text-[#B28F4C] mb-4 pb-2 border-b border-[#444]">{section.title}</h2>
              
              {section.content && !section.subsections && (
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              )}
              
              {section.subsections && (
                <div className="space-y-6">
                  {section.subsections.map((subsection, idx) => (
                    <div key={idx}>
                      <h3 className="text-xl font-semibold text-[#F1DC68] mb-2">{subsection.subtitle}</h3>
                      <p className="text-gray-300 leading-relaxed">{subsection.content}</p>
                    </div>
                  ))}
                </div>
              )}
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
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
