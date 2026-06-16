import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'

const focusRing = {
  borderColor: colors.ring,
  boxShadow:
    '0 0 0 3px light-dark(oklch(0.708 0 0 / 50%), oklch(0.556 0 0 / 50%))',
} as const

export const switchStyles = stylex.create({
  root: {
    position: 'relative',
    display: 'inline-flex',
    width: '2rem',
    height: '1.15rem',
    flexShrink: 0,
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    backgroundColor: colors.input,
    padding: 0,
    cursor: 'pointer',
    outlineStyle: 'none',
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: '150ms',
    ':focus-visible': focusRing,
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  rootChecked: {
    backgroundColor: colors.primary,
  },
  thumb: {
    pointerEvents: 'none',
    display: 'block',
    width: '1rem',
    height: '1rem',
    borderRadius: 9999,
    backgroundColor: colors.background,
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.1)',
    transitionProperty: 'transform',
    transitionDuration: '150ms',
    transform: 'translateX(1px)',
  },
  thumbChecked: {
    transform: 'translateX(calc(100% - 2px))',
  },
})