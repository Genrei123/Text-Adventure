"use client"

import type React from "react"
import { useState } from "react"
import axios from "../../../config/axiosConfig"; // Adjust the import path
import { InputField, BannerPrompt, SaveButton } from "./components/EditorComp"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"

type AdventureEditorProps = {}

export const AdventureEditor: React.FC<AdventureEditorProps> = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const initialFormData = location.state || {}
  const [formData, setFormData] = useState({
    id: initialFormData.gameId || null,
    title: initialFormData.title || "",
    description: initialFormData.description || "",
    ending: initialFormData.ending || "",
    genre: initialFormData.genre || "",
    bannerPrompt: initialFormData.bannerPrompt || "",
    imageUrl: initialFormData.image_data || "",
  })
  const [imageUrl, setImageUrl] = useState<string>(formData.imageUrl || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateImage = async () => {
    if (!formData.bannerPrompt) {
      setError("Please provide a banner prompt")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post('/openai/generate-image', {
        prompt: formData.bannerPrompt
      });

      // Simply store the image URL returned from the backend
      setImageUrl(response.data.imageUrl);
      setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title || !formData.description || !formData.genre) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Retrieve user ID from localStorage
      const userDataString = localStorage.getItem("userData");
      const userId = userDataString ? JSON.parse(userDataString).id : null;

      // Prepare game data for update
      const gameData = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        tagline: formData.ending,
        genre: formData.genre,
        subgenre: "", // You might want to add this
        primary_color: "#FF5733", // Default or from previous data
        prompt_name: "default",
        prompt_text: `You are in a ${formData.genre} story: ${formData.description}`,
        prompt_model: "gpt-3.5-turbo",
        image_prompt_model: "dall-e-3",
        image_prompt_name: "scene",
        image_prompt_text: formData.bannerPrompt,
        image_data: imageUrl, // This is now just the URL string
        music_prompt_text: `Create ambient music for a ${formData.genre} story`,
        private: false,
        UserId: userId
      };

      // Determine whether to create or update
      let response;
      if (formData.id) {
        // Update existing game
        response = await axios.put(`/game/update-game/${formData.id}`, gameData);
      } else {
        // Create new game
        response = await axios.post('/game/add-game', gameData);
      }

      // Navigate to game details or dashboard
      navigate('/dashboard', { 
        state: { 
          message: `Adventure ${formData.title} ${formData.id ? 'updated' : 'created'} successfully!` 
        } 
      });
    } catch (err) {
      console.error('Error saving adventure:', err);
      setError('Failed to save adventure. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    {
      title: "Adventure Name",
      description: "Selecting a great, striking title will help generate a good adventure.",
      inputId: "adventureName",
      value: formData.title,
      onChange: (value: string) => handleChange("title", value),
    },
    {
      title: "Describe your Story",
      description: "Provide a brief description of the setting, plot, and characters.",
      inputId: "storyDescription",
      value: formData.description,
      onChange: (value: string) => handleChange("description", value),
    },
    {
      title: "How does your story end?",
      description: "Describe the desired conclusion of your adventure.",
      inputId: "storyEnding",
      value: formData.ending,
      onChange: (value: string) => handleChange("ending", value),
    },
    {
      title: "Genre Tags",
      description: "Selecting a short, evocative genre will help generate a good adventure.",
      inputId: "genreTags",
      value: formData.genre,
      onChange: (value: string) => handleChange("genre", value),
    },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-inter">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-cinzel text-white mb-12 tracking-wide border-b border-gray-800 pb-4">
          ADVENTURE EDITOR
        </h1>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {inputFields.map((field) => (
            <InputField
              key={field.inputId}
              title={field.title}
              description={field.description}
              inputId={field.inputId}
              value={field.value}
              onChange={field.onChange}
            />
          ))}

          <BannerPrompt
            value={formData.bannerPrompt}
            onChange={(value) => handleChange("bannerPrompt", value)}
            setImageUrl={setImageUrl}
            onGenerateImage={handleGenerateImage}
            isLoading={isLoading}
            imageUrl={imageUrl}
          />

          <SaveButton 
            onSave={handleSave} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default AdventureEditor;