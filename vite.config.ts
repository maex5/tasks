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
      }
    })
  ],
  base: '/tasks/', // This is for GitHub Pages
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
}) 