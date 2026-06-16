import { Match as M, Schema as S } from 'effect'
import { Command, Runtime } from 'foldkit'
import type { Document } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'

import { Dialog, Disclosure } from '@foldkit/ui'
import { elAttrs, Button, Sidebar, sxAttrs } from '@foldstylex/foldkit'
import { buttonStyles, globalStyles, sidebarStyles } from '@foldstylex/styles'

import {
  bookOpenIcon,
  botIcon,
  chevronRightIcon,
  chevronsUpDownIcon,
  frameIcon,
  galleryVerticalEndIcon,
  mapIcon,
  moreHorizontalIcon,
  panelLeftIcon,
  pieChartIcon,
  settings2Icon,
  squareTerminalIcon,
  xMarkIcon,
} from './icons'

// MODEL

const PLATFORM_DISCLOSURE_IDS = [
  'playground',
  'models',
  'documentation',
  'settings',
] as const

type PlatformDisclosureId = (typeof PLATFORM_DISCLOSURE_IDS)[number]

const PROJECT_IDS = [
  'design-engineering',
  'sales-marketing',
  'travel',
] as const

const PLAYGROUND_SUB_IDS = ['history', 'starred', 'settings'] as const

export const Model = S.Struct({
  activeProject: S.optional(S.Literals(PROJECT_IDS)),
  activePlaygroundSub: S.optional(S.Literals(PLAYGROUND_SUB_IDS)),
  platformPlayground: Disclosure.Model,
  platformModels: Disclosure.Model,
  platformDocumentation: Disclosure.Model,
  platformSettings: Disclosure.Model,
  mobileMenuDialog: Dialog.Model,
})

export type Model = typeof Model.Type

// MESSAGE

export const ClickedProject = m('ClickedProject', { id: S.Literals(PROJECT_IDS) })
export const ClickedPlaygroundSub = m('ClickedPlaygroundSub', {
  id: S.Literals(PLAYGROUND_SUB_IDS),
})
export const GotPlatformDisclosureMessage = m('GotPlatformDisclosureMessage', {
  id: S.Literals(PLATFORM_DISCLOSURE_IDS),
  message: Disclosure.Message,
})
export const ClickedOpenMobileMenu = m('ClickedOpenMobileMenu')
export const ClickedSidebarTrigger = m('ClickedSidebarTrigger')
export const ClickedInertSubItem = m('ClickedInertSubItem')
export const GotMobileMenuDialogMessage = m('GotMobileMenuDialogMessage', {
  message: Dialog.Message,
})

export const Message = S.Union([
  ClickedProject,
  ClickedPlaygroundSub,
  GotPlatformDisclosureMessage,
  ClickedOpenMobileMenu,
  ClickedSidebarTrigger,
  ClickedInertSubItem,
  GotMobileMenuDialogMessage,
])

export type Message = typeof Message.Type

// UPDATE

const platformDisclosure = (
  model: Model,
  id: PlatformDisclosureId,
): Disclosure.Model => {
  switch (id) {
    case 'playground':
      return model.platformPlayground
    case 'models':
      return model.platformModels
    case 'documentation':
      return model.platformDocumentation
    case 'settings':
      return model.platformSettings
  }
}

const withPlatformDisclosure = (
  model: Model,
  id: PlatformDisclosureId,
  disclosure: Disclosure.Model,
): Model =>
  evo(model, {
    platformPlayground: () =>
      id === 'playground' ? disclosure : model.platformPlayground,
    platformModels: () => (id === 'models' ? disclosure : model.platformModels),
    platformDocumentation: () =>
      id === 'documentation' ? disclosure : model.platformDocumentation,
    platformSettings: () =>
      id === 'settings' ? disclosure : model.platformSettings,
  })

const closeMobileMenu = (
  model: Model,
): readonly [Model, ReadonlyArray<Command.Command<Message>>] => {
  const [nextMobileMenuDialog, mobileMenuDialogCommands] = Dialog.close(
    model.mobileMenuDialog,
  )

  return [
    evo(model, {
      mobileMenuDialog: () => nextMobileMenuDialog,
    }),
    Command.mapMessages(mobileMenuDialogCommands, dialogMessage =>
      GotMobileMenuDialogMessage({ message: dialogMessage }),
    ),
  ]
}

export const update = (
  model: Model,
  message: Message,
): readonly [Model, ReadonlyArray<Command.Command<Message>>] =>
  M.value(message).pipe(
    M.withReturnType<
      readonly [Model, ReadonlyArray<Command.Command<Message>>]
    >(),
    M.tagsExhaustive({
      ClickedProject: ({ id }) => {
        const [nextModel, mobileCommands] = closeMobileMenu(
          evo(model, { activeProject: () => id }),
        )

        return [nextModel, mobileCommands]
      },

      ClickedPlaygroundSub: ({ id }) => {
        const [nextModel, mobileCommands] = closeMobileMenu(
          evo(model, { activePlaygroundSub: () => id }),
        )

        return [nextModel, mobileCommands]
      },

      ClickedSidebarTrigger: () => [model, []],

      ClickedInertSubItem: () => closeMobileMenu(model),

      GotPlatformDisclosureMessage: ({ id, message: disclosureMessage }) => {
        const [nextDisclosure, disclosureCommands] = Disclosure.update(
          platformDisclosure(model, id),
          disclosureMessage,
        )

        return [
          withPlatformDisclosure(model, id, nextDisclosure),
          Command.mapMessages(disclosureCommands, message =>
            GotPlatformDisclosureMessage({ id, message }),
          ),
        ]
      },

      ClickedOpenMobileMenu: () => {
        const [nextMobileMenuDialog, mobileMenuDialogCommands] = Dialog.open(
          model.mobileMenuDialog,
        )

        return [
          evo(model, {
            mobileMenuDialog: () => nextMobileMenuDialog,
          }),
          Command.mapMessages(mobileMenuDialogCommands, dialogMessage =>
            GotMobileMenuDialogMessage({ message: dialogMessage }),
          ),
        ]
      },

      GotMobileMenuDialogMessage: ({ message: dialogMessage }) => {
        const [nextMobileMenuDialog, mobileMenuDialogCommands] = Dialog.update(
          model.mobileMenuDialog,
          dialogMessage,
        )

        return [
          evo(model, {
            mobileMenuDialog: () => nextMobileMenuDialog,
          }),
          Command.mapMessages(mobileMenuDialogCommands, message =>
            GotMobileMenuDialogMessage({ message }),
          ),
        ]
      },
    }),
  )

// INIT

export const init: Runtime.ApplicationInit<Model, Message> = () => [
  {
    platformPlayground: Disclosure.init({ id: 'platform-playground', isOpen: true }),
    platformModels: Disclosure.init({ id: 'platform-models' }),
    platformDocumentation: Disclosure.init({ id: 'platform-documentation' }),
    platformSettings: Disclosure.init({ id: 'platform-settings' }),
    mobileMenuDialog: Dialog.init({ id: 'mobile-menu' }),
  },
  [],
]

// VIEW

const navConfig = (model: Model): Sidebar.SidebarNavConfig<Message> => ({
  brand: {
    name: 'Acme Inc',
    subtitle: 'Enterprise',
    logo: galleryVerticalEndIcon,
    chevron: chevronsUpDownIcon,
  },
  groups: [
    {
      id: 'platform',
      label: 'Platform',
      ...(model.activePlaygroundSub !== undefined
        ? { activeSubItemId: model.activePlaygroundSub }
        : {}),
      items: [
        {
          id: 'playground',
          label: 'Playground',
          icon: squareTerminalIcon,
          subItems: [
            {
              id: 'history',
              label: 'History',
              onClick: ClickedPlaygroundSub({ id: 'history' }),
            },
            {
              id: 'starred',
              label: 'Starred',
              onClick: ClickedPlaygroundSub({ id: 'starred' }),
            },
            {
              id: 'settings',
              label: 'Settings',
              onClick: ClickedPlaygroundSub({ id: 'settings' }),
            },
          ],
          model: model.platformPlayground,
          toParentMessage: message =>
            GotPlatformDisclosureMessage({ id: 'playground', message }),
        },
        {
          id: 'models',
          label: 'Models',
          icon: botIcon,
          subItems: [
            { id: 'genesis', label: 'Genesis', onClick: ClickedInertSubItem() },
            { id: 'explorer', label: 'Explorer', onClick: ClickedInertSubItem() },
            { id: 'quantum', label: 'Quantum', onClick: ClickedInertSubItem() },
          ],
          model: model.platformModels,
          toParentMessage: message =>
            GotPlatformDisclosureMessage({ id: 'models', message }),
        },
        {
          id: 'documentation',
          label: 'Documentation',
          icon: bookOpenIcon,
          subItems: [
            { id: 'introduction', label: 'Introduction', onClick: ClickedInertSubItem() },
            { id: 'get-started', label: 'Get Started', onClick: ClickedInertSubItem() },
            { id: 'tutorials', label: 'Tutorials', onClick: ClickedInertSubItem() },
            { id: 'changelog', label: 'Changelog', onClick: ClickedInertSubItem() },
          ],
          model: model.platformDocumentation,
          toParentMessage: message =>
            GotPlatformDisclosureMessage({ id: 'documentation', message }),
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: settings2Icon,
          subItems: [
            { id: 'general', label: 'General', onClick: ClickedInertSubItem() },
            { id: 'team', label: 'Team', onClick: ClickedInertSubItem() },
            { id: 'billing', label: 'Billing', onClick: ClickedInertSubItem() },
            { id: 'limits', label: 'Limits', onClick: ClickedInertSubItem() },
          ],
          model: model.platformSettings,
          toParentMessage: message =>
            GotPlatformDisclosureMessage({ id: 'settings', message }),
        },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      ...(model.activeProject !== undefined
        ? { activeItemId: model.activeProject }
        : {}),
      items: [
        {
          id: 'design-engineering',
          label: 'Design Engineering',
          icon: frameIcon,
          onClick: ClickedProject({ id: 'design-engineering' }),
        },
        {
          id: 'sales-marketing',
          label: 'Sales & Marketing',
          icon: pieChartIcon,
          onClick: ClickedProject({ id: 'sales-marketing' }),
        },
        {
          id: 'travel',
          label: 'Travel',
          icon: mapIcon,
          onClick: ClickedProject({ id: 'travel' }),
        },
        {
          id: 'more',
          label: 'More',
          icon: moreHorizontalIcon,
          muted: true,
        },
      ],
    },
  ],
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatarFallback: 'CN',
    chevron: chevronsUpDownIcon,
  },
})

export const view = (model: Model): Document => {
  const h = html<Message>()
  const navigation = navConfig(model)
  const sidebarOptions = { chevron: chevronRightIcon }

  const mobileMenu = h.submodel({
    slotId: model.mobileMenuDialog.id,
    model: model.mobileMenuDialog,
    view: Dialog.view,
    viewInputs: {
      toView: ({ dialog, backdrop, panel, closeButton, isVisible }) =>
        h.dialog(
          elAttrs<Message>(dialog, sxAttrs(h, sidebarStyles.mobileOnly)),
          isVisible
            ? [
                h.div(
                  elAttrs<Message>(backdrop, sxAttrs(h, sidebarStyles.mobileOverlay)),
                  [],
                ),
                h.div(
                  [...panel],
                  [
                    h.div(
                      elAttrs<Message>(sxAttrs(h, sidebarStyles.mobileSheet)),
                      [
                        h.div(
                          elAttrs<Message>(sxAttrs(h, sidebarStyles.mobileSheetHeader)),
                          [
                            h.button(
                              elAttrs<Message>(
                                closeButton,
                                sxAttrs(
                                  h,
                                  sidebarStyles.menuButton,
                                  buttonStyles.sizeIcon,
                                ),
                                h.AriaLabel('Close menu'),
                              ),
                              [xMarkIcon],
                            ),
                          ],
                        ),
                        Sidebar.nav(navigation, sidebarOptions),
                      ],
                    ),
                  ],
                ),
              ]
            : [],
        ),
    },
    toParentMessage: message => GotMobileMenuDialogMessage({ message }),
  })

  return {
    title: 'foldstylex · sidebar demo',
    body: h.div(
      elAttrs<Message>(sxAttrs(h, globalStyles.root, sidebarStyles.shell)),
      [
        Sidebar.desktop(navigation, sidebarOptions),
        mobileMenu,
        Sidebar.inset({
          headerChildren: [
            h.div(
              elAttrs<Message>(sxAttrs(h, sidebarStyles.insetHeaderInner)),
              [
                h.div(
                  elAttrs<Message>(
                    sxAttrs(h, sidebarStyles.mobileTrigger, sidebarStyles.mobileOnly),
                  ),
                  [
                    Button.view<Message>({
                      icon: panelLeftIcon,
                      size: 'iconSm',
                      variant: 'ghost',
                      onClick: ClickedOpenMobileMenu(),
                    }),
                  ],
                ),
                h.div(
                  elAttrs<Message>(sxAttrs(h, sidebarStyles.desktopTrigger)),
                  [
                    Button.view<Message>({
                      icon: panelLeftIcon,
                      size: 'iconSm',
                      variant: 'ghost',
                      onClick: ClickedSidebarTrigger(),
                    }),
                  ],
                ),
              ],
            ),
          ],
        }),
      ],
    ),
  }
}