import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, error }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor="input-field" className="self-start mt-4 text-2xl leading-10 text-white tracking-[2.4px] max-md:text-xl">
        {label}
      </label>
      <input
        type="text"
        id="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex shrink-0 max-w-full shadow-lg bg-stone-800 h-[78px] rounded-full w-[911px] text-[#FFFFFF] text-3xl pl-7 max-md:h-[50px] max-md:w-full max-md:text-xl max-md:pl-4
          ${error ? 'border-2 border-red-500' : ''}`}
        aria-label={label}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onBack, onNext }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-between mt-7 text-2xl text-white tracking-[2.4px] max-md:max-w-full">
      <button
        onClick={onBack}
        className="px-10 py-1.5 leading-10 whitespace-nowrap bg-[linear-gradient(86deg,#929292_-74.83%,#2C2C2C_37.96%)] rounded-lg max-md:px-5 max-md:py-1 max-md:text-xl"
      >
        Back
      </button>
      <button
        onClick={onNext}
        className="px-10 py-1.5 leading-loose bg-[#B28F4C] rounded-lg max-md:px-5 max-md:py-1 max-md:text-xl"
      >
        Next
      </button>
    </div>
  );
};

interface SkipToEditorProps {
  onSkip: () => void;
}

export const SkipToEditor: React.FC<SkipToEditorProps> = ({ onSkip }) => {
  const navigate = useNavigate();

  const handleSkip = () => {
    onSkip();
    navigate('/editingpage');
  };

  return (
    <button
      onClick={handleSkip}
      className="absolute z-0 text-3xl font-light leading-none text-white bottom-[77px] h-[37px] left-1/2 transform -translate-x-1/2 w-[200px] rounded-full text-center max-md:text-xl max-md:h-[30px] max-md:w-[150px]"
    >
      Skip to Editor
    </button>
  );
};