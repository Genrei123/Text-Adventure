"use client"

import type React from "react"
import { useState } from "react"
import { InputField, BannerPrompt, SaveButton } from "./components/EditorComp"
import { useLocation } from "react-router-dom"
import Navbar from "../../components/Navbar"

type AdventureEditorProps = {}

export const AdventureEditor: React.FC<AdventureEditorProps> = () => {
  const location = useLocation()
  const initialFormData = location.state || {}
  const [formData, setFormData] = useState({
    title: initialFormData.title || "",
    description: initialFormData.description || "",
    ending: initialFormData.ending || "",
    genre: initialFormData.genre || "",
    bannerPrompt: initialFormData.bannerPrompt || "",
  })
  const [imageUrl, setImageUrl] = useState<string>("")

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Implement save functionality here
    console.log("Saving adventure:", formData)
    // You can add API calls or state management logic here
  }

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
          />

          <SaveButton onSave={handleSave} />
        </div>
      </div>
    </div>
  )
}

export default AdventureEditor

