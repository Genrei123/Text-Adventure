import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import ValidationMessage from './ValidationMessage';
import debounce from 'lodash/debounce';
import { ValidationUtils } from '../utils/ValidationUtils';
import { toast } from 'react-toastify';

interface EmailValidatorProps {
  email: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onAvailabilityChange: (isAvailable: boolean) => void;
  className?: string;
}

// Common email providers
const EMAIL_PROVIDERS = [
  // Major global providers
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'me.com',
  'msn.com',
  'live.com',
  'comcast.net',
  'att.net',
  'verizon.net',
  'ymail.com',
  'fastmail.com',
  'hushmail.com',
  'tutanota.com',
  'pm.me',
  'mail.ru',
  'qq.com',
  'naver.com',
  'daum.net',
  '163.com',
  '126.com',
  'sina.com',
  'rediffmail.com',
  'inbox.com',
  'rocketmail.com',
  'zoho.in',
  'proton.me',
  // Popular education and work domains (for flexibility, but not exhaustive)
  'edu.com',
  'edu.au',
  'ac.uk',
  'student.edu',
  // Add more as needed for your user base
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

  // Remove username/domain split and dropdown logic

  // Debounced async check for email availability
  const debouncedCheck = useCallback(
    debounce(async (email: string) => {
      if (!email) {
        setValidationMessage('Email is required');
        setIsValid(false);
        onAvailabilityChange(false);
        return;
      }
      const validation = ValidationUtils.email(email);
      if (!validation.isValid) {
        setValidationMessage(validation.message);
        setIsValid(false);
        onAvailabilityChange(false);
        return;
      }

      // Check provider
      const domain = email.split('@')[1];
      if (!domain || !EMAIL_PROVIDERS.includes(domain)) {
        setValidationMessage('Email provider not available');
        setIsValid(false);
        onAvailabilityChange(false);
        toast.error('Email provider not available');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
    setTouched(true);
    if (!value) {
      setValidationMessage('Email is required');
      setIsValid(false);
      onAvailabilityChange(false);
    }
  };

  const handleInputBlur = () => {
    onBlur();
  };

  return (
    <div className="relative">
      <div className="relative flex">
        <input
          type="email"
          value={email}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={`${className} w-full`}
          placeholder="username@email.com"
        />
        {/* Loading spinner */}
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