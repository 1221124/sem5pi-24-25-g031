import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*.spec.ts'], // Ensure E2E tests are included
    },
});
