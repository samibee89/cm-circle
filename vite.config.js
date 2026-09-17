import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CM Circle',
        short_name: 'CM Circle',
        description: 'A shared places journal for Chiang Mai',
        theme_color: '#5b8def',
        background_color: '#ffffff',
        display: 'standalone',
        // icons: add once brand icon assets (192x192 + 512x512 PNGs) exist —
        // required for "Add to Home Screen" to work properly
      },
    }),
  ],
})
