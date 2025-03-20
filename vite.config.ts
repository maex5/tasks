import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
    },
    define: {
      __VUE_PROD_DEVTOOLS__: false,
      'import.meta.env': JSON.stringify({
        VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY,
        VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN,
        VITE_FIREBASE_DATABASE_URL: env.VITE_FIREBASE_DATABASE_URL,
        VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
        MODE: env.MODE,
        DEV: mode === 'development',
        PROD: mode === 'production',
        SSR: false
      })
    }
  }
}) 