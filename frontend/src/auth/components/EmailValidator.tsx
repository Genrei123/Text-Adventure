import React, { useState, useEffect, useCallback } from 'react';

import axiosInstance from '../../../config/axiosConfig';
import ValidationMessage from './ValidationMessage';
import debounce from 'lodash/debounce';
import { ValidationUtils } from '../utils/ValidationUtils';
import { FaChevronDown } from 'react-icons/fa';

interface EmailValidatorProps {
  email: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onAvailabilityChange: (isAvailable: boolean) => void;
  className?: string;
}

// Common email providers
const EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'zoho.com',
  'yandex.com'
];

const EmailValidator: React.FC<EmailValidatorProps> = ({
  email,
  onBlur,
  onChange,
  onAvailabilityChange,
  className = ''
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Split email into username and domain parts
  const [username, setUsername] = useState('');
  const [domain, setDomain] = useState(EMAIL_PROVIDERS[0]);
  
  // Update email when username or domain changes
  useEffect(() => {
    if (username) {
      const newEmail = `${username}@${domain}`;
      onChange(newEmail);
    }
  }, [username, domain, onChange]);
  
  // Parse email into username and domain when email prop changes from outside
  useEffect(() => {
    if (email && email.includes('@') && !touched) {
      const [localPart, domainPart] = email.split('@');
      setUsername(localPart);
      
      // If domain is in our list, select it, otherwise keep current selection
      if (domainPart && EMAIL_PROVIDERS.includes(domainPart)) {
        setDomain(domainPart);
      }
    }
  }, [email]);

  // Update the debouncedCheck function
  const debouncedCheck = useCallback(
    debounce(async (email: string) => {
      const validation = ValidationUtils.email(email);
      if (!validation.isValid) {
        setValidationMessage(validation.message);
        setIsValid(false);
        onAvailabilityChange(false);
        return;
      }

      setIsChecking(true);
      try {
        const response = await axiosInstance.post('/oauth/check-email', { email });
        const { available } = response.data;

        if (available) {
          setValidationMessage('Email is available');
          setIsValid(true);
          onAvailabilityChange(true);
        } else {
          setValidationMessage('This email is already in use. Please try logging in instead.');
          setIsValid(false);
          onAvailabilityChange(false);
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setValidationMessage('Error checking email availability');
        setIsValid(false);
        onAvailabilityChange(false);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    [onAvailabilityChange]
  );

  useEffect(() => {
    if (email && touched) {
      debouncedCheck(email);
    }
    return () => {
      debouncedCheck.cancel();
    };
  }, [email, touched, debouncedCheck]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setTouched(true);
  };
  
  const handleDomainChange = (selectedDomain: string) => {
    setDomain(selectedDomain);
    setShowDropdown(false);
    setTouched(true);
  };
  
  const handleInputBlur = () => {
    onBlur();
    // Close dropdown when input loses focus, but with a small delay
    // to allow clicking on dropdown items
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  return (
    <div className="relative">
      <div className="relative flex">
        {/* Username part of email */}
        <div className="flex-grow relative">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            onBlur={handleInputBlur}
            className={`${className} rounded-r-none border-r-0`}
            placeholder="Username"
          />
          {/* Loading spinner - moved to username field */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isChecking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#8B7355] border-t-transparent" />
            ) : touched && (
              <ValidationMessage
                message=""
                isValid={isValid}
                show={false}
                inline={true}
              />
            )}
          </div>
        </div>
        
        {/* @ symbol */}
        <div className="flex items-center justify-center bg-[#3D2E22] px-2 text-[#8B7355]">
          @
        </div>
        
        {/* Domain part with dropdown */}
        <div className="relative">
          <div 
            className={`${className} rounded-l-none flex items-center justify-between cursor-pointer min-w-[140px]`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="mr-2">{domain}</span>
            <FaChevronDown size={12} className="text-[#8B7355]" />
          </div>
          
          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-[#2A2A2A] border border-[#3D2E22] rounded max-h-60 overflow-y-auto">
              {EMAIL_PROVIDERS.map((provider) => (
                <div
                  key={provider}
                  className="px-3 py-2 hover:bg-[#3D2E22] cursor-pointer text-white text-sm"
                  onClick={() => handleDomainChange(provider)}
                >
                  {provider}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="min-h-[1.5rem]">
        {touched && !isChecking && validationMessage && (
          <ValidationMessage
            message={validationMessage}
            isValid={isValid}
            show={true}
          />
        )}
      </div>
    </div>
  );
};

export default EmailValidator;