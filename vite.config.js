import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the build works from any subpath (GitHub Pages, Netlify Drop)
  base: './',
  plugins: [svelte()],
})
