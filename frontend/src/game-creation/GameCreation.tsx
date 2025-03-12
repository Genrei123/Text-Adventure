import React, { useState, useRef } from "react";
import axios from "../../config/axiosConfig"; // Adjust the import path
import { TextInput, NavigationButtons } from "./component/GameCreationComponents";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { RefreshCw, MoveIcon, Check } from 'lucide-react'; // Import move icon instead of crop

interface GameCreationProps {
  onBack: () => void;
  onNext: () => void;
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

export const GameCreation: React.FC<GameCreationProps> = () => {
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageRetriesLeft, setImageRetriesLeft] = useState(3);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [genreSuggestions, setGenreSuggestions] = useState<string[]>([
    "Fantasy", "Sci-Fi", "Mystery", "Horror", "Romance", "Adventure", 
    "Cyberpunk", "Post-Apocalyptic", "Historical", "Steampunk", "Western"
  ]);
  const [suggestions, setSuggestions] = useState<string>("");
  const imageContainerRef = useRef<HTMLDivElement>(null);
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
      if (step === 4) {
        // When moving from step 4 to step 5, show the banner prompt then generate preview
        setStep(5);
      } else if (step === 5) {
        // After banner prompt is entered, generate the image preview
        generateImagePreview();
      } else {
        setStep((prevStep) => Math.min(5, prevStep + 1));
        generateSuggestions();
      }
    }
  };

  const handleBack = () => {
    if (showPreview) {
      // If we're in preview mode, go back to banner prompt
      setShowPreview(false);
    } else {
      setStep((prevStep) => Math.max(1, prevStep - 1));
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const generateSuggestions = () => {
    // Generate suggestions based on current data
    if (step === 1 && formData.genre) {
      setSuggestions(`For a ${formData.genre} story, consider titles like "The Lost Realm", "Forgotten Shadows", or "Beyond the Horizon".`);
    } else if (step === 2 && formData.title) {
      setSuggestions(`For "${formData.title}", try a description that establishes the setting and main conflict. For example: "In a world where ${formData.genre.toLowerCase()} elements shape reality, our protagonist faces an unexpected challenge..."`);
    } else if (step === 3 && formData.description) {
      setSuggestions(`Based on your description, consider an ending where the protagonist either overcomes their challenge or faces a dramatic twist.`);
    } else if (step === 4 && formData.ending) {
      setSuggestions(`For a captivating banner, try describing a key scene from your story with atmospheric details like lighting and mood.`);
    } else {
      setSuggestions("");
    }
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

  const generateImagePreview = async () => {
    setIsGeneratingImage(true);
    try {
      // Generate banner image
      const imageResponse = await axios.post('/openai/generateBannerImage', {
        prompt: formData.bannerPrompt || `A banner for a ${formData.genre} story titled ${formData.title}`
      });

      setPreviewImage(`${import.meta.env.VITE_BACKEND_URL}${imageResponse.data.imageUrl}`);
      setShowPreview(true);
      setImage(imageResponse.data.imageUrl);
      // Reset image position when new image is generated
      setImagePosition({ x: 0, y: 0 });
      setIsRepositioning(false);
    } catch (error) {
      console.error('Error generating preview image:', error);
      alert('Failed to generate preview image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRerollImage = () => {
    if (imageRetriesLeft > 0) {
      setImageRetriesLeft(prev => prev - 1);
      generateImagePreview();
    }
  };

  const toggleRepositioningMode = () => {
    setIsRepositioning(!isRepositioning);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRepositioning || !imageContainerRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = imagePosition.x;
    const startPosY = imagePosition.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Update image position
      setImagePosition({
        x: startPosX + deltaX,
        y: startPosY + deltaY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const confirmRepositioning = () => {
    setIsRepositioning(false);
    // In a real implementation, you might want to save the position for later use
  };

  const handleSubmit = async () => {
    if (!previewImage) {
      alert('Please generate and accept an image first');
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would apply the positioning offset to the image
      // before submitting, or send the positioning data to the backend
      
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
        image_data: image,
        image_position: imagePosition, // Store the positioning data
        music_prompt_text: `Create ambient music for a ${formData.genre} story`,
        music_prompt_seed_image: "", // Optional
        private: false,
        UserId: getUserId()
      };

      // Add game to backend
      const addGameResponse = await axios.post('/game/add-game', gameData);

      // Navigate to editing page with game data
      alert('Game created successfully!');
    } catch (error) {
      console.error('Error submitting game:', error);
      // Handle error (show error message to user)
      alert('Failed to create game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (): StepContent => {
    const steps: StepContent[] = [
      { field: "genre", title: "WHAT IS THE GENRE OF YOUR STORY?", description: "Selecting a short, evocative genre will help generate a good adventure." },
      { field: "title", title: "WHAT IS THE TITLE OF YOUR STORY?", description: "Selecting a great, striking title will help generate a good adventure." },
      { field: "description", title: "DESCRIBE YOUR STORY", description: "Provide a brief description of the setting, plot, and characters." },
      { field: "ending", title: "HOW DOES YOUR STORY END?", description: "Describe the desired conclusion of your adventure." },
      { field: "bannerPrompt", title: "BANNER PROMPT", description: "Describe what you want the banner to look like."}
    ];
    return steps[step - 1] || { field: "genre", title: "", description: "" };
  };

  const { field, title, description, subComment } = getStepContent();

  const renderGenreSuggestions = () => {
    if (field === "genre") {
      return (
        <div className="mt-4 mb-6">
          <p className="text-gray-300 mb-2 text-sm">Suggested genres:</p>
          <div className="flex flex-wrap gap-2">
            {genreSuggestions.map((genre, index) => (
              <button
                key={index}
                onClick={() => handleChange("genre", genre)}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm transition-colors"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-inter relative overflow-hidden">
      <Navbar />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="w-full max-w-2xl mx-auto text-center">
          {!showPreview ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-cinzel text-white mb-4 tracking-wide">
                {title}
              </h1>
              <p className="text-lg text-gray-300 mb-8 font-light">
                {description}
              </p>
              {subComment && (
                <p className="text-red-400 italic mb-4">{subComment}</p>
              )}

              {renderGenreSuggestions()}

              <div className="mb-8">
                <TextInput
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={(value) => handleChange(field, value)}
                  error={errors[field]}
                />
              </div>

              {suggestions && (
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 text-sm italic">{suggestions}</p>
                </div>
              )}

              <NavigationButtons 
                onBack={handleBack} 
                onNext={handleNext}
                isLastStep={false}
                isLoading={isLoading || isGeneratingImage}
              />
            </>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-cinzel mb-4">Preview Your Banner</h2>
              <p className="text-gray-300 mb-4">
                {isRepositioning 
                  ? "Click and drag to reposition the image. Click 'Confirm Position' when done." 
                  : "Here's your banner image. You can reposition it, retry, or accept it."}
              </p>
              
              <div 
                ref={imageContainerRef}
                className="relative mb-6 bg-black rounded-md overflow-hidden h-32 sm:h-64"
                onMouseDown={handleMouseDown}
                style={{ cursor: isRepositioning ? 'move' : 'default' }}
              >
                {isGeneratingImage ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : previewImage && (
                  <div className="relative h-full w-full">
                    <img 
                      src={previewImage} 
                      alt="Banner Preview" 
                      className="absolute object-cover w-full h-full"
                      style={{ 
                        transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                        transition: isRepositioning ? 'none' : 'transform 0.2s ease-out'
                      }}
                    />
                    
                    {isRepositioning && (
                      <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white opacity-50"></div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                
                {isRepositioning ? (
                  <button
                    onClick={confirmRepositioning}
                    className="px-6 py-2 rounded bg-green-700 hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Confirm Position
                  </button>
                ) : (
                  <button
                    onClick={toggleRepositioningMode}
                    disabled={isGeneratingImage || !previewImage}
                    className="px-6 py-2 rounded bg-blue-700 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <MoveIcon size={16} />
                    Reposition Image
                  </button>
                )}
                
                <button
                  onClick={handleRerollImage}
                  disabled={isGeneratingImage || imageRetriesLeft <= 0}
                  className={`px-6 py-2 rounded transition-colors flex items-center justify-center gap-2 ${
                    imageRetriesLeft > 0 ? 'bg-blue-700 hover:bg-blue-600' : 'bg-gray-500 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw size={16} className={isGeneratingImage ? "animate-spin" : ""} />
                  Retry ({imageRetriesLeft})
                </button>
                
                {!isRepositioning && (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || isGeneratingImage}
                    className="px-6 py-2 rounded bg-green-700 hover:bg-green-600 transition-colors"
                  >
                    Accept & Continue
                  </button>
                )}
              </div>
              
              {imageRetriesLeft <= 0 && (
                <p className="text-yellow-400 text-sm mt-2">
                  You've used all your retries. You can either accept this image or go back and change your prompt.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCreation;