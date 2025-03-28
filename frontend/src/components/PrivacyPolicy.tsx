import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-[#463125] min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-[#a07155]">Privacy Policy</h1>
      <div className="prose max-w-2xl">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p>
            At SAGE AI, we are committed to protecting your privacy. We collect minimal 
            personal information necessary to provide and improve our services.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p>
            We use collected information to provide, maintain, and improve our services, 
            to communicate with you, and to ensure the security of our platform.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
          <p>
            We implement appropriate technical and organizational measures to protect 
            your personal data against unauthorized or unlawful processing, accidental loss, 
            destruction, or damage.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;