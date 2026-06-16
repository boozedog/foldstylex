import type { Model, ViewInputs } from '@foldkit/ui/checkbox'
import type { Message as CheckboxMessage } from '@foldkit/ui/checkbox'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { checkboxStyles, fieldStyles } from '@foldstylex/styles'

import * as Field from './field.js'
import { elAttrs, sxAttrs } from './sx.js'

export {
  init,
  update,
  setChecked,
  reflectChecked,
  view,
  Model,
  Message,
  OutMessage,
  ToggledChecked,
} from '@foldkit/ui/checkbox'

export type CheckboxStyledConfig = Readonly<{
  label: string
  description?: string
  orientation?: 'vertical' | 'horizontal'
  isDisabled?: boolean
  isIndeterminate?: boolean
  indicator?: Html
}>

const checkboxStylesFor = (
  h: ReturnType<typeof html<CheckboxMessage>>,
  model: Model,
  isIndeterminate: boolean,
) =>
  sxAttrs(
    h,
    checkboxStyles.root,
    model.isChecked && !isIndeterminate ? checkboxStyles.rootChecked : undefined,
    isIndeterminate ? checkboxStyles.rootIndeterminate : undefined,
  )

const defaultIndicator = (h: ReturnType<typeof html<CheckboxMessage>>): Html =>
  h.span(
    elAttrs<CheckboxMessage>(sxAttrs(h, checkboxStyles.indicator)),
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Xmlns('http://www.w3.org/2000/svg'),
          h.ViewBox('0 0 24 24'),
          h.Fill('none'),
          h.Stroke('currentColor'),
          h.StrokeWidth('2'),
          h.StrokeLinecap('round'),
          h.StrokeLinejoin('round'),
          h.Width('14'),
          h.Height('14'),
        ],
        [h.path([h.D('M20 6 9 17l-5-5')], [])],
      ),
    ],
  )

/** Builds styled Foldkit Checkbox view inputs with shadcn checkbox visuals. */
export const styledViewInputs = (
  model: Model,
  config: CheckboxStyledConfig,
): ViewInputs => ({
  ...(config.isDisabled === true ? { isDisabled: true } : {}),
  ...(config.isIndeterminate === true ? { isIndeterminate: true } : {}),
  toView: attributes => {
    const h = html<CheckboxMessage>()
    const isIndeterminate = config.isIndeterminate === true
    const indicator = config.indicator
    const orientation = config.orientation ?? 'horizontal'

    const control = h.button(
      elAttrs<CheckboxMessage>(
        attributes.checkbox,
        checkboxStylesFor(h, model, isIndeterminate),
      ),
      model.isChecked || isIndeterminate
        ? [
            indicator ?? defaultIndicator(h),
          ]
        : [],
    )

    const fieldLabel = Field.label<CheckboxMessage>(config.label, attributes.label)
    const fieldDescription =
      config.description !== undefined
        ? Field.description<CheckboxMessage>(
            config.description,
            attributes.description,
          )
        : undefined

    if (orientation === 'vertical') {
      return Field.group<CheckboxMessage>({
        orientation: 'vertical',
        label: fieldLabel,
        ...(fieldDescription !== undefined ? { description: fieldDescription } : {}),
        children: [control],
      })
    }

    return Field.group<CheckboxMessage>({
      orientation: 'horizontal',
      children: [
        control,
        h.div(
          elAttrs<CheckboxMessage>(sxAttrs(h, fieldStyles.fieldContent)),
          [
            fieldLabel,
            ...(fieldDescription !== undefined ? [fieldDescription] : []),
          ],
        ),
      ],
    })
  },
})