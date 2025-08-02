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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React и связанные библиотеки
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }

          // UI библиотеки
          if (id.includes('@heroicons/react') || id.includes('react-select') || id.includes('react-hot-toast')) {
            return 'ui-vendor';
          }

          // Страницы продуктов
          if (id.includes('/pages/products/')) {
            return 'products';
          }

          // Остальные страницы
          if (id.includes('/pages/')) {
            return 'pages';
          }

          // Компоненты
          if (id.includes('/components/')) {
            return 'components';
          }

          // Остальные node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 300
  }
})
