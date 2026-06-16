import type { RenderInfo, ViewInputs } from '@foldkit/ui/dialog'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { dialogStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export {
  init,
  update,
  open,
  close,
  view,
  titleId,
  descriptionId,
  Model,
  Message,
  OutMessage,
  Opened,
  Closed,
  RequestedOpen,
  RequestedClose,
} from '@foldkit/ui/dialog'

export type DialogStyledConfig<ParentMessage> = Readonly<{
  title?: string
  description?: string
  body?: ReadonlyArray<Html>
  footer?: ReadonlyArray<Html>
  showClose?: boolean
  panelSize?: 'default' | 'sm'
  extraDialogAttributes?: ReadonlyArray<unknown>
}>

const panelContent = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  modelId: string,
  config: DialogStyledConfig<ParentMessage>,
  closeButton: RenderInfo['closeButton'],
): ReadonlyArray<Html> => [
  ...(config.showClose === true
    ? [
        h.button(
          elAttrs<ParentMessage>(
            closeButton,
            sxAttrs(h, dialogStyles.close),
            h.AriaLabel('Close'),
          ),
          ['×'],
        ),
      ]
    : []),
  ...(config.title !== undefined || config.description !== undefined
    ? [
        h.div(
          elAttrs<ParentMessage>(sxAttrs(h, dialogStyles.header)),
          [
            ...(config.title !== undefined
              ? [
                  h.h2(
                    elAttrs<ParentMessage>(
                      sxAttrs(h, dialogStyles.title),
                      h.Id(`${modelId}-title`),
                    ),
                    [config.title],
                  ),
                ]
              : []),
            ...(config.description !== undefined
              ? [
                  h.p(
                    elAttrs<ParentMessage>(
                      sxAttrs(h, dialogStyles.description),
                      h.Id(`${modelId}-description`),
                    ),
                    [config.description],
                  ),
                ]
              : []),
          ],
        ),
      ]
    : []),
  ...(config.body ?? []),
  ...(config.footer !== undefined
    ? [
        h.div(
          elAttrs<ParentMessage>(sxAttrs(h, dialogStyles.footer)),
          config.footer,
        ),
      ]
    : []),
]

/** Builds styled Foldkit Dialog view inputs with shadcn dialog visuals. */
export const styledViewInputs = <ParentMessage>(
  config: DialogStyledConfig<ParentMessage> & Readonly<{ id: string }>,
): ViewInputs => ({
  toView: ({ dialog, backdrop, panel, closeButton, isVisible }) => {
    const h = html<ParentMessage>()

    return h.dialog(
      elAttrs<ParentMessage>(
        dialog,
        sxAttrs(
          h,
          dialogStyles.dialog,
          isVisible ? dialogStyles.dialogOpen : undefined,
        ),
        ...(config.extraDialogAttributes ?? []),
      ),
      isVisible
        ? [
            h.div(
              elAttrs<ParentMessage>(backdrop, sxAttrs(h, dialogStyles.backdrop)),
              [],
            ),
            h.div(
              elAttrs<ParentMessage>(
                panel,
                sxAttrs(
                  h,
                  dialogStyles.panel,
                  config.panelSize === 'sm' ? dialogStyles.panelSm : undefined,
                ),
              ),
              panelContent(h, config.id, config, closeButton),
            ),
          ]
        : [],
    )
  },
})