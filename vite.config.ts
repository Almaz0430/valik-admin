import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@styles': '/src/styles',
      '@types': '/src/types',
    }
  }
})
