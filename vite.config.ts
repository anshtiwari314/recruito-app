import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
//import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ['5a5b-103-173-124-151.ngrok-free.app'], // Add your host here
  },
});


