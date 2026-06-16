import { defineConfig } from 'vite'

import { foldkit } from '@foldkit/vite-plugin'
import stylex from '@stylexjs/unplugin'
import { Features } from 'lightningcss'

import { demoAliases } from './vite.aliases'

export default defineConfig({
  plugins: [
    stylex.vite({
      lightningcssOptions: {
        exclude: Features.LightDark,
      },
    }),
    foldkit({ devToolsMcpPort: 9991 }),
  ],
  resolve: {
    alias: demoAliases(__dirname),
  },
})