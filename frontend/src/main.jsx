import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Footer from './components/Footer.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ backgroundColor: '#1e1e1e' }}>
      <App />
      {[...Array(10)].map((_, i) => (
        <br key={i} />
      ))}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Footer />
      </div>
    </div>
  </StrictMode>,
)
