import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { separatorStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export type SeparatorViewConfig<ParentMessage> = Readonly<{
  orientation?: SeparatorOrientation
}>

/** Renders a shadcn-styled separator line. */
export const view = <ParentMessage>(
  config: SeparatorViewConfig<ParentMessage> = {},
): Html => {
  const h = html<ParentMessage>()
  const orientation = config.orientation ?? 'horizontal'

  return h.div(
    elAttrs<ParentMessage>(
      h.AriaHidden(true),
      h.Role('separator'),
      sxAttrs(
        h,
        orientation === 'vertical'
          ? separatorStyles.vertical
          : separatorStyles.horizontal,
      ),
    ),
    [],
  )
}