import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'

const focusRing = {
  borderColor: colors.ring,
  boxShadow:
    '0 0 0 3px light-dark(oklch(0.708 0 0 / 50%), oklch(0.556 0 0 / 50%))',
} as const

export const checkboxStyles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    width: '1rem',
    height: '1rem',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.input,
    backgroundColor: 'light-dark(transparent, oklch(1 0 0 / 5%))',
    padding: 0,
    color: colors.primaryForeground,
    cursor: 'pointer',
    outlineStyle: 'none',
    transitionProperty: 'color, background-color, border-color, box-shadow',
    transitionDuration: '150ms',
    ':focus-visible': focusRing,
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  rootChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  rootIndeterminate: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  indicator: {
    width: '0.875rem',
    height: '0.875rem',
    flexShrink: 0,
  },
})