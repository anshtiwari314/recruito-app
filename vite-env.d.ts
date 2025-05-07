/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // aur agar tu aur bhi env vars use karega toh yahin add kar
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  