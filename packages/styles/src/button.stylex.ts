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
  variantSecondary: {
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
    ':hover': {
      opacity: 0.9,
    },
  },
  variantDestructive: {
    backgroundColor: 'light-dark(oklch(0.577 0.245 27.325 / 10%), oklch(0.704 0.191 22.216 / 20%))',
    color: colors.destructive,
    ':hover': {
      backgroundColor: 'light-dark(oklch(0.577 0.245 27.325 / 20%), oklch(0.704 0.191 22.216 / 30%))',
    },
    ':focus-visible': {
      outlineColor: colors.destructive,
    },
  },
  variantLink: {
    backgroundColor: 'transparent',
    color: colors.primary,
    height: 'auto',
    paddingInline: 0,
    paddingBlock: 0,
    ':hover': {
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
    },
  },
  sizeDefault: {
    height: '2rem',
    paddingInline: '0.625rem',
    paddingBlock: '0.5rem',
  },
  sizeSm: {
    height: '1.75rem',
    paddingInline: '0.625rem',
    gap: '0.25rem',
    fontSize: '0.8125rem',
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