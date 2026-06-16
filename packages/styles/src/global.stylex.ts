import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const globalStyles = stylex.create({
  root: {
    boxSizing: 'border-box',
    colorScheme: 'light dark',
    color: colors.foreground,
    fontFamily: layout.fontSans,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  bodyReset: {
    margin: 0,
  },
  mutedText: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
    lineHeight: 1.625,
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
    margin: 0,
  },
})