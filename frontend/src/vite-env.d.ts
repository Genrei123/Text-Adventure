/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_EMAILJS_PUBLIC_KEY: string
    // Add other env variables here if you need them
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }