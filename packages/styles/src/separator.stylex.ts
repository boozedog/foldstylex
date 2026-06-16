import * as stylex from '@stylexjs/stylex'

import { colors } from '@foldstylex/tokens/colors.stylex.ts'

export const separatorStyles = stylex.create({
  horizontal: {
    backgroundColor: colors.border,
    height: '1px',
    width: '100%',
    flexShrink: 0,
  },
  vertical: {
    backgroundColor: colors.border,
    width: '1px',
    height: '1rem',
    alignSelf: 'center',
    flexShrink: 0,
  },
})