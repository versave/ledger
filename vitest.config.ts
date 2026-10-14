import { defineConfig } from 'vitest/config';

// Standalone config (no app/api plugins) so tests don't boot PGlite or the dev server.
export default defineConfig({
    test: {
        environment: 'node',
        include: ['server/**/*.test.ts', 'shared/**/*.test.ts', 'src/**/*.test.{ts,tsx}'],
    },
});
