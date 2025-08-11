import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // This will be your Heroku backend URL in production
        changeOrigin: true,
        rewrite: (path ) => path.replace(/^\/api/, '')
      }
    }
  }
})
