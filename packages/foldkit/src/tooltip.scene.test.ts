import { html, submodel } from 'foldkit/html'
import * as Scene from 'foldkit/scene'
import {
  AnchorTooltip,
  CompletedAnchorTooltip,
  FocusedTrigger,
  init as tooltipInit,
  update,
  type Message,
  type Model,
} from '@foldkit/ui/tooltip'
import { describe, it } from '@effect/vitest'

import { init, view } from './tooltip.js'

const acknowledgeAnchor = Scene.Mount.resolve(
  AnchorTooltip,
  CompletedAnchorTooltip(),
)

const sceneView =
  (overrides: { enabled?: boolean } = {}) =>
  (model: Model) => {
    const h = html<Message>()

    return submodel({
      slotId: model.id,
      model,
      view,
      viewInputs: {
        anchor: { placement: 'right', gap: 0, padding: 8 },
        enabled: overrides.enabled ?? true,
        toView: ({ trigger, panel, isVisible }) =>
          h.div(
            [],
            [
              h.button([...trigger], ['Trigger']),
              ...(isVisible ? [h.div([...panel], [])] : []),
            ],
          ),
      },
      toParentMessage: message => message,
    })
  }

const trigger = Scene.selector('#sidebar-tip-trigger')
const panel = Scene.selector('#sidebar-tip-panel')

const hiddenModel = init('sidebar-tip')
const [openModel] = update(tooltipInit({ id: 'sidebar-tip' }), FocusedTrigger())

describe('SidebarTooltip scene', () => {
  it('attaches tooltip handlers when enabled', () => {
    Scene.scene(
      { update, view: sceneView({ enabled: true }) },
      Scene.with(hiddenModel),
      Scene.expect(trigger).toHaveAttr('aria-describedby', 'sidebar-tip-panel'),
      Scene.expect(trigger).toHaveHandler('mouseenter'),
      Scene.expect(trigger).toHaveHandler('focus'),
    )
  })

  it('leaves the trigger alone when disabled', () => {
    Scene.scene(
      { update, view: sceneView({ enabled: false }) },
      Scene.with(hiddenModel),
      Scene.expect(trigger).not.toHaveAttr('aria-describedby'),
      Scene.expect(trigger).not.toHaveHandler('mouseenter'),
      Scene.expect(trigger).not.toHaveHandler('focus'),
    )
  })

  it('renders the panel when open and enabled', () => {
    Scene.scene(
      { update, view: sceneView({ enabled: true }) },
      Scene.with(openModel),
      Scene.expect(panel).toExist(),
      Scene.expect(panel).toHaveAttr('role', 'tooltip'),
      Scene.expect(trigger).toHaveAttr('data-open', ''),
      acknowledgeAnchor,
    )
  })

  it('does not mark the panel open when disabled even if the model is open', () => {
    Scene.scene(
      { update, view: sceneView({ enabled: false }) },
      Scene.with(openModel),
      Scene.expect(panel).toBeAbsent(),
      Scene.expect(trigger).not.toHaveAttr('data-open'),
    )
  })
})