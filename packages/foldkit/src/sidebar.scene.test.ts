import { Disclosure } from '@foldkit/ui'
import {
  AnchorTooltip,
  CompletedAnchorTooltip,
} from '@foldkit/ui/tooltip'
import { html } from 'foldkit/html'
import * as Scene from 'foldkit/scene'
import { describe, it } from '@effect/vitest'

import * as Sidebar from './sidebar.js'
import { init as tooltipInit, sidebarAnchor } from './tooltip.js'

type SceneMessage = never

type SceneModel = Readonly<{ tag: 'SidebarScene' }>

const sceneModel: SceneModel = { tag: 'SidebarScene' }

const noopUpdate = (
  model: SceneModel,
  _message: SceneMessage,
): readonly [SceneModel, []] => [model, []]

const chevron = (() => {
  const h = html<SceneMessage>()
  return h.span([], ['›'])
})()

const acknowledgeNavTooltip = Scene.Mount.resolve(
  AnchorTooltip({
    buttonId: 'nav-tooltip-trigger',
    anchor: sidebarAnchor,
  }),
  CompletedAnchorTooltip(),
)

const minimalNavConfig = (): Sidebar.SidebarNavConfig<SceneMessage> => ({
  brand: { name: 'Acme Inc' },
  groups: [
    {
      id: 'platform',
      label: 'Platform',
      items: [{ id: 'home', label: 'Home' }],
    },
  ],
})

const tooltipNavConfig = (): Sidebar.SidebarNavConfig<SceneMessage> => ({
  brand: { name: 'Acme Inc' },
  groups: [
    {
      id: 'platform',
      label: 'Platform',
      items: [
        {
          id: 'playground',
          label: 'Playground',
          tooltip: {
            model: tooltipInit('nav-tooltip'),
            toParentMessage: message => message as SceneMessage,
          },
        },
      ],
    },
  ],
})

const collapsibleNavConfig = (): Sidebar.SidebarNavConfig<SceneMessage> => ({
  brand: { name: 'Acme Inc' },
  groups: [
    {
      id: 'platform',
      label: 'Platform',
      items: [
        {
          id: 'playground',
          label: 'Playground',
          subItems: [
            {
              id: 'history',
              label: 'History',
              onClick: undefined as unknown as SceneMessage,
            },
          ],
          model: Disclosure.init({ id: 'playground', isOpen: true }),
          toParentMessage: message => message as SceneMessage,
        },
      ],
      activeSubItemId: 'history',
    },
  ],
})

const sidebarAside = Scene.role('complementary', { name: 'Sidebar' })
const mainContent = Scene.role('main')
const tooltipTrigger = Scene.selector('#nav-tooltip-trigger')

describe('Sidebar scene', () => {
  it('renders the desktop sidebar landmark', () => {
    Scene.scene(
      {
        update: noopUpdate,
        view: () => Sidebar.desktop(minimalNavConfig(), { chevron }),
      },
      Scene.with(sceneModel),
      Scene.expect(sidebarAside).toExist(),
    )
  })

  it('locks inset content from assistive tech when an overlay menu is open', () => {
    Scene.scene(
      {
        update: noopUpdate,
        view: () =>
          Sidebar.inset({
            headerChildren: [],
            isContentLocked: true,
          }),
      },
      Scene.with(sceneModel),
      Scene.expect(mainContent).toHaveAttr('aria-hidden', 'true'),
    )
  })

  it('exposes tooltip semantics on collapsed nav items', () => {
    Scene.scene(
      {
        update: noopUpdate,
        view: () =>
          Sidebar.desktop(tooltipNavConfig(), {
            isCollapsed: true,
            chevron,
          }),
      },
      Scene.with(sceneModel),
      Scene.expect(tooltipTrigger).toHaveAttr(
        'aria-describedby',
        'nav-tooltip-panel',
      ),
      acknowledgeNavTooltip,
    )
  })

  it('does not attach tooltip handlers when the sidebar is expanded', () => {
    Scene.scene(
      {
        update: noopUpdate,
        view: () =>
          Sidebar.desktop(tooltipNavConfig(), {
            isCollapsed: false,
            chevron,
          }),
      },
      Scene.with(sceneModel),
      Scene.expect(tooltipTrigger).not.toHaveAttr('aria-describedby'),
      Scene.expect(tooltipTrigger).not.toHaveHandler('mouseenter'),
      acknowledgeNavTooltip,
    )
  })

  it('renders collapsible sub-navigation when a disclosure is open', () => {
    Scene.scene(
      {
        update: noopUpdate,
        view: () =>
          Sidebar.desktop(collapsibleNavConfig(), {
            isCollapsed: false,
            chevron,
          }),
      },
      Scene.with(sceneModel),
      Scene.expect(Scene.text('History')).toExist(),
      Scene.expect(Scene.text('›')).toExist(),
    )
  })
})