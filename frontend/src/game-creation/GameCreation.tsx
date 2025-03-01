import React, { useState } from "react";
import { TextInput, NavigationButtons, SkipToEditor } from "./component/GameCreationComponents";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

interface GameCreationProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

interface FormData {
  genre: string;
  title: string;
  description: string;
  ending: string;
  bannerPrompt: string;
}

interface StepContent {
  field: keyof FormData;
  title: string;
  description: string;
  subComment?: string;
}

export const GameCreation: React.FC<GameCreationProps> = ({ onBack, onNext, onSkip }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    genre: "",
    title: "",
    description: "",
    ending: "",
    bannerPrompt: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const navigate = useNavigate();

  const handleNext = () => {
    if (validateStep()) {
      setStep((prevStep) => Math.min(5, prevStep + 1));
    }
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const currentField = getStepContent().field;
    if (!formData[currentField]) {
      newErrors[currentField] = `${currentField.charAt(0).toUpperCase() + currentField.slice(1)} is required.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      navigate('/editing-page', { state: formData });
    }
  };

  const getStepContent = (): StepContent => {
    const steps: StepContent[] = [
      { field: "genre", title: "WHAT IS THE GENRE OF YOUR STORY?", description: "Selecting a short, evocative genre will help generate a good adventure." },
      { field: "title", title: "WHAT IS THE TITLE OF YOUR STORY?", description: "Selecting a great, striking title will help generate a good adventure." },
      { field: "description", title: "DESCRIBE YOUR STORY", description: "Provide a brief description of the setting, plot, and characters." },
      { field: "ending", title: "HOW DOES YOUR STORY END?", description: "Describe the desired conclusion of your adventure." },
      { field: "bannerPrompt", title: "BANNER PROMPT", description: "Describe what you want the banner to look like.", subComment: "You can only add a customized picture in the editor page." }
    ];
    return steps[step - 1] || { field: "genre", title: "", description: "" };
  };

  const { field, title, description, subComment } = getStepContent();

  return (
    
    <div className="min-h-screen bg-[#1a1a1a] text-white font-inter relative overflow-hidden">
      <Navbar />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-cinzel text-white mb-4 tracking-wide">
            {title}
          </h1>
          <p className="text-lg text-gray-300 mb-8 font-light">
            {description}
          </p>
          {subComment && (
            <p className="text-red-400 italic mb-4">{subComment}</p>
          )}

          <div className="mb-8">
            <TextInput
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={(value) => handleChange(field, value)}
              error={errors[field]}
            />
          </div>

          <NavigationButtons 
            onBack={handleBack} 
            onNext={step === 5 ? handleSubmit : handleNext}
            isLastStep={step === 5}
          />

          <div className="mt-8">
            <SkipToEditor onSkip={onSkip} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCreation;
