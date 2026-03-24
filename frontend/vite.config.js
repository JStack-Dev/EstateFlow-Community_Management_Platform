import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/EstateFlow-Community_Management_Platform/', // 👈 CLAVE

  server: {
    proxy: {
      '/incidents': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})