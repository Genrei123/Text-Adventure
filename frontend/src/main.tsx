import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import emailjs from 'emailjs-com';
import Footer from './components/Footer';
import "./App.css";

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <div style={{ backgroundColor: '#1e1e1e' }}>
        <App />
        {[...Array(10)].map((_, i) => (
          <br key={i} />
        ))}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        </div>
        <Footer />
      </div>
      
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}