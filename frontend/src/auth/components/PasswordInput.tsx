import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  showValidation?: boolean;
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

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = "Enter password",
  className = "",
  disabled = false,
  showValidation = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const validations = {
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[!@#$%^&*]/.test(value),
    length: value.length >= 8
  };

  return (
    <div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`${className} pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B7355] hover:text-[#C8A97E] focus:outline-none"
          disabled={disabled}
        >
          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>

      {showValidation && (
        <div className="mt-2 space-y-1 bg-[#2A2A2A] p-3 rounded border border-[#3D2E22]">
          <div className="text-sm text-[#8B7355] mb-2">Password must contain:</div>
          <div className="grid grid-cols-2 gap-2">
            <ValidationItem label="Uppercase letter" isValid={validations.uppercase} />
            <ValidationItem label="Lowercase letter" isValid={validations.lowercase} />
            <ValidationItem label="Number" isValid={validations.number} />
            <ValidationItem label="Special character" isValid={validations.special} />
            <ValidationItem label="8+ characters" isValid={validations.length} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput; 