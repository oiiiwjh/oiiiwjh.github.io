// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 将 base 放到顶层，它会同时应用于开发服务器和构建输出
  base: '/SpatialVID_ofc/',
  server: {
    // 这里就不需要 base 了，因为它已经被顶层的 base 覆盖
    host: true,
    port: 3000
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  }
})