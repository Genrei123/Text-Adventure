import React, { useState, useEffect } from 'react';
import { ValidationUtils } from '../utils/ValidationUtils';
import ValidationMessage from './ValidationMessage';
import PasswordInput from './PasswordInput';
import UsernameValidator from './UsernameValidator';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface ValidatedInputProps {
  type: 'email' | 'password' | 'verifyPassword' | 'username' | 'login_password';
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  compareValue?: string; // For verify password
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  type,
  value,
  onChange,
  className = '',
  placeholder = '',
  compareValue = ''
}) => {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, message: ' ' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (touched || (type === 'password' && value)) {
      validateInput();
    }
  }, [value, compareValue, touched, type]);

  const handleBlur = () => {
    setTouched(true);
    validateInput();
  };

  const handleFocus = () => {
    // No need to handle focus for password or verifyPassword
  };

  const validateInput = () => {
    let result = { isValid: true, message: '' };

    switch (type) {
      case 'email':
        result = ValidationUtils.email(value);
        break;
      case 'password':
        result = ValidationUtils.password(value);
        break;
      case 'login_password':
        result = ValidationUtils.login_password(value);
        break;
      case 'verifyPassword':
        result = ValidationUtils.verifyPassword(compareValue, value);
        break;
      case 'username':
        // Username validation is handled by UsernameValidator component
        break;
    }

    setValidation(result);
    return result;
  };

  const handleAvailabilityChange = (isAvailable: boolean) => {
    setValidation({ 
      isValid: isAvailable, 
      message: isAvailable ? '' : `This ${type} is not available` 
    });
  };

  if (type === 'username') {
    return (
      <UsernameValidator
        username={value}
        onChange={(newValue) => onChange(newValue)}
        onBlur={handleBlur}
        onAvailabilityChange={handleAvailabilityChange}
        className={className}
      />
    );
  }

  return (
    <div className="relative min-h-[4rem]">
      <div className="relative">
        {type === 'login_password' ? (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              className={`${className} pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B7355] hover:text-[#C8A97E] focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        ) : (type === 'password' || type === 'verifyPassword') ? (
          <PasswordInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={className}
            placeholder={placeholder}
            showValidation={type === 'password'}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            className={className}
            placeholder={placeholder}
          />
        )}

        {touched && !['password', 'verifyPassword', 'login_password'].includes(type) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ValidationMessage
              message=""
              isValid={validation.isValid}
              show={false}
              inline={true}
            />
          </div>
        )}
      </div>
      
      <div className="absolute left-0 mt-1 min-h-[1.5rem]">
        {touched && validation.message && (
          <ValidationMessage
            message={validation.message}
            isValid={validation.isValid}
            show={true}
          />
        )}
      </div>
    </div>
  );
};

export default ValidatedInput; 