import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Enter password",
  className = "",
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
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
  );
};

export default PasswordInput; 