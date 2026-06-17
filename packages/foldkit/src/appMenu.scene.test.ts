import { html } from 'foldkit/html'
import * as Scene from 'foldkit/scene'
import { describe, it } from '@effect/vitest'

import {
  EndedSwipe,
  init,
  type Message,
  type Model,
  type ViewInputs,
  RequestedOpen,
  SwipeEdgeMenu,
  update,
  view,
} from './appMenu.js'

const menuId = 'test-menu'

const defaultViewInputs: ViewInputs = {
  renderContent: () => {
    const h = html<Message>()
    return h.div([], ['Menu content'])
  },
  showClose: true,
  side: 'start',
  swipeGesture: true,
  maxEdgeStart: 50,
}

const sceneView =
  (overrides: Partial<ViewInputs> = {}) =>
  (model: Model) =>
    view(model, { ...defaultViewInputs, ...overrides })

const acknowledgeSwipeEdgeMenu = Scene.Mount.resolve(
  SwipeEdgeMenu({
    side: 'start',
    maxEdgeStart: 50,
    swipeGesture: true,
  }),
  EndedSwipe(),
)

const menuHost = Scene.selector(`#${menuId}`)
const closeButton = Scene.role('button', { name: 'Close menu' })
const backdrop = Scene.selector('[data-app-menu-backdrop]')

const closedModel = init({ id: menuId })
const [openModel] = update(closedModel, RequestedOpen({ role: 'button' }))

describe('AppMenu scene', () => {
  describe('closed', () => {
    it('hides the host from assistive tech', () => {
      Scene.scene(
        { update, view: sceneView() },
        Scene.with(closedModel),
        Scene.expect(menuHost).toHaveAttr('aria-hidden', 'true'),
        acknowledgeSwipeEdgeMenu,
      )
    })
  })

  describe('open', () => {
    it('exposes dialog semantics on the host', () => {
      Scene.scene(
        { update, view: sceneView() },
        Scene.with(openModel),
        Scene.expect(menuHost).toHaveAttr('role', 'dialog'),
        Scene.expect(menuHost).toHaveAttr('aria-modal', 'true'),
        acknowledgeSwipeEdgeMenu,
      )
    })

    it('closes when the close button is clicked', () => {
      Scene.scene(
        { update, view: sceneView() },
        Scene.with(openModel),
        acknowledgeSwipeEdgeMenu,
        Scene.click(closeButton),
        Scene.expect(menuHost).toHaveAttr('aria-hidden', 'true'),
      )
    })

    it('closes when the backdrop is clicked', () => {
      Scene.scene(
        { update, view: sceneView() },
        Scene.with(openModel),
        acknowledgeSwipeEdgeMenu,
        Scene.click(backdrop),
        Scene.expect(menuHost).toHaveAttr('aria-hidden', 'true'),
      )
    })
  })
})