import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const appMenuStyles = stylex.create({
  host: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    pointerEvents: 'none',
  },
  hostInteractive: {
    pointerEvents: 'auto',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgb(0 0 0 / 0.25)',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
  },
  backdropVisible: {
    opacity: 1,
  },
  panel: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    display: 'flex',
    width: layout.sidebarWidthMobile,
    flexDirection: 'column',
    backgroundColor: colors.sidebar,
    color: colors.sidebarForeground,
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    transitionProperty: 'transform',
    transitionDuration: '300ms',
    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
    willChange: 'transform',
  },
  panelStart: {
    left: 0,
    transform: 'translateX(-100%)',
  },
  panelEnd: {
    right: 0,
    transform: 'translateX(100%)',
  },
  panelOpen: {
    transform: 'translateX(0)',
  },
  panelHeader: {
    display: 'flex',
    height: '3rem',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    paddingInline: '1rem',
  },
  closeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: layout.radiusMd,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    outlineStyle: 'none',
    ':hover': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
    },
  },
  panelBody: {
    display: 'flex',
    minHeight: 0,
    flex: 1,
    flexDirection: 'column',
    overflowY: 'auto',
  },
  contentLocked: {
    overflow: 'hidden',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  mobileOnly: {
    '@media (min-width: 768px)': {
      display: 'none',
    },
  },
})