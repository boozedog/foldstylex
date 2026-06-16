import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const dropdownMenuStyles = stylex.create({
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
    width: '100%',
    minWidth: 0,
  },
  wrapperAction: {
    position: 'absolute',
    inset: 0,
    width: 'auto',
    height: 'auto',
    pointerEvents: 'none',
    zIndex: 1,
  },
  content: {
    zIndex: 50,
    minWidth: '8rem',
    overflowX: 'hidden',
    overflowY: 'auto',
    borderRadius: layout.radiusLg,
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    padding: '0.25rem',
    boxShadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 1px ${colors.border}`,
    outlineStyle: 'none',
    fontFamily: layout.fontSans,
    fontSize: '0.875rem',
    lineHeight: 1.25,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  contentWide: {
    minWidth: '14rem',
  },

  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 40,
  },
  item: {
    position: 'relative',
    display: 'flex',
    cursor: 'default',
    alignItems: 'center',
    gap: '0.375rem',
    borderRadius: layout.radiusMd,
    paddingInline: '0.375rem',
    paddingBlock: '0.25rem',
    fontSize: '0.875rem',
    lineHeight: 1.25,
    outlineStyle: 'none',
    userSelect: 'none',
    color: colors.popoverForeground,
  },
  itemSpacious: {
    gap: '0.5rem',
    padding: '0.5rem',
  },
  itemInteractive: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: colors.accent,
      color: colors.accentForeground,
    },
  },
  itemActive: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
  },
  itemDisabled: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
  itemDestructive: {
    color: colors.destructive,
    ':hover': {
      backgroundColor: 'oklch(0.577 0.245 27.325 / 10%)',
      color: colors.destructive,
    },
  },
  itemIcon: {
    width: '1rem',
    height: '1rem',
    flexShrink: 0,
    color: colors.mutedForeground,
  },
  iconBox: {
    display: 'flex',
    width: '1.5rem',
    height: '1.5rem',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  iconInBox: {
    width: '0.875rem',
    height: '0.875rem',
    flexShrink: 0,
  },
  iconInBoxLg: {
    width: '1rem',
    height: '1rem',
    flexShrink: 0,
  },
  itemLabel: {
    flex: 1,
    minWidth: 0,
  },
  itemLabelMuted: {
    fontWeight: 500,
    color: colors.mutedForeground,
  },
  label: {
    paddingInline: '0.375rem',
    paddingBlock: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: colors.mutedForeground,
  },
  separator: {
    marginInline: '-0.25rem',
    marginBlock: '0.25rem',
    height: '1px',
    backgroundColor: colors.border,
  },
  shortcut: {
    marginLeft: 'auto',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    color: colors.mutedForeground,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  },
  itemInner: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: '0.375rem',
  },
})