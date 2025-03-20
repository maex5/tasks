import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kids Tasks',
        short_name: 'Kids Tasks',
        description: 'Track your kids daily tasks with emoji progression',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/tasks/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/tasks/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true
      }
    })
  ],
  base: '/tasks/',
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', '@mui/material', 'framer-motion'],
          'firebase': ['firebase/app', 'firebase/database']
        }
      }
    }
  }
}) 