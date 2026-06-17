import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@foldstylex/styles': fileURLToPath(
        new URL(
          '../../packages/foldkit/src/test/stylesStub.ts',
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/vitest-setup.ts'],
  },
})