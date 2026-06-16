import { Disclosure } from '@foldkit/ui'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { sidebarStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export type SubNavItem<ParentMessage> = Readonly<{
  id: string
  label: string
  onClick: ParentMessage
}>

export type NavItem<ParentMessage> = Readonly<{
  id: string
  label: string
  icon?: Html
  onClick?: ParentMessage
  muted?: boolean
  subItems?: ReadonlyArray<SubNavItem<ParentMessage>>
  model?: Disclosure.Model
  toParentMessage?: (message: Disclosure.Message) => ParentMessage
}>

export type SidebarGroupConfig<ParentMessage> = Readonly<{
  id: string
  label: string
  items: ReadonlyArray<NavItem<ParentMessage>>
  activeItemId?: string
  activeSubItemId?: string
  model?: Disclosure.Model
  toParentMessage?: (message: Disclosure.Message) => ParentMessage
}>

export type SidebarBrandConfig = Readonly<{
  name: string
  subtitle?: string
  logo?: Html
  chevron?: Html
}>

export type SidebarUserConfig = Readonly<{
  name: string
  email: string
  avatarFallback: string
  chevron?: Html
}>

export type SidebarNavConfig<ParentMessage> = Readonly<{
  brand: SidebarBrandConfig
  groups: ReadonlyArray<SidebarGroupConfig<ParentMessage>>
  user?: SidebarUserConfig
}>

const menuButtonStyles = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  isActive: boolean,
  muted = false,
  large = false,
) =>
  sxAttrs(
    h,
    sidebarStyles.menuButton,
    large ? sidebarStyles.menuButtonLg : undefined,
    muted ? sidebarStyles.menuButtonMuted : undefined,
    isActive ? sidebarStyles.menuButtonActive : undefined,
  )

const menuItemChildren = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  item: NavItem<ParentMessage>,
  chevron?: Html,
  chevronOpen = false,
): ReadonlyArray<Html> => [
  ...(item.icon !== undefined
    ? [
        h.span(
          elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuButtonIcon)),
          [item.icon],
        ),
      ]
    : []),
  h.span(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuButtonLabel)),
    [item.label],
  ),
  ...(chevron !== undefined
    ? [
        h.span(
          elAttrs<ParentMessage>(
            sxAttrs(
              h,
              sidebarStyles.menuButtonChevron,
              chevronOpen ? sidebarStyles.menuButtonChevronOpen : undefined,
            ),
          ),
          [chevron],
        ),
      ]
    : []),
]

const subMenu = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  group: SidebarGroupConfig<ParentMessage>,
  subItems: ReadonlyArray<SubNavItem<ParentMessage>>,
): Html =>
  h.ul(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuSub)),
    subItems.map(subItem =>
      h.li(
        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuSubItem)),
        [
          h.button(
            elAttrs<ParentMessage>(
              h.OnClick(subItem.onClick),
              sxAttrs(
                h,
                sidebarStyles.menuSubButton,
                subItem.id === group.activeSubItemId
                  ? sidebarStyles.menuSubButtonActive
                  : undefined,
              ),
            ),
            [subItem.label],
          ),
        ],
      ),
    ),
  )

const renderCollapsibleMenuItem = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  group: SidebarGroupConfig<ParentMessage>,
  item: NavItem<ParentMessage> & {
    model: Disclosure.Model
    toParentMessage: (message: Disclosure.Message) => ParentMessage
    subItems: ReadonlyArray<SubNavItem<ParentMessage>>
  },
  chevron: Html,
): Html =>
  h.submodel({
    slotId: `${group.id}-${item.id}`,
    model: item.model,
    view: Disclosure.view,
    viewInputs: {
      toView: attributes =>
        h.li(
          elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuItem)),
          [
            h.button(
              elAttrs<ParentMessage>(
                attributes.button,
                menuButtonStyles(h, false),
              ),
              menuItemChildren(h, item, chevron, item.model.isOpen),
            ),
            ...(item.model.isOpen
              ? [h.div([...attributes.panel], [subMenu(h, group, item.subItems)])]
              : []),
          ],
        ),
    },
    toParentMessage: item.toParentMessage,
  })

const menuItemButton = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  item: NavItem<ParentMessage>,
  isActive: boolean,
): Html =>
  h.button(
    elAttrs<ParentMessage>(
      ...(item.onClick !== undefined ? [h.OnClick(item.onClick)] : []),
      menuButtonStyles(h, isActive, item.muted === true),
    ),
    menuItemChildren(h, item),
  )

const groupMenu = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  group: SidebarGroupConfig<ParentMessage>,
  chevron?: Html,
): Html =>
  h.ul(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menu)),
    group.items.map(item => {
      if (
        item.subItems !== undefined &&
        item.model !== undefined &&
        item.toParentMessage !== undefined &&
        chevron !== undefined
      ) {
        return renderCollapsibleMenuItem(h, group, {
          ...item,
          model: item.model,
          toParentMessage: item.toParentMessage,
          subItems: item.subItems,
        }, chevron)
      }

      return h.li(
        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuItem)),
        [
          menuItemButton(
            h,
            item,
            item.id === group.activeItemId,
          ),
        ],
      )
    }),
  )

const staticGroup = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  group: SidebarGroupConfig<ParentMessage>,
  chevron?: Html,
): Html =>
  h.div(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.group)),
    [
      h.div(
        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.groupLabel)),
        [group.label],
      ),
      groupMenu(h, group, chevron),
    ],
  )

const collapsibleGroup = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  group: SidebarGroupConfig<ParentMessage> & {
    model: Disclosure.Model
    toParentMessage: (message: Disclosure.Message) => ParentMessage
  },
  chevron?: Html,
): Html =>
  h.submodel({
    slotId: group.id,
    model: group.model,
    view: Disclosure.view,
    viewInputs: {
      toView: attributes =>
        h.div(
          elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.group)),
          [
            h.button(
              elAttrs<ParentMessage>(
                attributes.button,
                sxAttrs(h, sidebarStyles.groupLabelButton),
              ),
              [
                h.span(
                  elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.groupLabel)),
                  [group.label],
                ),
                h.span(
                  elAttrs<ParentMessage>(
                    sxAttrs(
                      h,
                      sidebarStyles.groupChevron,
                      group.model.isOpen
                        ? sidebarStyles.groupChevronOpen
                        : undefined,
                    ),
                  ),
                  ['▾'],
                ),
              ],
            ),
            group.model.isOpen
              ? h.div([...attributes.panel], [groupMenu(h, group, chevron)])
              : h.empty,
          ],
        ),
    },
    toParentMessage: group.toParentMessage,
  })

const brandHeader = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  brand: SidebarBrandConfig,
): Html =>
  h.div(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.header)),
    [
      h.ul(
        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menu)),
        [
          h.li(
            elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuItem)),
            [
              h.button(
                elAttrs<ParentMessage>(menuButtonStyles(h, false, false, true)),
                [
                  h.div(
                    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandLogo)),
                    brand.logo !== undefined ? [brand.logo] : [brand.name.charAt(0)],
                  ),
                  h.div(
                    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandText)),
                    [
                      h.span(
                        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandName)),
                        [brand.name],
                      ),
                      ...(brand.subtitle !== undefined
                        ? [
                            h.span(
                              elAttrs<ParentMessage>(
                                sxAttrs(h, sidebarStyles.brandSubtitle),
                              ),
                              [brand.subtitle],
                            ),
                          ]
                        : []),
                    ],
                  ),
                  ...(brand.chevron !== undefined
                    ? [
                        h.span(
                          elAttrs<ParentMessage>(
                            sxAttrs(h, sidebarStyles.menuButtonChevron),
                          ),
                          [brand.chevron],
                        ),
                      ]
                    : []),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )

const footerUser = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  user: SidebarUserConfig,
): Html =>
  h.div(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.footer)),
    [
      h.ul(
        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menu)),
        [
          h.li(
            elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuItem)),
            [
              h.button(
                elAttrs<ParentMessage>(menuButtonStyles(h, false, false, true)),
                [
                  h.div(
                    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.userAvatar)),
                    [user.avatarFallback],
                  ),
                  h.div(
                    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandText)),
                    [
                      h.span(
                        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandName)),
                        [user.name],
                      ),
                      h.span(
                        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandSubtitle)),
                        [user.email],
                      ),
                    ],
                  ),
                  ...(user.chevron !== undefined
                    ? [
                        h.span(
                          elAttrs<ParentMessage>(
                            sxAttrs(h, sidebarStyles.menuButtonChevron),
                          ),
                          [user.chevron],
                        ),
                      ]
                    : []),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )

const navLinks = <ParentMessage>(
  config: SidebarNavConfig<ParentMessage>,
  chevron?: Html,
): Html => {
  const h = html<ParentMessage>()

  return h.ul(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.groupList)),
    config.groups.map(group =>
      h.li(
        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.groupListItem)),
        [
          group.model !== undefined && group.toParentMessage !== undefined
            ? collapsibleGroup(h, {
                ...group,
                model: group.model,
                toParentMessage: group.toParentMessage,
              }, chevron)
            : staticGroup(h, group, chevron),
        ],
      ),
    ),
  )
}

const sidebarBody = <ParentMessage>(
  config: SidebarNavConfig<ParentMessage>,
  chevron?: Html,
): ReadonlyArray<Html> => {
  const h = html<ParentMessage>()

  return [
    brandHeader(h, config.brand),
    h.nav(
      elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.content)),
      [navLinks(config, chevron)],
    ),
    ...(config.user !== undefined ? [footerUser(h, config.user)] : []),
  ]
}

/** Renders the desktop sidebar column. */
export const desktop = <ParentMessage>(
  config: SidebarNavConfig<ParentMessage>,
  options?: Readonly<{ chevron?: Html }>,
): Html => {
  const h = html<ParentMessage>()

  return h.aside(
    elAttrs<ParentMessage>(
      h.AriaLabel('Sidebar'),
      sxAttrs(h, sidebarStyles.desktop, sidebarStyles.desktopVisible),
    ),
    sidebarBody(config, options?.chevron),
  )
}

export type SidebarInsetConfig<ParentMessage> = Readonly<{
  headerChildren: ReadonlyArray<Html>
  children?: Html
}>

/** Renders the main content area beside the sidebar. */
export const inset = <ParentMessage>(
  config: SidebarInsetConfig<ParentMessage>,
): Html => {
  const h = html<ParentMessage>()

  return h.main(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.inset)),
    [
      h.header(
        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.insetHeader)),
        config.headerChildren,
      ),
      ...(config.children !== undefined
        ? [h.div(elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.insetMain)), [config.children])]
        : [h.div(elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.insetMain)), [])]),
    ],
  )
}

/** Renders scrollable sidebar navigation links. */
export const nav = <ParentMessage>(
  config: SidebarNavConfig<ParentMessage>,
  options?: Readonly<{ chevron?: Html }>,
): Html => {
  const h = html<ParentMessage>()

  return h.div(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.mobileSheetPanel)),
    sidebarBody(config, options?.chevron),
  )
}