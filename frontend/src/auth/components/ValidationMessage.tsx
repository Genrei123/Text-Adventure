import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ValidationMessageProps {
  message: string;
  isValid: boolean;
  show: boolean;
  inline?: boolean;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ 
  message, 
  isValid, 
  show,
  inline = false
}) => {
  if (!show) return null;

  const Icon = isValid ? FaCheckCircle : FaTimesCircle;
  
  if (inline) {
    return (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Icon className={`${isValid ? 'text-green-500' : 'text-red-500'}`} size={16} />
      </div>
    );
  }

  return (
    <div className={`flex items-center mt-1 text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
      <Icon className="mr-1" size={14} />
      <span>{message}</span>
    </div>
  );
};

export default ValidationMessage; 