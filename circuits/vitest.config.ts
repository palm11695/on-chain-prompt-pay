import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    hookTimeout: 10 * 60 * 1000,
    testTimeout: 10 * 60 * 1000,
  },
})
