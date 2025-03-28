import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-[#463125] min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-[#a07155]">About SAGE AI</h1>
      <div className="prose max-w-2xl">
        <p className="mb-4">
          SAGE AI is a pioneering platform that reimagines storytelling through advanced artificial intelligence. 
          Our mission is to create immersive, personalized narrative experiences that adapt to each user's unique imagination and choices.
        </p>
        <p className="mb-4">
          Founded in 2024, SAGE AI combines cutting-edge AI technology with the art of storytelling, 
          providing users with interactive, dynamic narratives that evolve in real-time.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Vision</h2>
        <p>
          To break the boundaries between technology and creativity, offering a platform 
          where stories are not just read, but experienced and shaped by the user's intuition and knowledge.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;