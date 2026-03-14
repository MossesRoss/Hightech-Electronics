import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Absolute control over the build pipeline
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
})