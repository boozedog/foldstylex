import path from 'path'

/** Vite resolve aliases for local foldstylex packages and optional foldkit source. */
export const demoAliases = (dirname: string) => ({
  '@foldstylex/tokens': path.resolve(dirname, '../../packages/tokens/src'),
  '@foldstylex/styles': path.resolve(dirname, '../../packages/styles/src'),
  '@foldstylex/foldkit': path.resolve(dirname, '../../packages/foldkit/src'),
})