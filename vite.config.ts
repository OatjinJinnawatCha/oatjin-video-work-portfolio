import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/oatjin-video-work-portfolio/',
  plugins: [react()],
})
