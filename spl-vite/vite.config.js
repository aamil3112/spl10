import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure Netlify is publishing from the correct folder
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
})
