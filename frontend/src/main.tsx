import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Footer from './components/Footer';
import emailjs from 'emailjs-com';

emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY!);

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
          <Footer />
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}