import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import ValidatedInput from './ValidatedInput';
import { toast } from 'react-toastify';
import UsernameValidator from './UsernameValidator';
import EmailValidator from './EmailValidator';
import TermsOfService from '../../components/TermsOfService';

interface RegisterCarouselProps {
  onSubmit: (formData: {
    username: string;
    email: string;
    password: string;
  }) => void;
}

const RegisterCarousel: React.FC<RegisterCarouselProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);

  // Add useEffect to validate on input changes
  useEffect(() => {
    if (step === 1) {
      validateStep(1);
    }
  }, [username, email]);

  useEffect(() => {
    if (step === 2) {
      validateStep(2);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (step === 3) {
      validateStep(3);
    }
  }, [acceptTerms]);

  const validateStep = (currentStep: number): boolean => {
    const errors: {[key: string]: boolean} = {};
    
    switch (currentStep) {
      case 1:
        // Check username validation
        if (!username || !usernameAvailable) {
          errors.username = true;
        } else {
          if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.username = true;
          }
        }

        // Check email validation
        if (!email || !emailAvailable) {
          errors.email = true;
        } else {
          // Since we're now using a dropdown for domain selection,
          // the email will always have a valid format with our predefined domains
          // We just need to check if the username part is not empty
          const [usernamePart] = email.split('@');
          if (!usernamePart || usernamePart.trim() === '') {
            errors.email = true;
          }
        }
        break;

      case 2:
        // Check password validation
        if (!password) {
          errors.password = true;
        } else {
          if (password.length < 8 ||
            !/(?=.*[a-z])/.test(password) ||
            !/(?=.*[A-Z])/.test(password) ||
            !/(?=.*\d)/.test(password) ||
            !/(?=.*[!@#$%^&*_\-_])/.test(password)) {
          errors.password = true;
        }
        }

        // Check confirm password
        if (!confirmPassword || confirmPassword !== password) {
          errors.confirmPassword = true;
        }
        break;

      case 3:
        if (!acceptTerms) {
          errors.terms = true;
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateStep(step);
    if (isValid) {
      setStep(step + 1);
    } else {
      // Show validation error toast
      if (step === 1) {
        if (!username || !usernameAvailable) {
          toast.error('Please enter a valid username');
        } else if (!email || !emailAvailable) {
          toast.error('Please enter a valid email address');
        }
      } else if (step === 2) {
        if (!password) {
          toast.error('Please enter a password');
        } else if (!confirmPassword) {
          toast.error('Please confirm your password');
        } else if (password !== confirmPassword) {
          toast.error('Passwords do not match');
        }
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!acceptTerms) {
      toast.error('Please accept the terms to continue');
      return;
    }

    if (validateStep(3)) {
      onSubmit({ username, email, password });
    } else {
      toast.error('Please ensure all fields are filled correctly');
    }
  };

  // Add handleBlur function
  const handleBlur = () => {
    // This can be empty or you can add specific blur handling logic
    
  };

  return (
    <div className="w-full max-w-md">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1/3 h-2 rounded ${
                i <= step ? 'bg-[#C8A97E]' : 'bg-[#3D2E22]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Username and Email */}
      {step === 1 && (
        <div className="space-y-6 fade-in">
          <div>
            <label className="block text-xl font-cinzel text-white mb-2">Choose your Alias <span className="text-[#C8A97E]">(Username)</span></label>
            <UsernameValidator
              username={username}
              onChange={(value) => {
                setUsername(value);
                setUsernameAvailable(true);
              }}
              onBlur={handleBlur}
              onAvailabilityChange={setUsernameAvailable}
              className={`w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355] ${
                formErrors.username ? 'border-red-500' : ''
              }`}
              
            />
          </div>
          {/* Add a space between the username and email fields */}
          <div className="h-4"></div>
          <div>
            <label className="block text-xl font-cinzel text-white mb-2">This will be your beacon <span className="text-[#C8A97E]">(Email)</span></label>
            <EmailValidator
              email={email}
              onChange={(value) => {
                setEmail(value);
                setEmailAvailable(true);
              }}
              onBlur={handleBlur}
              onAvailabilityChange={setEmailAvailable}
              className={`w-full px-3 py-2 bg-[#3D2E22] text-sm text-white placeholder-[#8B7355]`}
            />
          </div>
        </div>
      )}

      {/* Step 2: Password */}
      {step === 2 && (
        <div className="space-y-6 fade-in">
          <div>
            <label className="block text-sm font-cinzel text-white mb-2 text-left">Password</label>
            <ValidatedInput
              type="password"
              value={password}
              onChange={setPassword}
              className={`w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355] ${
                formErrors.password ? 'border-red-500' : ''
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-cinzel text-white mb-2 text-left">Confirm Password</label>
            <ValidatedInput
              type="verifyPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              compareValue={password}
              className={`w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355] ${
                formErrors.confirmPassword ? 'border-red-500' : ''
              }`}
            />
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-6 fade-in">
          <h3 className="text-xl font-cinzel text-white mb-4">Confirm Your Details</h3>
          <p className="text-sm text-[#C8A97E]">A verification email will be sent to the email address you provided</p>

          
          <div className="bg-[#2A2A2A] p-4 rounded">
            <div className="mb-4">
              <label className="text-sm text-[#C8A97E]">Username</label>
              <p className="text-white">{username}</p>
            </div>
            <div className="mb-4">
              <label className="text-sm text-[#C8A97E]">Email</label>
              <p className="text-white">{email}</p>
            </div>
            <div className="mb-4">
              <label className="text-sm text-[#C8A97E]">Password</label>
              <div className="flex items-center justify-center">
                <p className="text-white">{showPassword ? password : '••••••••'}</p>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-[#8B7355] hover:text-[#C8A97E]"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mr-2 bg-[#3D2E22] border-[#8B7355] rounded"
            />
            <label htmlFor="terms" className="text-sm text-[#8B7355]">
              I agree to abide by the rules of this realm
            </label>

            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C8A97E] underline hover:text-[#E0C9A6] ml-2"
            >
              Click here
            </a>

          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 bg-[#3D2E22] text-[#8B7355] rounded hover:bg-[#4D3E32]"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        )}
        
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex items-center px-4 py-2 bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded ml-auto"
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded ml-auto"
          >
            Start Your Journey
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterCarousel;