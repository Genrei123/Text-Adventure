import type React from "react"
import { useNavigate } from "react-router-dom"

interface TextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, error }) => {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="w-full px-6 py-4 bg-[#2a1810]/80 border border-[#3a2a20] rounded-lg text-white text-lg 
          focus:outline-none focus:ring-2 focus:ring-[#B39C7D] transition-colors placeholder:text-gray-400"
        aria-label={label}
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}

interface NavigationButtonsProps {
  onBack: () => void
  onNext: () => void
  isLastStep: boolean
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onBack, onNext, isLastStep }) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <button
        onClick={onBack}
        className="px-8 py-3 bg-[#2a2a2a]/80 text-white rounded-lg hover:bg-[#3a3a3a]/80 transition-colors font-medium"
      >
        Back
      </button>
      <button
        onClick={onNext}
        className="px-8 py-3 bg-[#B39C7D] text-white rounded-lg hover:bg-[#8C7A5B] transition-colors font-medium"
      >
        {isLastStep ? "Submit" : "Next"}
      </button>
    </div>
  )
}

interface SkipToEditorProps {
  onSkip: () => void
}

export const SkipToEditor: React.FC<SkipToEditorProps> = ({ onSkip }) => {
  const navigate = useNavigate()

  const handleSkip = () => {
    onSkip()
    navigate("/editing-page")
  }

  return (
    <button onClick={handleSkip} className="text-[#B39C7D] hover:text-[#C9B57B] transition-colors text-lg font-light">
      Skip to Editor
    </button>
  )
}

