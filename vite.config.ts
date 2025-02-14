import { defineConfig } from 'vitest/config';

const reporters = process.env['GITHUB_ACTIONS'] ? [ 'verbose', 'github-actions' ] : ['verbose']

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    include: ['tests/**/*.test.ts'],
    reporters
  },
});
