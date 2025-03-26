import React, { useState, useRef, useEffect } from "react";
import axios from "../../config/axiosConfig";
import { TextInput, NavigationButtons } from "./component/GameCreationComponents";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { RefreshCw, MoveIcon, Check } from 'lucide-react';
import LoadingScreen from "../components/LoadingScreen";

// Replace these with your actual image file paths
const TORCH_UNLIT_IMAGE = "/path/to/unlit-torch.png"; // Placeholder for unlit torch image
const TORCH_LIT_IMAGE = "/path/to/lit-torch.png";   // Placeholder for lit torch image

interface GameCreationProps {
  onBack: () => void;
  onNext: () => void;
}

interface FormData {
  genres: string[];
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
    genres: [],
    title: "",
    description: "",
    ending: "",
    bannerPrompt: ""
  });
  const [mainGenre, setMainGenre] = useState<string | null>(null);
  const [customGenre, setCustomGenre] = useState<string>("");
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
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingFadeIn, setLoadingFadeIn] = useState(true);
  const [loadingFadeOut, setLoadingFadeOut] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getUserId = () => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData.id;
    }
    return null;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 4) {
        setStep(5);
      } else if (step === 5) {
        generateImagePreview();
      } else {
        setStep((prevStep) => Math.min(5, prevStep + 1));
        generateSuggestions();
      }
    }
  };

  const handleBack = () => {
    if (showPreview) {
      setShowPreview(false);
    } else {
      setStep((prevStep) => Math.max(1, prevStep - 1));
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "genres") {
      setFormData((prev) => {
        const currentGenres = prev.genres;
        if (currentGenres.includes(value)) {
          // If genre is being deselected
          const newGenres = currentGenres.filter((g) => g !== value);
          if (value === mainGenre) {
            setMainGenre(newGenres.length > 0 ? newGenres[0] : null);
          }
          return {
            ...prev,
            genres: newGenres,
          };
        } else if (currentGenres.length < 3) {
          // If adding a new genre
          if (!mainGenre) {
            setMainGenre(value);
          }
          return {
            ...prev,
            genres: [...currentGenres, value],
          };
        }
        return prev;
      });
      setErrors((prev) => ({ ...prev, genres: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCustomGenreChange = (value: string) => {
    setCustomGenre(value);
  };

  const handleCustomGenreSubmit = () => {
    if (customGenre.trim() && !formData.genres.includes(customGenre.trim())) {
      handleChange("genres", customGenre.trim());
      setCustomGenre(""); // Clear the input after adding
    }
  };
  
  const generateSuggestions = () => {
    if (step === 1 && formData.genres.length > 0) {
      setSuggestions(`For a ${formData.genres.join(", ")} story (main genre: ${mainGenre}), consider titles like "The Lost Realm", "Forgotten Shadows", or "Beyond the Horizon".`);
    } else if (step === 2 && formData.title) {
      setSuggestions(`For "${formData.title}", try a description that establishes the setting and main conflict. For example: "In a world where ${formData.genres.join(", ").toLowerCase()} elements shape reality, our protagonist faces an unexpected challenge..."`);
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
    if (currentField === "genres") {
      if (formData.genres.length === 0) {
        newErrors[currentField] = "At least one genre is required.";
      }
    } else if (!formData[currentField]) {
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
    setShowLoadingScreen(true);
    setLoadingFadeIn(true);
    
    setTimeout(() => {
      setLoadingFadeIn(false);
    }, 500);
    
    setIsGeneratingImage(true);
    try {
      const imageResponse = await axios.post('/openai/generateBannerImage', {
        prompt: formData.bannerPrompt || `A banner for a ${formData.genres.join(", ")} story (main genre: ${mainGenre}) titled ${formData.title}`
      });

      setPreviewImage(`${import.meta.env.VITE_BACKEND_URL}${imageResponse.data.imageUrl}`);
      setImage(imageResponse.data.imageUrl);
      setImagePosition({ x: 0, y: 0 });
      setIsRepositioning(false);
      
      setLoadingFadeOut(true);
      
      setTimeout(() => {
        setShowLoadingScreen(false);
        setLoadingFadeOut(false);
        setShowPreview(true);
      }, 500);
      
    } catch (error) {
      console.error('Error generating preview image:', error);
      alert('Failed to generate preview image. Please try again.');
      
      setLoadingFadeOut(true);
      setTimeout(() => {
        setShowLoadingScreen(false);
        setLoadingFadeOut(false);
      }, 500);
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
  };

  const handleSubmit = async () => {
    if (!previewImage) {
      alert('Please generate and accept an image first');
      return;
    }

    setIsLoading(true);
    try {
      const orderedGenres = mainGenre 
        ? [mainGenre, ...formData.genres.filter(g => g !== mainGenre)]
        : formData.genres;

      const gameData = {
        title: formData.title,
        slug: generateSlug(formData.title),
        description: formData.description,
        tagline: formData.ending,
        genre: mainGenre || formData.genres[0] || "",
        subgenres: orderedGenres.slice(1).join(","),
        primary_color: "#FF5733",
        prompt_name: "default",
        prompt_text: `You are in a story combining ${formData.genres.join(", ")} elements (main genre: ${mainGenre}): ${formData.description}`,
        prompt_model: "gpt-3.5-turbo",
        image_prompt_model: "dall-e-3",
        image_prompt_name: "scene",
        image_prompt_text: formData.bannerPrompt || `A banner for a story combining ${formData.genres.join(", ")} elements (main genre: ${mainGenre})`,
        image_data: image,
        image_position: imagePosition,
        music_prompt_text: `Create ambient music for a story combining ${formData.genres.join(", ")} elements (main genre: ${mainGenre})`,
        music_prompt_seed_image: "",
        private: false,
        UserId: getUserId()
      };

      const addGameResponse = await axios.post('/game/add-game', gameData);
      alert('Game created successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error submitting game:', error);
      alert('Failed to create game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (): StepContent => {
    const steps: StepContent[] = [
      { field: "genres", title: "WHAT ARE THE GENRES OF YOUR STORY?", description: "Type your custom genres or select up to 3 from suggestions below. The first genre you add will be the main genre." },
      { field: "title", title: "WHAT IS THE TITLE OF YOUR STORY?", description: "Selecting a great, striking title will help generate a good adventure." },
      { field: "description", title: "DESCRIBE YOUR STORY", description: "Provide a brief description of the setting, plot, and characters." },
      { field: "ending", title: "HOW DOES YOUR STORY END?", description: "Describe the desired conclusion of your adventure." },
      { field: "bannerPrompt", title: "BANNER PROMPT", description: "Describe what you want the banner to look like."}
    ];
    return steps[step - 1] || { field: "genres", title: "", description: "" };
  };

  const { field, title, description, subComment } = getStepContent();

  const renderGenreSuggestions = () => {
    if (field === "genres") {
      // Combine predefined suggestions with custom genres not in suggestions
      const allGenres = [
        ...genreSuggestions,
        ...formData.genres.filter((genre) => !genreSuggestions.includes(genre)),
      ];
  
      return (
        <div className="mt-4 mb-6">
          <div className="mb-4 flex items-end gap-2">
            <div className="flex-1">
              <TextInput
                label="Enter your Genre"
                value={customGenre}
                onChange={handleCustomGenreChange}
                error={errors.genres}
              />
            </div>
            <button
              onClick={handleCustomGenreSubmit}
              disabled={!customGenre.trim() || formData.genres.length >= 3}
              className={`px-4 py-4 rounded transition-colors ${
                !customGenre.trim() || formData.genres.length >= 3
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#B28F4C] hover:bg-[#9F7A42]'
              }`}
            >
              Add Genre
            </button>
          </div>
          <p className="text-gray-300 mb-2 text-sm">
            Select up to 3 genres (first selected is main genre):
            {formData.genres.length > 0 && (
              <span className="ml-2 text-[#B28F4C]">
                Selected: {formData.genres.join(", ")}{" "}
                {mainGenre && `(Main: ${mainGenre})`}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre, index) => (
              <button
                key={index}
                onClick={() => handleChange("genres", genre)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  formData.genres.includes(genre)
                    ? genre === mainGenre
                      ? "bg-[#B28F4C] hover:bg-[#9F7A42]" // Main genre: Golden Brown
                      : "bg-[#634630] hover:bg-[#4F3726]" // Selected genre: Brown
                    : "bg-gray-700 hover:bg-gray-600" // Unselected genre
                }`}
                disabled={
                  !formData.genres.includes(genre) && formData.genres.length >= 3
                }
              >
                {genre}
              </button>
            ))}
          </div>
          {formData.genres.length === 3 && (
            <p className="text-yellow-400 text-sm mt-2">
              Maximum of 3 genres selected. Deselect one to choose another.
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-inter relative overflow-hidden">
      <Navbar />
      {showLoadingScreen && (
        <LoadingScreen fadeIn={loadingFadeIn} fadeOut={loadingFadeOut} />
      )}
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

              {field !== "genres" && (
                <div className="mb-8"> 
                  <TextInput
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field] as string}
                    onChange={(value) => handleChange(field, value)}
                    error={errors[field]}
                  />
                </div>
              )}

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