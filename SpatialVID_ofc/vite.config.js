import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    base: '/SpatialVID_ofc/',
    host: true,
    port: 3000
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  }
})