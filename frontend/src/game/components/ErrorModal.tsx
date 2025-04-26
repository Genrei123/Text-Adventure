"use client";

import React from "react";
import { motion } from "framer-motion";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  title?: string; // Optional title
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  title = "An Error Occurred", // Default title
}) => {
  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75" // Higher z-index
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-[90%] md:w-full border border-[#8E1616] shadow-xl flex flex-col items-center text-center" // Using red for error border
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Optional: Error Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#DC2626" // Red color for the icon
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-alert-triangle mb-4"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>

        <h2 className="text-xl font-bold mb-3 text-red-500 font-cinzel">{title}</h2>
        <p className="text-base text-[#E5D4B3] mb-6 whitespace-pre-wrap"> {/* Ensure newlines in errors are respected */}
           {errorMessage}
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 rounded-full font-playfair bg-[#634630] text-white hover:bg-[#311F17] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E5D4B3] focus:ring-opacity-50"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ErrorModal;