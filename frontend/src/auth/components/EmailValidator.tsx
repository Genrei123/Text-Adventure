import React, { useState, useEffect, useCallback } from 'react';

import axiosInstance from '../../../config/axiosConfig';
import ValidationMessage from './ValidationMessage';
import debounce from 'lodash/debounce';
import { ValidationUtils } from '../utils/ValidationUtils';

interface EmailValidatorProps {
  email: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onAvailabilityChange: (isAvailable: boolean) => void;
  className?: string;
}

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
        const response = await axiosInstance.post('/auth/check-email', { email });
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
    onChange(e.target.value);
    setTouched(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={handleInputChange}
          onBlur={onBlur}
          className={className}
          placeholder="Where to send your quest updates"
        />
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