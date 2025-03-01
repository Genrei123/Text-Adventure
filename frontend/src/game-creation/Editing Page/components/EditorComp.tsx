import type React from "react"

interface InputFieldProps {
  title: string
  description: string
  inputId: string
  value: string
  onChange: (value: string) => void
}

export const InputField: React.FC<InputFieldProps> = ({ title, description, inputId, value, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor={inputId} className="block text-lg text-gray-200 mb-1">
        {title}
      </label>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <input
        type="text"
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 text-base
          focus:outline-none focus:border-gray-600 transition-colors"
        aria-label={title}
      />
    </div>
  )
}

interface BannerPromptProps {
  value: string
  onChange: (value: string) => void
  setImageUrl: (url: string) => void
}

export const BannerPrompt: React.FC<BannerPromptProps> = ({ value, onChange, setImageUrl }) => {
  const handleInsertImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setImageUrl(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className="w-full">
      <label htmlFor="bannerPrompt" className="block text-lg text-gray-200 mb-1">
        Banner Prompt
      </label>
      <p className="text-sm text-gray-500 mb-2">Describe what you want the banner to look like.</p>
      <div className="flex gap-3">
        <input
          type="text"
          id="bannerPrompt"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 text-base
            focus:outline-none focus:border-gray-600 transition-colors"
          aria-label="Banner Prompt"
        />
        <button
          onClick={handleInsertImage}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 hover:bg-gray-700 transition-colors"
        >
          Insert Image
        </button>
      </div>
    </div>
  )
}

interface SaveButtonProps {
  onSave: () => void
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
  return (
    <button
      onClick={onSave}
      className="w-full px-4 py-2 bg-green-800 border border-gray-700 rounded text-gray-200 hover:bg-green-700 transition-colors text-lg font-medium"
    >
      Save Adventure
    </button>
  )
}