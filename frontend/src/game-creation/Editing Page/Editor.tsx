import React, { useState } from 'react';
import { InputField, BannerPrompt, PlayButton, PreviewSection, SavePreviewButtons } from './components/EditorComp';
import { useLocation } from 'react-router-dom';

interface AdventureEditorProps {}

// AdventureEditor component
export const AdventureEditor: React.FC<AdventureEditorProps> = () => {
  const location = useLocation();
  const initialFormData = location.state || {};
  const [formData, setFormData] = useState({
    title: initialFormData.title || '',
    description: initialFormData.description || '',
    ending: initialFormData.ending || '',
    genre: initialFormData.genre || '',
    bannerPrompt: initialFormData.bannerPrompt || ''
  });
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const inputFields = [
    {
      title: 'Adventure Name',
      description: 'Selecting a great, striking title will help generate a good adventure.',
      inputId: 'adventureName',
      value: formData.title,
      onChange: (value: string) => handleChange('title', value)
    },
    {
      title: 'Describe your Story',
      description: 'Provide a brief description of the setting, plot, and characters.',
      inputId: 'storyDescription',
      value: formData.description,
      onChange: (value: string) => handleChange('description', value)
    },
    {
      title: 'How does your story ends?',
      description: 'Describe the desired conclusion of your adventure.',
      inputId: 'storyEnding',
      value: formData.ending,
      onChange: (value: string) => handleChange('ending', value)
    },
    {
      title: 'Genre Tags',
      description: 'Selecting a short, evocative genre will help generate a good adventure.',
      inputId: 'genreTags',
      value: formData.genre,
      onChange: (value: string) => handleChange('genre', value)
    },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <main className="box-border px-20 py-20 w-full min-h-screen bg-gray-900">
        <h1 className="pl-12 mb-4 text-6xl font-bold text-left text-white tracking-wide max-md:pl-2.5 max-md:mb-10 max-md:text-5xl max-sm:text-4xl max-sm:text-center">
          Adventure Editor
        </h1>
        <hr className="border-t-2 border-gray-700 w-full mx-auto max-sm:ml-0" />
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
        <BannerPrompt value={formData.bannerPrompt} setImageUrl={setImageUrl} />
        <PlayButton />
        <PreviewSection imageUrl={imageUrl} title={formData.title} description={formData.description} />
        <SavePreviewButtons onSave={() => {}} onPreview={() => {}} />
      </main>
    </>
  );
};

export default AdventureEditor;