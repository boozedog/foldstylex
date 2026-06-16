import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'

export const badgeStyles = stylex.create({
  base: {
    display: 'inline-flex',
    width: 'fit-content',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    overflow: 'hidden',
    height: '1.25rem',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    paddingInline: '0.5rem',
    paddingBlock: '0.125rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    transitionProperty: 'color, background-color, border-color',
    transitionDuration: '150ms',
  },
  variantDefault: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  variantSecondary: {
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
  },
  variantDestructive: {
    backgroundColor: 'light-dark(oklch(0.577 0.245 27.325 / 10%), oklch(0.704 0.191 22.216 / 20%))',
    color: colors.destructive,
  },
  variantOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    color: colors.foreground,
  },
})