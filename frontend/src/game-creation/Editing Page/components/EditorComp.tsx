import React, { useState } from 'react';

interface InputFieldProps {
  title: string;
  description: string;
  inputId: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * InputField component for rendering a labeled input field with a description.
 */
export const InputField: React.FC<InputFieldProps> = ({ title, description, inputId, value, onChange }) => {
  return (
    <div className="mx-auto mb-10 w-full max-w-[1268px] text-left font-inter">
      <h2 className="mb-4 text-3xl font-semibold text-gray-200 tracking-wide">
        {title}
      </h2>
      <p className="mb-2 text-lg text-gray-400">
        {description}
      </p>
      <label htmlFor={inputId} className="sr-only">{title}</label>
      <input
        type="text"
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="box-border px-4 py-2 w-full h-12 rounded-lg bg-gray-800 border border-gray-600 text-white"
        aria-label={title}
      />
    </div>
  );
};

/**
 * Function to insert an image.
 */
const insertImage = (setImageUrl: (url: string) => void) => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        console.log(`Image URL: ${imageUrl}`);
        setImageUrl(imageUrl);
      };
      reader.readAsDataURL(file); 
    } else {
      console.log("No image selected");
    }
  };
  fileInput.click();
};

/**
 * Function to handle image insertion logic.
 */
const handleInsertImage = (setImageUrl: (url: string) => void) => {
  insertImage(setImageUrl);
};

interface BannerPromptProps {
  value: string;
  setImageUrl: (url: string) => void;
}

/**
 * BannerPrompt component for rendering a banner prompt input field with a description.
 */
export const BannerPrompt: React.FC<BannerPromptProps> = ({ value, setImageUrl }) => {
  return (
    <div className="mx-auto mb-10 w-full max-w-[1268px] text-left font-inter">
      <h2 className="mb-4 text-3xl font-semibold text-gray-200 tracking-wide">
        Banner Prompt
      </h2>
      <p className="mb-2 text-lg text-gray-400">
        Describe what you want the banner to look like.
      </p>
      <div className="flex gap-4 mx-auto mb-10 w-full max-w-[1268px]">
        <label htmlFor="bannerPrompt" className="sr-only">Banner Prompt</label>
        <input
          type="text"
          id="bannerPrompt"
          value={value}
          className="box-border flex-1 px-4 py-2 h-12 rounded-lg bg-gray-800 border border-gray-600 text-white"
          aria-label="Banner Prompt"
        />
        <button
          onClick={() => handleInsertImage(setImageUrl)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Insert Image
        </button>
      </div>
    </div>
  );
};

interface SavePreviewButtonsProps {
  onSave: () => void;
  onPreview: () => void;
}

/**
 * SavePreviewButtons component for rendering Save and Preview buttons.
 */
export const SavePreviewButtons: React.FC<SavePreviewButtonsProps> = ({ onSave, onPreview }) => {
  return (
    <div className="flex gap-4 justify-end mt-7 text-xl text-white">
      <button
        onClick={onSave}
        className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
      >
        Save
      </button>
      <button
        onClick={onPreview}
        className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Preview
      </button>
    </div>
  );
};

/**
 * PlayButton component for rendering a Play button.
 */
export const PlayButton: React.FC = () => {
  return (
    <button
      className="px-6 py-2 bg-red-600 rounded-lg text-white mt-5 hover:bg-red-700"
      onClick={() => { /* No function yet */ }}
    >
      Play
    </button>
  );
};

interface PreviewSectionProps {
  imageUrl: string;
  title: string;
  description: string;
}

/**
 * PreviewSection component for rendering a preview of the game.
 */
export const PreviewSection: React.FC<PreviewSectionProps> = ({ imageUrl, title, description }) => {
  return (
    <div
      className="mt-10 p-6 border-2 border-gray-600 rounded-lg text-white bg-gray-900 relative"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-black bg-opacity-50 p-4 rounded-lg">
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <p className="text-lg">{description}</p>
      </div>
    </div>
  );
};