import { Match as M, Option, Schema as S } from 'effect'
import { Command, Runtime } from 'foldkit'
import type { Document } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'

import { Dialog, Disclosure, Menu, Tabs as UiTabs, Tooltip } from '@foldkit/ui'
import {
  Avatar,
  Checkbox,
  DropdownMenu,
  elAttrs,
  Button,
  Sidebar,
  Switch,
  Tooltip as SidebarTooltip,
  sxAttrs,
} from '@foldstylex/foldkit'
import { buttonStyles, globalStyles, sidebarStyles } from '@foldstylex/styles'

import * as kitchenSink from './kitchenSink.js'

import {
  audioWaveformIcon,
  badgeCheckIcon,
  bellIcon,
  bookOpenIcon,
  botIcon,
  chevronRightIcon,
  chevronsUpDownIcon,
  commandIcon,
  creditCardIcon,
  folderIcon,
  forwardIcon,
  frameIcon,
  galleryVerticalEndIcon,
  logOutIcon,
  mapIcon,
  moreHorizontalIcon,
  panelLeftIcon,
  pieChartIcon,
  plusIcon,
  settings2Icon,
  sparklesIcon,
  squareTerminalIcon,
  trash2Icon,
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

const PLATFORM_TOOLTIP_IDS = PLATFORM_DISCLOSURE_IDS
type PlatformTooltipId = PlatformDisclosureId

const PROJECT_IDS = [
  'design-engineering',
  'sales-marketing',
  'travel',
] as const

type ProjectId = (typeof PROJECT_IDS)[number]

const PLAYGROUND_SUB_IDS = ['history', 'starred', 'settings'] as const

const TEAM_IDS = ['acme-inc', 'acme-corp', 'evil-corp'] as const
type TeamId = (typeof TEAM_IDS)[number]

const TEAM_MENU_ITEMS = [...TEAM_IDS, 'add-team'] as const
type TeamMenuItem = (typeof TEAM_MENU_ITEMS)[number]

const USER_MENU_ITEMS = [
  'upgrade',
  'account',
  'billing',
  'notifications',
  'logout',
] as const
type UserMenuItem = (typeof USER_MENU_ITEMS)[number]

const PROJECT_MENU_ITEMS = ['view', 'share', 'delete'] as const
type ProjectMenuItem = (typeof PROJECT_MENU_ITEMS)[number]

const TEAMS = {
  'acme-inc': {
    name: 'Acme Inc',
    plan: 'Enterprise',
    logo: galleryVerticalEndIcon,
  },
  'acme-corp': {
    name: 'Acme Corp.',
    plan: 'Startup',
    logo: audioWaveformIcon,
  },
  'evil-corp': {
    name: 'Evil Corp.',
    plan: 'Free',
    logo: commandIcon,
  },
} as const satisfies Record<
  TeamId,
  Readonly<{ name: string; plan: string; logo: typeof galleryVerticalEndIcon }>
>

const TeamMenu = DropdownMenu.create<TeamMenuItem>()
const UserMenu = DropdownMenu.create<UserMenuItem>()
const ProjectMenu = DropdownMenu.create<ProjectMenuItem>()

export const Model = S.Struct({
  activeTeam: S.Literals(TEAM_IDS),
  activeProject: S.optional(S.Literals(PROJECT_IDS)),
  activePlaygroundSub: S.optional(S.Literals(PLAYGROUND_SUB_IDS)),
  platformPlayground: Disclosure.Model,
  platformModels: Disclosure.Model,
  platformDocumentation: Disclosure.Model,
  platformSettings: Disclosure.Model,
  teamMenu: Menu.Model,
  userMenu: Menu.Model,
  projectMenuDesign: Menu.Model,
  projectMenuSales: Menu.Model,
  projectMenuTravel: Menu.Model,
  mobileMenuDialog: Dialog.Model,
  emailValue: S.String,
  sidebarOpen: S.Boolean,
  sidebarTooltips: S.Struct({
    playground: Tooltip.Model,
    models: Tooltip.Model,
    documentation: Tooltip.Model,
    settings: Tooltip.Model,
  }),
  kitchenDialog: Dialog.Model,
  termsCheckbox: Checkbox.Model,
  marketingCheckbox: Checkbox.Model,
  notificationsSwitch: Switch.Model,
  kitchenTabs: UiTabs.Model,
  kitchenToast: kitchenSink.KitchenToast.Model,
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
export const GotTeamMenuMessage = m('GotTeamMenuMessage', {
  message: Menu.Message,
})
export const GotUserMenuMessage = m('GotUserMenuMessage', {
  message: Menu.Message,
})
export const GotProjectMenuMessage = m('GotProjectMenuMessage', {
  projectId: S.Literals(PROJECT_IDS),
  message: Menu.Message,
})
export const ClickedOpenMobileMenu = m('ClickedOpenMobileMenu')
export const ClickedSidebarTrigger = m('ClickedSidebarTrigger')
export const ClickedInertSubItem = m('ClickedInertSubItem')
export const GotMobileMenuDialogMessage = m('GotMobileMenuDialogMessage', {
  message: Dialog.Message,
})
export const GotSidebarTooltipMessage = m('GotSidebarTooltipMessage', {
  id: S.Literals(PLATFORM_TOOLTIP_IDS),
  message: Tooltip.Message,
})

export const Message = S.Union([
  ClickedProject,
  ClickedPlaygroundSub,
  GotPlatformDisclosureMessage,
  GotTeamMenuMessage,
  GotUserMenuMessage,
  GotProjectMenuMessage,
  ClickedOpenMobileMenu,
  ClickedSidebarTrigger,
  ClickedInertSubItem,
  GotMobileMenuDialogMessage,
  GotSidebarTooltipMessage,
  kitchenSink.UpdatedEmailValue,
  kitchenSink.ClickedOpenKitchenDialog,
  kitchenSink.GotKitchenDialogMessage,
  kitchenSink.GotTermsCheckboxMessage,
  kitchenSink.GotMarketingCheckboxMessage,
  kitchenSink.GotNotificationsSwitchMessage,
  kitchenSink.GotKitchenTabsMessage,
  kitchenSink.GotKitchenToastMessage,
  kitchenSink.ClickedShowInfoToast,
  kitchenSink.ClickedShowSuccessToast,
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

const projectMenuModel = (model: Model, projectId: ProjectId): Menu.Model => {
  switch (projectId) {
    case 'design-engineering':
      return model.projectMenuDesign
    case 'sales-marketing':
      return model.projectMenuSales
    case 'travel':
      return model.projectMenuTravel
  }
}

const withProjectMenu = (
  model: Model,
  projectId: ProjectId,
  menu: Menu.Model,
): Model =>
  evo(model, {
    projectMenuDesign: () =>
      projectId === 'design-engineering' ? menu : model.projectMenuDesign,
    projectMenuSales: () =>
      projectId === 'sales-marketing' ? menu : model.projectMenuSales,
    projectMenuTravel: () =>
      projectId === 'travel' ? menu : model.projectMenuTravel,
  })

const sidebarTooltipModel = (model: Model, id: PlatformTooltipId): Tooltip.Model =>
  model.sidebarTooltips[id]

const withSidebarTooltip = (
  model: Model,
  id: PlatformTooltipId,
  tooltip: Tooltip.Model,
): Model =>
  evo(model, {
    sidebarTooltips: () => ({
      ...model.sidebarTooltips,
      [id]: tooltip,
    }),
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

      ClickedSidebarTrigger: () => [
        evo(model, { sidebarOpen: () => !model.sidebarOpen }),
        [],
      ],

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

      GotTeamMenuMessage: ({ message: menuMessage }) => {
        const [nextMenu, commands, maybeOutMessage] = TeamMenu.update(
          model.teamMenu,
          menuMessage,
        )
        const mappedCommands = Command.mapMessages(commands, message =>
          GotTeamMenuMessage({ message }),
        )

        return Option.match(maybeOutMessage, {
          onNone: () => [
            evo(model, { teamMenu: () => nextMenu }),
            mappedCommands,
          ],
          onSome: M.type<Menu.OutMessage<TeamMenuItem>>().pipe(
            M.withReturnType<
              readonly [Model, ReadonlyArray<Command.Command<Message>>]
            >(),
            M.tagsExhaustive({
              Selected: ({ value }) => {
                if (value === 'add-team') {
                  return [evo(model, { teamMenu: () => nextMenu }), mappedCommands]
                }

                return [
                  evo(model, {
                    teamMenu: () => nextMenu,
                    activeTeam: () => value,
                  }),
                  mappedCommands,
                ]
              },
            }),
          ),
        })
      },

      GotUserMenuMessage: ({ message: menuMessage }) => {
        const [nextMenu, commands] = UserMenu.update(model.userMenu, menuMessage)

        return [
          evo(model, { userMenu: () => nextMenu }),
          Command.mapMessages(commands, message =>
            GotUserMenuMessage({ message }),
          ),
        ]
      },

      GotProjectMenuMessage: ({ projectId, message: menuMessage }) => {
        const [nextMenu, commands] = ProjectMenu.update(
          projectMenuModel(model, projectId),
          menuMessage,
        )

        return [
          withProjectMenu(model, projectId, nextMenu),
          Command.mapMessages(commands, message =>
            GotProjectMenuMessage({ projectId, message }),
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

      UpdatedEmailValue: ({ value }) => [
        evo(model, { emailValue: () => value }),
        [],
      ],

      ClickedOpenKitchenDialog: () => {
        const [nextKitchenDialog, kitchenDialogCommands] = Dialog.open(
          model.kitchenDialog,
        )

        return [
          evo(model, { kitchenDialog: () => nextKitchenDialog }),
          Command.mapMessages(kitchenDialogCommands, message =>
            kitchenSink.GotKitchenDialogMessage({ message }),
          ),
        ]
      },

      GotKitchenDialogMessage: ({ message: dialogMessage }) => {
        const [nextKitchenDialog, kitchenDialogCommands] = Dialog.update(
          model.kitchenDialog,
          dialogMessage,
        )

        return [
          evo(model, { kitchenDialog: () => nextKitchenDialog }),
          Command.mapMessages(kitchenDialogCommands, message =>
            kitchenSink.GotKitchenDialogMessage({ message }),
          ),
        ]
      },

      GotTermsCheckboxMessage: ({ message: checkboxMessage }) => {
        const [nextTermsCheckbox, termsCheckboxCommands] = Checkbox.update(
          model.termsCheckbox,
          checkboxMessage,
        )

        return [
          evo(model, { termsCheckbox: () => nextTermsCheckbox }),
          Command.mapMessages(termsCheckboxCommands, message =>
            kitchenSink.GotTermsCheckboxMessage({ message }),
          ),
        ]
      },

      GotMarketingCheckboxMessage: ({ message: checkboxMessage }) => {
        const [nextMarketingCheckbox, marketingCheckboxCommands] =
          Checkbox.update(model.marketingCheckbox, checkboxMessage)

        return [
          evo(model, { marketingCheckbox: () => nextMarketingCheckbox }),
          Command.mapMessages(marketingCheckboxCommands, message =>
            kitchenSink.GotMarketingCheckboxMessage({ message }),
          ),
        ]
      },

      GotNotificationsSwitchMessage: ({ message: switchMessage }) => {
        const [nextNotificationsSwitch, switchCommands] = Switch.update(
          model.notificationsSwitch,
          switchMessage,
        )

        return [
          evo(model, { notificationsSwitch: () => nextNotificationsSwitch }),
          Command.mapMessages(switchCommands, message =>
            kitchenSink.GotNotificationsSwitchMessage({ message }),
          ),
        ]
      },

      GotKitchenTabsMessage: ({ message: tabsMessage }) => {
        const [nextKitchenTabs, kitchenTabsCommands] =
          kitchenSink.KitchenTabs.update(model.kitchenTabs, tabsMessage)

        return [
          evo(model, { kitchenTabs: () => nextKitchenTabs }),
          Command.mapMessages(kitchenTabsCommands, message =>
            kitchenSink.GotKitchenTabsMessage({ message }),
          ),
        ]
      },

      GotKitchenToastMessage: ({ message: toastMessage }) => {
        const [nextKitchenToast, kitchenToastCommands] =
          kitchenSink.KitchenToast.update(model.kitchenToast, toastMessage)

        return [
          evo(model, { kitchenToast: () => nextKitchenToast }),
          Command.mapMessages(kitchenToastCommands, message =>
            kitchenSink.GotKitchenToastMessage({ message }),
          ),
        ]
      },

      ClickedShowInfoToast: () => {
        const [nextKitchenToast, kitchenToastCommands] =
          kitchenSink.KitchenToast.show(model.kitchenToast, {
            variant: 'Info',
            payload: {
              title: 'Changes saved',
              maybeDescription: Option.some(
                'Your preferences have been updated.',
              ),
            },
          })

        return [
          evo(model, { kitchenToast: () => nextKitchenToast }),
          Command.mapMessages(kitchenToastCommands, message =>
            kitchenSink.GotKitchenToastMessage({ message }),
          ),
        ]
      },

      ClickedShowSuccessToast: () => {
        const [nextKitchenToast, kitchenToastCommands] =
          kitchenSink.KitchenToast.show(model.kitchenToast, {
            variant: 'Success',
            payload: {
              title: 'Uploaded successfully',
              maybeDescription: Option.some('kit-manual.pdf is now available.'),
            },
          })

        return [
          evo(model, { kitchenToast: () => nextKitchenToast }),
          Command.mapMessages(kitchenToastCommands, message =>
            kitchenSink.GotKitchenToastMessage({ message }),
          ),
        ]
      },

      GotSidebarTooltipMessage: ({ id, message: tooltipMessage }) => {
        const [nextTooltip, tooltipCommands] = Tooltip.update(
          sidebarTooltipModel(model, id),
          tooltipMessage,
        )

        return [
          withSidebarTooltip(model, id, nextTooltip),
          Command.mapMessages(tooltipCommands, message =>
            GotSidebarTooltipMessage({ id, message }),
          ),
        ]
      },
    }),
  )

// INIT

export const init: Runtime.ApplicationInit<Model, Message> = () => [
  {
    activeTeam: 'acme-inc',
    platformPlayground: Disclosure.init({ id: 'platform-playground', isOpen: true }),
    platformModels: Disclosure.init({ id: 'platform-models' }),
    platformDocumentation: Disclosure.init({ id: 'platform-documentation' }),
    platformSettings: Disclosure.init({ id: 'platform-settings' }),
    teamMenu: DropdownMenu.init({ id: 'team-menu', isAnimated: true }),
    userMenu: DropdownMenu.init({ id: 'user-menu', isAnimated: true }),
    projectMenuDesign: DropdownMenu.init({
      id: 'project-menu-design',
      isAnimated: true,
    }),
    projectMenuSales: DropdownMenu.init({
      id: 'project-menu-sales',
      isAnimated: true,
    }),
    projectMenuTravel: DropdownMenu.init({
      id: 'project-menu-travel',
      isAnimated: true,
    }),
    mobileMenuDialog: Dialog.init({ id: 'mobile-menu' }),
    emailValue: '',
    sidebarOpen: true,
    sidebarTooltips: {
      playground: SidebarTooltip.init('sidebar-tooltip-playground'),
      models: SidebarTooltip.init('sidebar-tooltip-models'),
      documentation: SidebarTooltip.init('sidebar-tooltip-documentation'),
      settings: SidebarTooltip.init('sidebar-tooltip-settings'),
    },
    kitchenDialog: Dialog.init({ id: 'kitchen-dialog' }),
    termsCheckbox: Checkbox.init({ id: 'terms-checkbox' }),
    marketingCheckbox: Checkbox.init({
      id: 'marketing-checkbox',
      isChecked: true,
    }),
    notificationsSwitch: Switch.init({ id: 'notifications-switch' }),
    kitchenTabs: UiTabs.init({ id: 'kitchen-tabs' }),
    kitchenToast: kitchenSink.KitchenToast.init({ id: 'kitchen-toast' }),
  },
  [],
]

// VIEW

const sidebarMenuButtonAttrs = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  isCollapsed: boolean,
) =>
  sxAttrs(
    h,
    sidebarStyles.menuButton,
    sidebarStyles.menuButtonLg,
    isCollapsed ? sidebarStyles.menuButtonCollapsed : undefined,
    isCollapsed ? sidebarStyles.menuButtonLgCollapsed : undefined,
  )

const teamButtonContent = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  team: (typeof TEAMS)[TeamId],
  isCollapsed: boolean,
) =>
  h.div(
    elAttrs<ParentMessage>(
      sxAttrs(
        h,
        sidebarStyles.menuButtonInner,
        isCollapsed ? sidebarStyles.menuButtonInnerCollapsed : undefined,
      ),
    ),
    [
      h.div(elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandLogo)), [team.logo]),
      h.div(
        elAttrs<ParentMessage>(
          sxAttrs(
            h,
            sidebarStyles.brandText,
            isCollapsed ? sidebarStyles.collapseHidden : undefined,
          ),
        ),
        [
          h.span(elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandName)), [
            team.name,
          ]),
          h.span(
            elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandSubtitle)),
            [team.plan],
          ),
        ],
      ),
      h.span(
        elAttrs<ParentMessage>(
          sxAttrs(
            h,
            sidebarStyles.menuButtonChevron,
            isCollapsed ? sidebarStyles.collapseHidden : undefined,
          ),
        ),
        [chevronsUpDownIcon],
      ),
    ],
  )

const teamMenuViewInputs = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  team: (typeof TEAMS)[TeamId],
  isCollapsed: boolean,
) =>
  DropdownMenu.styledViewInputs<TeamMenuItem, ParentMessage>({
    wide: true,
    isAnimated: true,
    anchor: { placement: 'right-start', gap: 4, padding: 8 },
    items: TEAM_MENU_ITEMS,
    buttonContent: teamButtonContent(h, team, isCollapsed),
    buttonAttributes: sidebarMenuButtonAttrs(h, isCollapsed),
    itemGroupKey: item => (item === 'add-team' ? 'actions' : 'teams'),
    groupLabel: groupKey =>
      groupKey === 'teams' ? 'Teams' : undefined,
    itemSpec: item => {
      if (item === 'add-team') {
        return {
          label: 'Add team',
          icon: plusIcon,
          iconBox: true,
          labelMuted: true,
        }
      }

      const teamEntry = TEAMS[item]
      return {
        label: teamEntry.name,
        icon: teamEntry.logo,
        iconBox: true,
        shortcut: `⌘${TEAM_IDS.indexOf(item) + 1}`,
      }
    },
  })

const userMenuViewInputs = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  isCollapsed: boolean,
) =>
  DropdownMenu.styledViewInputs<UserMenuItem, ParentMessage>({
    wide: true,
    isAnimated: true,
    anchor: { placement: 'right-end', gap: 4, padding: 8 },
    items: USER_MENU_ITEMS,
    buttonContent: h.div(
      elAttrs<ParentMessage>(
        sxAttrs(
          h,
          sidebarStyles.menuButtonInner,
          isCollapsed ? sidebarStyles.menuButtonInnerCollapsed : undefined,
        ),
      ),
      [
        Avatar.view({
          fallback: 'CN',
          imageSrc: 'https://ui.shadcn.com/avatars/shadcn.jpg',
          imageAlt: 'shadcn',
          size: 'default',
          shape: 'lg',
        }),
        h.div(
          elAttrs<ParentMessage>(
            sxAttrs(
              h,
              sidebarStyles.brandText,
              isCollapsed ? sidebarStyles.collapseHidden : undefined,
            ),
          ),
          [
            h.span(elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandName)), [
              'shadcn',
            ]),
            h.span(
              elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandSubtitle)),
              ['m@example.com'],
            ),
          ],
        ),
        h.span(
          elAttrs<ParentMessage>(
            sxAttrs(
              h,
              sidebarStyles.menuButtonChevron,
              isCollapsed ? sidebarStyles.collapseHidden : undefined,
            ),
          ),
          [chevronsUpDownIcon],
        ),
      ],
    ),
    buttonAttributes: sidebarMenuButtonAttrs(h, isCollapsed),
    itemGroupKey: item =>
      item === 'upgrade'
        ? 'upgrade'
        : item === 'logout'
          ? 'logout'
          : 'account',
    itemSpec: item =>
      M.value(item).pipe(
        M.when('upgrade', () => ({ label: 'Upgrade to Pro', icon: sparklesIcon })),
        M.when('account', () => ({ label: 'Account', icon: badgeCheckIcon })),
        M.when('billing', () => ({ label: 'Billing', icon: creditCardIcon })),
        M.when('notifications', () => ({ label: 'Notifications', icon: bellIcon })),
        M.when('logout', () => ({ label: 'Log out', icon: logOutIcon })),
        M.exhaustive,
      ),
  })

const projectMenuViewInputs = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
) =>
  DropdownMenu.styledViewInputs<ProjectMenuItem, ParentMessage>({
    inline: true,
    isAnimated: true,
    anchor: { placement: 'right-start', gap: 4, padding: 8 },
    items: PROJECT_MENU_ITEMS,
    buttonContent: moreHorizontalIcon,
    buttonAttributes: [
      ...sxAttrs(h, sidebarStyles.menuAction),
      h.DataAttribute('foldstylex-sidebar-menu-action', 'true'),
      h.AriaLabel('More'),
    ],
    itemGroupKey: item => (item === 'delete' ? 'danger' : 'actions'),
    itemSpec: item =>
      M.value(item).pipe(
        M.when('view', () => ({ label: 'View Project', icon: folderIcon })),
        M.when('share', () => ({ label: 'Share Project', icon: forwardIcon })),
        M.when('delete', () => ({
          label: 'Delete Project',
          icon: trash2Icon,
          variant: 'destructive' as const,
        })),
        M.exhaustive,
      ),
  })

const projectMenu = (
  h: ReturnType<typeof html<Message>>,
  model: Model,
  projectId: ProjectId,
  slotPrefix: string,
) =>
  h.submodel({
    slotId: `${slotPrefix}-${projectMenuModel(model, projectId).id}`,
    model: projectMenuModel(model, projectId),
    view: ProjectMenu.view,
    viewInputs: projectMenuViewInputs(h),
    toParentMessage: message => GotProjectMenuMessage({ projectId, message }),
  })

type NavConfigOptions = Readonly<{
  slotPrefix: string
  isCollapsed: boolean
}>

const navTooltip = (
  model: Model,
  id: PlatformTooltipId,
): Sidebar.SidebarNavTooltip<Message> => ({
  model: sidebarTooltipModel(model, id),
  toParentMessage: message => GotSidebarTooltipMessage({ id, message }),
})

const navConfig = (
  model: Model,
  h: ReturnType<typeof html<Message>>,
  { slotPrefix, isCollapsed }: NavConfigOptions,
): Sidebar.SidebarNavConfig<Message> => {
  const activeTeam = TEAMS[model.activeTeam]
  const withTooltip = slotPrefix === 'desktop'
  return {
    brand: {
      name: activeTeam.name,
      subtitle: activeTeam.plan,
      logo: activeTeam.logo,
      chevron: chevronsUpDownIcon,
      trigger: h.submodel({
        slotId: `${slotPrefix}-${model.teamMenu.id}`,
        model: model.teamMenu,
        view: TeamMenu.view,
        viewInputs: teamMenuViewInputs(h, activeTeam, isCollapsed),
        toParentMessage: message => GotTeamMenuMessage({ message }),
      }),
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
            ...(withTooltip ? { tooltip: navTooltip(model, 'playground') } : {}),
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
            ...(withTooltip ? { tooltip: navTooltip(model, 'models') } : {}),
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
            ...(withTooltip ? { tooltip: navTooltip(model, 'documentation') } : {}),
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
            ...(withTooltip ? { tooltip: navTooltip(model, 'settings') } : {}),
          },
        ],
      },
      {
        id: 'projects',
        label: 'Projects',
        hideWhenCollapsed: true,
        ...(model.activeProject !== undefined
          ? { activeItemId: model.activeProject }
          : {}),
        items: [
          {
            id: 'design-engineering',
            label: 'Design Engineering',
            icon: frameIcon,
            onClick: ClickedProject({ id: 'design-engineering' }),
            action: projectMenu(h, model, 'design-engineering', slotPrefix),
          },
          {
            id: 'sales-marketing',
            label: 'Sales & Marketing',
            icon: pieChartIcon,
            onClick: ClickedProject({ id: 'sales-marketing' }),
            action: projectMenu(h, model, 'sales-marketing', slotPrefix),
          },
          {
            id: 'travel',
            label: 'Travel',
            icon: mapIcon,
            onClick: ClickedProject({ id: 'travel' }),
            action: projectMenu(h, model, 'travel', slotPrefix),
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
      trigger: h.submodel({
        slotId: `${slotPrefix}-${model.userMenu.id}`,
        model: model.userMenu,
        view: UserMenu.view,
        viewInputs: userMenuViewInputs(h, isCollapsed),
        toParentMessage: message => GotUserMenuMessage({ message }),
      }),
    },
  }
}

export const view = (model: Model): Document => {
  const h = html<Message>()
  const isCollapsed = !model.sidebarOpen
  const desktopNavigation = navConfig(model, h, {
    slotPrefix: 'desktop',
    isCollapsed,
  })
  const mobileNavigation = navConfig(model, h, {
    slotPrefix: 'mobile',
    isCollapsed: false,
  })
  const sidebarOptions = {
    chevron: chevronRightIcon,
    isCollapsed,
    slotPrefix: 'desktop',
  }
  const mobileSidebarOptions = {
    chevron: chevronRightIcon,
    slotPrefix: 'mobile',
  }

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
                        Sidebar.nav(mobileNavigation, mobileSidebarOptions),
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
        Sidebar.desktop(desktopNavigation, sidebarOptions),
        mobileMenu,
        Sidebar.inset({
          children: kitchenSink.view(model),
          isCollapsed,
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