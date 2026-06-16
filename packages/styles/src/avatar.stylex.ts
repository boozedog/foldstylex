import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const avatarStyles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: '9999px',
    userSelect: 'none',
  },
  rootLg: {
    borderRadius: layout.radiusLg,
  },
  sizeSm: {
    width: '1.5rem',
    height: '1.5rem',
  },
  sizeDefault: {
    width: '2rem',
    height: '2rem',
  },
  sizeLg: {
    width: '2.5rem',
    height: '2.5rem',
  },
  image: {
    position: 'absolute',
    inset: 0,
    aspectRatio: '1',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'inherit',
  },
  fallback: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'inherit',
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  fallbackSm: {
    fontSize: '0.75rem',
  },
})