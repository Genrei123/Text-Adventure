import React, { useState } from "react";
import { TextInput, NavigationButtons, SkipToEditor } from "./component/GameCreationComponents";
import { useNavigate } from 'react-router-dom';

interface GameCreationProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export const GameCreation: React.FC<GameCreationProps> = ({ onSkip }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    genre: "",
    title: "",
    description: "",
    ending: "",
    bannerPrompt: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  /**
   * Advances to the next step if the current step is valid.
   */
  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prevStep) => Math.min(5, prevStep + 1));
  };

  /**
   * Goes back to the previous step.
   */
  const handleBack = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  /**
   * Handles changes to the form fields.
   * @param field - The field being changed.
   * @param value - The new value of the field.
   */
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /**
   * Validates the current step's form fields.
   * @returns Whether the current step is valid.
   */
  const validateStep = () => {
    let newErrors: { [key: string]: string } = {};
    if (step === 1 && !formData.genre) newErrors.genre = "Genre is required.";
    if (step === 2 && !formData.title) newErrors.title = "Title is required.";
    if (step === 3 && !formData.description) newErrors.description = "Description is required.";
    if (step === 4 && !formData.ending) newErrors.ending = "Ending is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submits the form data and navigates to the editor page.
   */
  const handleSubmit = () => {
    if (!validateStep()) return;
    navigate('/editing-page', { state: formData });
  };

  /**
   * Gets the content for the current step.
   * @returns The content for the current step.
   */
  const getStepContent = () => {
    switch (step) {
      case 1:
        return { field: "genre", title: "What is the Genre of your story?", description: "Selecting a short, evocative genre will help generate a good adventure." };
      case 2:
        return { field: "title", title: "What is the Title of your story?", description: "Selecting a great, striking title will help generate a good adventure." };
      case 3:
        return { field: "description", title: "Describe Your Story", description: "Provide a brief description of the setting, plot, and characters." };
      case 4:
        return { field: "ending", title: "How Does Your Story End?", description: "Describe the desired conclusion of your adventure." };
      case 5:
        return { field: "bannerPrompt", title: "Banner Prompt", description: "Describe what you want the banner to look like.", subComment: "You can only add a customized picture in the editor page." };
      default:
        return { field: "", title: "", description: "" };
    }
  };

  const { field, title, description, subComment } = getStepContent();

  return (
    <div className="flex flex-col px-2">
      <div className="flex relative flex-col justify-center py-0.5 w-full min-h-screen max-md:max-w-full">
        <img
          loading="lazy"
          src="src/assets/wowers.jpg"
          className="object-cover absolute inset-0 size-full blur-md bg-black/90"
          alt="Background Image"
        />
        <div className="flex overflow-hidden relative gap-2.5 justify-center items-center py-23 px-5 shadow-sm max-md:py-24">
          <div className="flex relative flex-col justify-center items-start pt-12 min-h-[832px] w-full max-w-4xl max-md:min-h-[600px] max-md:pt-6">
            <h1 className="text-5xl font-bold text-stone-100 tracking-wider max-md:text-3xl" style={{ fontFamily: 'Cinzel, serif' }}>
              {title}
            </h1>
            <p className="mt-2 text-3xl font-light text-[#C9B57B] text-left max-md:text-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
              {description}
            </p>
            {step === 5 && <p className="text-xl text-red-400 mt-2 italic max-md:text-lg">{subComment}</p>}

            <TextInput
              label={title}
              value={formData[field as keyof typeof formData] || ""}
              onChange={(value) => handleChange(field, value)}
              error={errors[field]}
            />

            <NavigationButtons onBack={handleBack} onNext={step === 5 ? handleSubmit : handleNext} />
          </div>
          <SkipToEditor onSkip={onSkip} />
        </div>
      </div>
    </div>
  );
};

export default GameCreation;