import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const dialogStyles = stylex.create({
  dialog: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '100vw',
    maxHeight: '100vh',
    padding: 0,
    margin: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: colors.popoverForeground,
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    backgroundColor: 'rgb(0 0 0 / 10%)',
    backdropFilter: 'blur(2px)',
  },
  panel: {
    position: 'relative',
    zIndex: 50,
    display: 'grid',
    width: '100%',
    maxWidth: 'calc(100% - 2rem)',
    gap: '1rem',
    borderRadius: layout.radiusXl,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    padding: '1rem',
    fontSize: '0.875rem',
    lineHeight: 1.25,
    boxShadow: `0 0 0 1px light-dark(oklch(0.145 0 0 / 10%), oklch(0.985 0 0 / 10%))`,
  },
  panelSm: {
    maxWidth: '24rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: '0.5rem',
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  },
  title: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1,
    color: colors.popoverForeground,
    margin: 0,
  },
  description: {
    fontSize: '0.875rem',
    lineHeight: 1.25,
    color: colors.mutedForeground,
    margin: 0,
  },
  close: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    zIndex: 1,
  },
})