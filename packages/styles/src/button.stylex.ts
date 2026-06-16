import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const buttonStyles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    flexShrink: 0,
    borderStyle: 'none',
    borderRadius: layout.radiusMd,
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.25,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    outlineStyle: 'none',
    transitionProperty: 'color, background-color, border-color, box-shadow',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease',
    ':focus-visible': {
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: colors.ring,
      outlineOffset: 2,
    },
    ':disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },
  variantDefault: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    ':hover': {
      opacity: 0.9,
    },
  },
  variantGhost: {
    backgroundColor: 'transparent',
    color: colors.foreground,
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  variantOutline: {
    backgroundColor: colors.background,
    color: colors.foreground,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  sizeDefault: {
    height: '2.25rem',
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
  },
  sizeSm: {
    height: '2rem',
    paddingInline: '0.75rem',
    gap: '0.375rem',
    fontSize: '0.875rem',
  },
  sizeIcon: {
    height: '2.25rem',
    width: '2.25rem',
    padding: 0,
  },
  sizeIconSm: {
    height: '1.75rem',
    width: '1.75rem',
    padding: 0,
  },
})