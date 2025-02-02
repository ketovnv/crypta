import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@stores': '/src/stores'
    }
  },
  server: {
    port: 3000  // или любой другой свободный порт
  }
})
