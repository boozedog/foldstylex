import { Duration, Match as M, Option } from 'effect'
import {
  AnchorTooltip,
  BlurredTrigger,
  EnteredTrigger,
  FocusedTrigger,
  LeftTrigger,
  PressedEscape,
  PressedPointerOnTrigger,
  init as tooltipInit,
  type Model as TooltipModel,
  type Message as TooltipMessage,
  type ViewInputs as TooltipViewInputs,
} from '@foldkit/ui/tooltip'
import type { AnchorConfig } from '@foldkit/ui/tooltip'
import type { Html } from 'foldkit/html'
import { childAttributes, html } from 'foldkit/html'
import { defineView } from 'foldkit/submodel'

import { tooltipStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

/** Anchor for sidebar icon-mode tooltips (shadcn: side right, sideOffset 0). */
export const sidebarAnchor: AnchorConfig = {
  placement: 'right',
  gap: 0,
  padding: 8,
}

/** Creates a tooltip model with instant show delay for sidebar hover labels. */
export const init = (id: string): TooltipModel =>
  tooltipInit({ id, showDelay: Duration.millis(0) })

type SidebarTooltipViewInputs = TooltipViewInputs &
  Readonly<{
    enabled: boolean
  }>

/** Like Foldkit `Tooltip.view`, but leaves the trigger alone when `enabled` is false. */
const sidebarTooltipView = defineView<
  TooltipModel,
  TooltipMessage,
  SidebarTooltipViewInputs
>((model, viewInputs) => {
  const h = html<TooltipMessage>()

  const { id, isOpen } = model
  const { anchor, toView, enabled } = viewInputs

  const handleTriggerKeyDown = (
    key: string,
  ): Option.Option<typeof PressedEscape.Type> =>
    M.value(key).pipe(
      M.when('Escape', () =>
        isOpen ? Option.some(PressedEscape()) : Option.none(),
      ),
      M.orElse(() => Option.none()),
    )

  const handleTriggerPointerDown = (
    pointerType: string,
    button: number,
  ): Option.Option<typeof PressedPointerOnTrigger.Type> =>
    Option.some(PressedPointerOnTrigger({ pointerType, button }))

  const interactiveTriggerAttributes = enabled
    ? [
        h.AriaDescribedBy(`${id}-panel`),
        ...(isOpen ? [h.DataAttribute('open', '')] : []),
        h.OnMouseEnter(EnteredTrigger()),
        h.OnMouseLeave(LeftTrigger()),
        h.OnFocus(FocusedTrigger()),
        h.OnBlur(BlurredTrigger()),
        h.OnKeyDownPreventDefault(handleTriggerKeyDown),
        h.OnPointerDown(handleTriggerPointerDown),
      ]
    : []

  const triggerAttributes = [
    h.Id(`${id}-trigger`),
    h.Type('button'),
    ...interactiveTriggerAttributes,
  ]

  const panelAttributes = [
    h.Id(`${id}-panel`),
    h.Role('tooltip'),
    h.Style({
      position: 'absolute',
      margin: '0',
      visibility: 'hidden',
      pointerEvents: 'none',
    }),
    h.OnMount(AnchorTooltip({ buttonId: `${id}-trigger`, anchor })),
    ...(isOpen && enabled ? [h.DataAttribute('open', '')] : []),
  ]

  return toView({
    trigger: childAttributes(triggerAttributes),
    panel: childAttributes(panelAttributes),
    isVisible: enabled && isOpen,
  })
})

export type WrapConfig<ParentMessage> = Readonly<{
  model: TooltipModel
  label: string
  enabled: boolean
  toParentMessage: (message: TooltipMessage) => ParentMessage
  triggerAttributes: ReadonlyArray<unknown>
  triggerChildren: ReadonlyArray<Html>
}>

/** Wraps a menu button in a Foldkit tooltip submodel (stable DOM; use `enabled` to toggle). */
export const wrapButton = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  config: WrapConfig<ParentMessage>,
): Html =>
  h.submodel({
    slotId: config.model.id,
    model: config.model,
    view: sidebarTooltipView,
    viewInputs: {
      anchor: sidebarAnchor,
      enabled: config.enabled,
      toView: ({ trigger, panel, isVisible }) =>
        h.div(
          elAttrs<ParentMessage>(sxAttrs(h, tooltipStyles.wrapper)),
          [
            h.button(
              elAttrs<ParentMessage>(config.triggerAttributes, trigger),
              config.triggerChildren,
            ),
            h.div(
              elAttrs<ParentMessage>(
                sxAttrs(
                  h,
                  tooltipStyles.content,
                  isVisible ? undefined : tooltipStyles.contentHidden,
                ),
                panel,
              ),
              [config.label],
            ),
          ],
        ),
    },
    toParentMessage: config.toParentMessage,
  })