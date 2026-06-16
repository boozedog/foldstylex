import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

const focusRing = {
  outlineWidth: 1,
  outlineStyle: 'solid',
  outlineColor: colors.ring,
  boxShadow:
    '0 0 0 3px light-dark(oklch(0.708 0 0 / 50%), oklch(0.556 0 0 / 50%))',
} as const

export const tabsStyles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  list: {
    display: 'inline-flex',
    width: 'fit-content',
    height: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.radiusLg,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    padding: '3px',
  },
  trigger: {
    display: 'inline-flex',
    height: 'calc(100% - 1px)',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.375rem',
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    paddingInline: '0.375rem',
    paddingBlock: '0.125rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.25,
    color: 'light-dark(oklch(0.145 0 0 / 60%), oklch(0.985 0 0 / 60%))',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    outlineStyle: 'none',
    whiteSpace: 'nowrap',
    transitionProperty: 'color, background-color, box-shadow',
    transitionDuration: '150ms',
    ':hover': {
      color: colors.foreground,
    },
    ':focus-visible': focusRing,
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
  triggerActive: {
    backgroundColor: colors.background,
    color: colors.foreground,
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  },
  content: {
    flex: 1,
    fontSize: '0.875rem',
    lineHeight: 1.25,
    color: colors.foreground,
    outlineStyle: 'none',
  },
})