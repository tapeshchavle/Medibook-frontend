import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://medibook-api-b4g2f9ewh2g7anax.centralindia-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
