import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import ValidationMessage from './ValidationMessage';
import debounce from 'lodash/debounce';

interface UsernameValidatorProps {
  username: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onAvailabilityChange: (isAvailable: boolean) => void;
  className?: string;
}

const UsernameValidator: React.FC<UsernameValidatorProps> = ({
  username,
  onBlur,
  onChange,
  onAvailabilityChange,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);

  // Debounced username check
  const debouncedCheck = useCallback(
    debounce(async (username: string) => {
      if (username.length < 3) {
        setValidationMessage('Username must be at least 3 characters long');
        setIsValid(false);
        setSuggestions([]);
        return;
      }
      if (!/^[a-zA-Z0-9_. ]+$/.test(username)) {
        setValidationMessage('Username must contain only letters, numbers, periods, underscores');
        setIsValid(false);
        setSuggestions([]);
        return;
      }
      if (username.includes(' ')) {
        setValidationMessage('Username cannot contain spaces');
        setIsValid(false);
        setSuggestions([]);
        return;
      }
      if (!username) {
        setValidationMessage('Username is required');
        setIsValid(false);
        setSuggestions([]);
        return;
      }

      setIsChecking(true);
      try {
        const response = await axiosInstance.post('/auth/check-username', { username });
        const { available, suggestions: serverSuggestions } = response.data;

        if (available) {
          setValidationMessage('Username is available');
          setIsValid(true);
          setSuggestions([]);
          onAvailabilityChange(true);
        } else {
          setValidationMessage('Username is already taken');
          setIsValid(false);
          setSuggestions(serverSuggestions || []);
          onAvailabilityChange(false);
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setValidationMessage('Error checking username availability');
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    [onAvailabilityChange]
  );

  useEffect(() => {
    if (username && touched) {
      debouncedCheck(username);
    }
    return () => {
      debouncedCheck.cancel();
    };
  }, [username, touched]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setTouched(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={handleInputChange}
          onBlur={onBlur}
          className={className}
          placeholder="The name whispered in legends"
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
      
      <div className="min-h-[4rem]"> {/* Fixed height container for messages */}
        {touched && !isChecking && (
          <ValidationMessage
            message={validationMessage}
            isValid={isValid}
            show={true}
          />
        )}
        
        {suggestions.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-[#8B7355]">Try these available usernames:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onChange(suggestion)}
                  className="px-2 py-1 text-sm bg-[#3D2E22] text-[#C8A97E] rounded hover:bg-[#4D3E32]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsernameValidator; 