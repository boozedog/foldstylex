import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'
import { layout } from '@foldstylex/tokens/layout.stylex.ts'

export const tooltipStyles = stylex.create({
  wrapper: {
    display: 'contents',
  },
  content: {
    zIndex: 50,
    width: 'max-content',
    maxWidth: '20rem',
    borderRadius: layout.radiusMd,
    backgroundColor: colors.foreground,
    color: colors.background,
    paddingInline: '0.75rem',
    paddingBlock: '0.375rem',
    fontFamily: layout.fontSans,
    fontSize: '0.75rem',
    lineHeight: 1.25,
    textWrap: 'balance',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    pointerEvents: 'none',
  },
  contentHidden: {
    display: 'none',
  },
})