import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // Use the Node.js environment for testing
    globals: true, // To support global variables like describe, it, expect
  },
})
