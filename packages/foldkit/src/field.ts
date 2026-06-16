import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { fieldStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export type FieldOrientation = 'vertical' | 'horizontal'

/** Renders a shadcn-styled field label. */
export const label = <ParentMessage>(
  text: string,
  attributes: ReadonlyArray<unknown> = [],
): Html => {
  const h = html<ParentMessage>()

  return h.label(
    elAttrs<ParentMessage>(attributes, sxAttrs(h, fieldStyles.label)),
    [text],
  )
}

/** Renders helper text below a control. */
export const description = <ParentMessage>(
  text: string,
  attributes: ReadonlyArray<unknown> = [],
): Html => {
  const h = html<ParentMessage>()

  return h.p(
    elAttrs<ParentMessage>(attributes, sxAttrs(h, fieldStyles.description)),
    [text],
  )
}

/** Renders an error message below a control. */
export const error = <ParentMessage>(
  text: string,
  attributes: ReadonlyArray<unknown> = [],
): Html => {
  const h = html<ParentMessage>()

  return h.p(
    elAttrs<ParentMessage>(attributes, sxAttrs(h, fieldStyles.error)),
    [text],
  )
}

/** Wraps a control with optional label and description (shadcn Field). */
export const group = <ParentMessage>(config: {
  label?: Html
  description?: Html
  error?: Html
  orientation?: FieldOrientation
  children: ReadonlyArray<Html>
}): Html => {
  const h = html<ParentMessage>()
  const orientation = config.orientation ?? 'vertical'

  if (orientation === 'horizontal') {
    return h.div(
      elAttrs<ParentMessage>(sxAttrs(h, fieldStyles.fieldRow)),
      [
        ...config.children,
        ...(config.label !== undefined || config.description !== undefined
          ? [
              h.div(
                elAttrs<ParentMessage>(sxAttrs(h, fieldStyles.fieldContent)),
                [
                  ...(config.label !== undefined ? [config.label] : []),
                  ...(config.description !== undefined
                    ? [config.description]
                    : []),
                  ...(config.error !== undefined ? [config.error] : []),
                ],
              ),
            ]
          : []),
      ],
    )
  }

  return h.div(
    elAttrs<ParentMessage>(sxAttrs(h, fieldStyles.field)),
    [
      ...(config.label !== undefined ? [config.label] : []),
      ...config.children,
      ...(config.description !== undefined ? [config.description] : []),
      ...(config.error !== undefined ? [config.error] : []),
    ],
  )
}