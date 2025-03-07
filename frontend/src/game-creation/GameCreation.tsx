import React, { useState } from "react";
import axios from "../../config/axiosConfig"; // Adjust the import path
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve user data from localStorage
  const getUserId = () => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData.id; // Assuming the user object has an 'id' field
    }
    return null;
  };

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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      setIsLoading(true);
      try {
        // Generate banner image
        const imageResponse = await axios.post('/openai/generate-image', {
          prompt: formData.bannerPrompt || `A banner for a ${formData.genre} story titled ${formData.title}`
        });

        // Prepare game data
        const gameData = {
          title: formData.title,
          slug: generateSlug(formData.title),
          description: formData.description,
          tagline: formData.ending,
          genre: formData.genre,
          subgenre: "", // You might want to add a field for this
          primary_color: "#FF5733", // Default color, could be customizable
          prompt_name: "default",
          prompt_text: `You are in a ${formData.genre} story: ${formData.description}`,
          prompt_model: "gpt-3.5-turbo",
          image_prompt_model: "dall-e-3",
          image_prompt_name: "scene",
          image_prompt_text: formData.bannerPrompt || `A banner for a ${formData.genre} story`,
          image_data: imageResponse.data.imageUrl,
          music_prompt_text: `Create ambient music for a ${formData.genre} story`,
          music_prompt_seed_image: "", // Optional
          private: false,
          UserId: getUserId()
        };

        // Add game to backend
        const addGameResponse = await axios.post('/game/add-game', gameData);

        // Navigate to editing page with game data
        navigate('/editing-page', { 
          state: { 
            ...gameData, 
            gameId: addGameResponse.data.id 
          } 
        });
      } catch (error) {
        console.error('Error submitting game:', error);
        // Handle error (show error message to user)
        alert('Failed to create game. Please try again.');
      } finally {
        setIsLoading(false);
      }
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
            isLoading={isLoading}
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