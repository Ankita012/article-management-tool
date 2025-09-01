/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Declare minimal process typing to avoid requiring @types/node
declare const process: { env?: Record<string, string | undefined> }

// Use repo name when running in GitHub Actions to set base for GitHub Pages
const repoName = process.env?.GITHUB_REPOSITORY?.split('/')?.[1]
const isCI = process.env?.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isCI && repoName ? `/${repoName}/` : '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
