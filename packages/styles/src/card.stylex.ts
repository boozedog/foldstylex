import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const cardStyles = stylex.create({
  page: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '1.5rem',
  },
  pageInner: {
    margin: '0 auto',
    maxWidth: '48rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  pageHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  pageTitle: {
    fontSize: '1.875rem',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
    color: colors.foreground,
    margin: 0,
  },
  pageDescription: {
    fontSize: '0.875rem',
    lineHeight: 1.625,
    color: colors.mutedForeground,
    margin: 0,
  },
  sectionStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.5rem',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflow: 'hidden',
    borderRadius: layout.radiusXl,
    backgroundColor: colors.card,
    color: colors.cardForeground,
    paddingBlock: '1rem',
    boxShadow: `0 0 0 1px ${colors.border}`,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    paddingInline: '1rem',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.375,
    color: colors.cardForeground,
  },
  description: {
    fontSize: '0.875rem',
    lineHeight: 1.25,
    color: colors.mutedForeground,
  },
  content: {
    paddingInline: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
})