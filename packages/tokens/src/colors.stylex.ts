import * as stylex from '@stylexjs/stylex'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

export const colors = stylex.defineVars({
  background: lightDark('oklch(1 0 0)', 'oklch(0.145 0 0)'),
  foreground: lightDark('oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
  card: lightDark('oklch(1 0 0)', 'oklch(0.205 0 0)'),
  cardForeground: lightDark('oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
  popover: lightDark('oklch(1 0 0)', 'oklch(0.205 0 0)'),
  popoverForeground: lightDark('oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
  primary: lightDark('oklch(0.205 0 0)', 'oklch(0.922 0 0)'),
  primaryForeground: lightDark('oklch(0.985 0 0)', 'oklch(0.205 0 0)'),
  secondary: lightDark('oklch(0.97 0 0)', 'oklch(0.269 0 0)'),
  secondaryForeground: lightDark('oklch(0.205 0 0)', 'oklch(0.985 0 0)'),
  muted: lightDark('oklch(0.97 0 0)', 'oklch(0.269 0 0)'),
  mutedForeground: lightDark('oklch(0.556 0 0)', 'oklch(0.708 0 0)'),
  accent: lightDark('oklch(0.97 0 0)', 'oklch(0.269 0 0)'),
  accentForeground: lightDark('oklch(0.205 0 0)', 'oklch(0.985 0 0)'),
  destructive: lightDark('oklch(0.577 0.245 27.325)', 'oklch(0.704 0.191 22.216)'),
  border: lightDark('oklch(0.922 0 0)', 'oklch(1 0 0 / 10%)'),
  input: lightDark('oklch(0.922 0 0)', 'oklch(1 0 0 / 15%)'),
  ring: lightDark('oklch(0.708 0 0)', 'oklch(0.556 0 0)'),
  sidebar: lightDark('oklch(0.985 0 0)', 'oklch(0.205 0 0)'),
  sidebarForeground: lightDark('oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
  sidebarForegroundMuted: lightDark(
    'oklch(0.145 0 0 / 0.7)',
    'oklch(0.985 0 0 / 0.7)',
  ),
  sidebarPrimary: lightDark('oklch(0.205 0 0)', 'oklch(0.488 0.243 264.376)'),
  sidebarPrimaryForeground: lightDark('oklch(0.985 0 0)', 'oklch(0.985 0 0)'),
  sidebarAccent: lightDark('oklch(0.97 0 0)', 'oklch(0.269 0 0)'),
  sidebarAccentForeground: lightDark('oklch(0.205 0 0)', 'oklch(0.985 0 0)'),
  sidebarBorder: lightDark('oklch(0.922 0 0)', 'oklch(1 0 0 / 10%)'),
  sidebarRing: lightDark('oklch(0.708 0 0)', 'oklch(0.556 0 0)'),
})