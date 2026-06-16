import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const inputStyles = stylex.create({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    width: '100%',
    maxWidth: '20rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1,
    color: colors.foreground,
    userSelect: 'none',
  },
  input: {
    display: 'flex',
    width: '100%',
    minWidth: 0,
    height: '2rem',
    borderRadius: layout.radiusLg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'light-dark(transparent, oklch(1 0 0 / 5%))',
    paddingInline: '0.625rem',
    paddingBlock: '0.25rem',
    fontSize: '0.875rem',
    lineHeight: 1.25,
    color: colors.foreground,
    outlineStyle: 'none',
    transitionProperty: 'color, background-color, border-color, box-shadow',
    transitionDuration: '150ms',
    '::placeholder': {
      color: colors.mutedForeground,
    },
    ':focus-visible': {
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px light-dark(oklch(0.708 0 0 / 50%), oklch(0.556 0 0 / 50%))`,
    },
    ':disabled': {
      pointerEvents: 'none',
      cursor: 'not-allowed',
      opacity: 0.5,
      backgroundColor: 'light-dark(transparent, oklch(1 0 0 / 5%))',
    },
  },
  description: {
    fontSize: '0.875rem',
    lineHeight: 1.25,
    color: colors.mutedForeground,
  },
})