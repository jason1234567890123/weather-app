import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Weather Heatmap PWA',
        short_name: 'WeatherPWA',
        description: 'Real-time weather and heatmap viewer',
        theme_color: '#74ebd5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png',
            sizes: '1024x1024',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
