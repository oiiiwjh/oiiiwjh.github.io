// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  base: '/SpatialVID_ofc/', // 确保构建时资源路径正确
  build: {
    outDir: 'dist', // 默认就是dist，可以省略
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  }
})