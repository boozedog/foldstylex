import { Input } from '@foldkit/ui'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { fieldStyles, inputStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export type InputViewConfig<ParentMessage> = Readonly<{
  id: string
  label: string
  value?: string
  onInput?: (value: string) => ParentMessage
  placeholder?: string
  description?: string
  isDisabled?: boolean
}>

/** Renders a shadcn-styled labeled input using @foldkit/ui behavior. */
export const view = <ParentMessage>(
  config: InputViewConfig<ParentMessage>,
): Html => {
  const h = html<ParentMessage>()

  return Input.view<ParentMessage>({
    id: config.id,
    ...(config.value !== undefined ? { value: config.value } : {}),
    ...(config.onInput !== undefined ? { onInput: config.onInput } : {}),
    ...(config.placeholder !== undefined ? { placeholder: config.placeholder } : {}),
    ...(config.isDisabled === true ? { isDisabled: true } : {}),
    toView: attributes =>
      h.div(
        elAttrs<ParentMessage>(sxAttrs(h, fieldStyles.field)),
        [
          h.label(
            elAttrs<ParentMessage>(
              attributes.label,
              sxAttrs(h, fieldStyles.label),
            ),
            [config.label],
          ),
          h.input(
            elAttrs<ParentMessage>(
              attributes.input,
              sxAttrs(h, inputStyles.input),
            ),
          ),
          ...(config.description !== undefined
            ? [
                h.p(
                  elAttrs<ParentMessage>(
                    attributes.description,
                    sxAttrs(h, fieldStyles.description),
                  ),
                  [config.description],
                ),
              ]
            : []),
        ],
      ),
  })
}