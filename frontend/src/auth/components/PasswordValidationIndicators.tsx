import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface PasswordValidationIndicatorsProps {
  password: string;
}

const ValidationItem: React.FC<{ label: string; isValid: boolean }> = ({ label, isValid }) => (
  <div className="flex items-center space-x-2">
    {isValid ? (
      <FaCheckCircle className="text-green-500" size={14} />
    ) : (
      <FaTimesCircle className="text-red-500" size={14} />
    )}
    <span className="text-sm text-[#8B7355]">{label}</span>
  </div>
);

const PasswordValidationIndicators: React.FC<PasswordValidationIndicatorsProps> = ({ password }) => {
  const validations = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
    length: password.length >= 8
  };

  return (
    <div className="absolute -right-64 top-0 w-60 bg-[#2A2A2A] p-3 rounded border border-[#3D2E22]">
      <div className="text-sm text-[#8B7355] mb-2">Password must contain:</div>
      <div className="space-y-2">
        <ValidationItem label="Uppercase letter" isValid={validations.uppercase} />
        <ValidationItem label="Lowercase letter" isValid={validations.lowercase} />
        <ValidationItem label="Number" isValid={validations.number} />
        <ValidationItem label="Special character" isValid={validations.special} />
        <ValidationItem label="8+ characters" isValid={validations.length} />
      </div>
    </div>
  );
};

export default PasswordValidationIndicators; 