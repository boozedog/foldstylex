import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'

export const fieldStyles = stylex.create({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',
  },
  fieldContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '0.125rem',
    lineHeight: 1.375,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1,
    color: colors.foreground,
    userSelect: 'none',
  },
  description: {
    fontSize: '0.875rem',
    lineHeight: 1.25,
    color: colors.mutedForeground,
  },
  error: {
    fontSize: '0.875rem',
    lineHeight: 1.25,
    color: colors.destructive,
  },
})