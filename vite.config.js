import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { start } from './src/server.js'

// let port = await start()

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: `http://127.0.0.1:3000/`,
        changeOrigin: true
      }
    }
  },
  plugins: [
    svelte(),
  ]
})
