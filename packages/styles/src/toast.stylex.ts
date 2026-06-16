import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const toastStyles = stylex.create({
  viewport: {
    position: 'fixed',
    zIndex: 100,
    display: 'flex',
    maxHeight: '100vh',
    width: '100%',
    flexDirection: 'column-reverse',
    padding: '1rem',
    pointerEvents: 'none',
    gap: '0.5rem',
    bottom: 0,
    right: 0,
    maxWidth: '24rem',
  },
  entry: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '0.25rem',
    overflow: 'hidden',
    borderRadius: layout.radiusLg,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: '0.75rem',
    paddingRight: '2.25rem',
    fontSize: '0.8125rem',
    lineHeight: 1.5,
    pointerEvents: 'auto',
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  entryDefault: {
    borderColor: colors.border,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
  },
  entrySuccess: {
    borderColor: 'light-dark(oklch(0.696 0.17 162.48 / 40%), oklch(0.696 0.17 162.48 / 30%))',
    backgroundColor: 'light-dark(oklch(0.982 0.018 155.826), oklch(0.393 0.095 152.535 / 20%))',
    color: 'light-dark(oklch(0.298 0.066 163.053), oklch(0.9 0.04 163))',
  },
  entryWarning: {
    borderColor: 'light-dark(oklch(0.769 0.188 70.08 / 40%), oklch(0.769 0.188 70.08 / 30%))',
    backgroundColor: 'light-dark(oklch(0.987 0.022 95.277), oklch(0.473 0.137 46.201 / 20%))',
    color: 'light-dark(oklch(0.473 0.137 46.201), oklch(0.95 0.04 95))',
  },
  entryError: {
    borderColor: 'light-dark(oklch(0.577 0.245 27.325 / 40%), oklch(0.704 0.191 22.216 / 30%))',
    backgroundColor: 'light-dark(oklch(0.971 0.013 17.38), oklch(0.577 0.245 27.325 / 20%))',
    color: 'light-dark(oklch(0.577 0.245 27.325), oklch(0.95 0.04 17))',
  },
  title: {
    fontWeight: 500,
    lineHeight: 1.5,
  },
  description: {
    fontWeight: 400,
    lineHeight: 1.4,
    opacity: 0.9,
  },
  dismiss: {
    position: 'absolute',
    top: '0.375rem',
    right: '0.375rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.radiusMd,
    padding: '0.25rem',
    color: colors.mutedForeground,
    backgroundColor: 'transparent',
    borderStyle: 'none',
    cursor: 'pointer',
    outlineStyle: 'none',
    ':hover': {
      color: colors.foreground,
    },
  },
})