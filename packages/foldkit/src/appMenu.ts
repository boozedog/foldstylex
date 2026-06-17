import { Match as M, Option, Schema as S } from 'effect'
import type { Command } from 'foldkit/command'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { defineView } from 'foldkit/submodel'

import { appMenuStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

// MODEL

export const Model = S.Struct({
  id: S.String,
  isOpen: S.Boolean,
})

export type Model = typeof Model.Type

// MESSAGE

export const RequestedOpen = m('RequestedOpen')

export const RequestedClose = m('RequestedClose', {
  role: S.optional(S.Literals(['backdrop', 'escape'] as const)),
})

export const Message = S.Union([RequestedOpen, RequestedClose])

export type Message = typeof Message.Type

export type CloseRole = 'backdrop' | 'escape'

// INIT

export const init = (config: Readonly<{ id: string; isOpen?: boolean }>): Model => ({
  id: config.id,
  isOpen: config.isOpen ?? false,
})

// UPDATE

export const update = (
  model: Model,
  message: Message,
): readonly [Model, ReadonlyArray<Command<Message>>] =>
  M.value(message).pipe(
    M.withReturnType<readonly [Model, ReadonlyArray<Command<Message>>]>(),
    M.tagsExhaustive({
      RequestedOpen: () => [evo(model, { isOpen: () => true }), []],
      RequestedClose: () => [evo(model, { isOpen: () => false }), []],
    }),
  )

export const open = (
  model: Model,
): readonly [Model, ReadonlyArray<Command<Message>>] =>
  update(model, RequestedOpen())

export const close = (
  model: Model,
): readonly [Model, ReadonlyArray<Command<Message>>] =>
  update(model, RequestedClose({}))

export const toggle = (
  model: Model,
): readonly [Model, ReadonlyArray<Command<Message>>] =>
  model.isOpen ? close(model) : open(model)

// VIEW

export type AppMenuSide = 'start' | 'end'

export type AppMenuStyledConfig = Readonly<{
  /** Top-level render fn so nested submodels stay boundary-scoped. */
  renderContent: () => Html
  ariaLabel?: string
  side?: AppMenuSide
  showClose?: boolean
  closeButton?: Html
}>

export type ViewInputs = AppMenuStyledConfig

/** Ion-menu overlay drawer: slides over content with backdrop dismiss. */
export const view = defineView<Model, Message, ViewInputs>((model, viewInputs) => {
  const h = html<Message>()
  const { isOpen, id } = model
  const side = viewInputs.side ?? 'start'
  const ariaLabel = viewInputs.ariaLabel ?? 'Menu'

  const handleKeyDown = (key: string): Option.Option<typeof RequestedClose.Type> =>
    M.value(key).pipe(
      M.when('Escape', () =>
        isOpen ? Option.some(RequestedClose({ role: 'escape' })) : Option.none(),
      ),
      M.orElse(() => Option.none()),
    )

  if (!isOpen) {
    return h.div(elAttrs<Message>(h.Id(id), h.AriaHidden(true)), [])
  }

  return h.div(
    elAttrs<Message>(
      h.Id(id),
      h.Role('dialog'),
      h.AriaModal(true),
      h.AriaLabel(ariaLabel),
      h.Tabindex(-1),
      h.OnKeyDownPreventDefault(handleKeyDown),
      sxAttrs(
        h,
        appMenuStyles.host,
        appMenuStyles.hostInteractive,
        appMenuStyles.mobileOnly,
      ),
    ),
    [
      h.div(
        elAttrs<Message>(
          h.OnClick(RequestedClose({ role: 'backdrop' })),
          sxAttrs(h, appMenuStyles.backdrop, appMenuStyles.backdropVisible),
        ),
        [],
      ),
      h.div(
        elAttrs<Message>(
          sxAttrs(
            h,
            appMenuStyles.panel,
            side === 'end' ? appMenuStyles.panelEnd : appMenuStyles.panelStart,
            appMenuStyles.panelOpen,
          ),
        ),
        [
          ...(viewInputs.showClose === true
            ? [
                h.div(
                  elAttrs<Message>(sxAttrs(h, appMenuStyles.panelHeader)),
                  [
                    h.button(
                      elAttrs<Message>(
                        h.OnClick(RequestedClose({})),
                        h.AriaLabel('Close menu'),
                        sxAttrs(h, appMenuStyles.closeButton),
                      ),
                      viewInputs.closeButton !== undefined
                        ? [viewInputs.closeButton]
                        : ['×'],
                    ),
                  ],
                ),
              ]
            : []),
          h.div(
            elAttrs<Message>(sxAttrs(h, appMenuStyles.panelBody)),
            [viewInputs.renderContent()],
          ),
        ],
      ),
    ],
  )
})

/** Builds view inputs that reuse sidebar nav content inside the overlay panel. */
export const styledViewInputs = (config: AppMenuStyledConfig): ViewInputs => config