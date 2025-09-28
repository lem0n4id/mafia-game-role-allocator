import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer for performance monitoring
    visualizer({ 
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  server: {
    host: '0.0.0.0', // Network access for mobile testing
    port: 5173,
    https: false, // Enable for PWA testing if needed
  },
  build: {
    target: ['es2022', 'chrome90', 'safari14'],
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Performance budgets - warning at 400KB, error would be at 500KB
    chunkSizeWarningLimit: 400,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
})
