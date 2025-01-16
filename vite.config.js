import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    global: "window", // Ensures global references work
  },
  resolve: {
    alias: {
      buffer: "buffer",
    },
  },
  build: {
    target: "esnext", // Prevent polyfills from being stripped
    rollupOptions: {
      output: {
        manualChunks: undefined, // Avoid splitting too aggressively
      },
    },
  },
  
})
