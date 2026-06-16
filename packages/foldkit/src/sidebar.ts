import { Disclosure } from '@foldkit/ui'
import type { Model as TooltipModel, Message as TooltipMessage } from '@foldkit/ui/tooltip'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { sidebarStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'
import * as StyledTooltip from './tooltip.js'

export type SubNavItem<ParentMessage> = Readonly<{
  id: string
  label: string
  onClick: ParentMessage
}>

export type SidebarNavTooltip<ParentMessage> = Readonly<{
  model: TooltipModel
  toParentMessage: (message: TooltipMessage) => ParentMessage
}>

export type NavItem<ParentMessage> = Readonly<{
  id: string
  label: string
  icon?: Html
  onClick?: ParentMessage
  muted?: boolean
  action?: Html
  subItems?: ReadonlyArray<SubNavItem<ParentMessage>>
  model?: Disclosure.Model
  toParentMessage?: (message: Disclosure.Message) => ParentMessage
  /** Shown to the right of the trigger in icon-collapsed mode. */
  tooltip?: SidebarNavTooltip<ParentMessage>
}>

export type SidebarGroupConfig<ParentMessage> = Readonly<{
  id: string
  label: string
  items: ReadonlyArray<NavItem<ParentMessage>>
  activeItemId?: string
  activeSubItemId?: string
  /** Hide the entire group in icon-collapsed mode (matches shadcn NavProjects). */
  hideWhenCollapsed?: boolean
  model?: Disclosure.Model
  toParentMessage?: (message: Disclosure.Message) => ParentMessage
}>

export type SidebarBrandConfig = Readonly<{
  name: string
  subtitle?: string
  logo?: Html
  chevron?: Html
  trigger?: Html
}>

export type SidebarUserConfig = Readonly<{
  name: string
  email: string
  avatarFallback: string
  chevron?: Html
  trigger?: Html
}>

export type SidebarNavConfig<ParentMessage> = Readonly<{
  brand: SidebarBrandConfig
  groups: ReadonlyArray<SidebarGroupConfig<ParentMessage>>
  user?: SidebarUserConfig
}>

export type SidebarOptions = Readonly<{
  chevron?: Html
  isCollapsed?: boolean
  /** Prefix for disclosure submodel slotIds when the same nav renders in multiple DOM positions (e.g. desktop + mobile). */
  slotPrefix?: string
}>

type SidebarCtx = Readonly<{
  chevron?: Html
  isCollapsed: boolean
  slotPrefix: string
}>

const submodelSlotId = (ctx: SidebarCtx, id: string): string =>
  ctx.slotPrefix === '' ? id : `${ctx.slotPrefix}-${id}`

const sidebarCtx = (options?: SidebarOptions): SidebarCtx => ({
  ...(options?.chevron !== undefined ? { chevron: options.chevron } : {}),
  isCollapsed: options?.isCollapsed === true,
  slotPrefix: options?.slotPrefix ?? '',
})

const menuStyles = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
) =>
  sxAttrs(
    h,
    sidebarStyles.menu,
    ctx.isCollapsed ? sidebarStyles.menuCollapsed : undefined,
  )

const menuButtonStyles = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  isActive: boolean,
  muted = false,
  large = false,
  withAction = false,
) =>
  sxAttrs(
    h,
    sidebarStyles.menuButton,
    large ? sidebarStyles.menuButtonLg : undefined,
    muted ? sidebarStyles.menuButtonMuted : undefined,
    withAction && !ctx.isCollapsed ? sidebarStyles.menuButtonWithAction : undefined,
    isActive ? sidebarStyles.menuButtonActive : undefined,
    ctx.isCollapsed ? sidebarStyles.menuButtonCollapsed : undefined,
    ctx.isCollapsed && large ? sidebarStyles.menuButtonLgCollapsed : undefined,
  )

const menuItemChildren = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  item: NavItem<ParentMessage>,
  chevron?: Html,
  chevronOpen = false,
): ReadonlyArray<Html> => [
  ...(item.icon !== undefined
    ? [
        h.span(
          elAttrs<ParentMessage>(
            sxAttrs(
              h,
              sidebarStyles.menuButtonIcon,
              item.muted === true ? sidebarStyles.menuButtonIconMuted : undefined,
            ),
          ),
          [item.icon],
        ),
      ]
    : []),
  h.span(
    elAttrs<ParentMessage>(
      sxAttrs(
        h,
        sidebarStyles.menuButtonLabel,
        ctx.isCollapsed ? sidebarStyles.collapseHidden : undefined,
      ),
    ),
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
              ctx.isCollapsed ? sidebarStyles.collapseHidden : undefined,
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
  ctx: SidebarCtx,
  group: SidebarGroupConfig<ParentMessage>,
  item: NavItem<ParentMessage> & {
    model: Disclosure.Model
    toParentMessage: (message: Disclosure.Message) => ParentMessage
    subItems: ReadonlyArray<SubNavItem<ParentMessage>>
  },
  chevron: Html,
): Html =>
  h.submodel({
    slotId: submodelSlotId(ctx, `${group.id}-${item.id}`),
    model: item.model,
    view: Disclosure.view,
    viewInputs: {
      toView: attributes =>
        h.li(
          elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuItem)),
          [
            menuItemTrigger(
              h,
              ctx,
              item,
              false,
              elAttrs<ParentMessage>(
                attributes.button,
                menuButtonStyles(h, ctx, false),
              ),
            ),
            h.div(
              elAttrs<ParentMessage>(
                sxAttrs(
                  h,
                  ctx.isCollapsed || !item.model.isOpen
                    ? sidebarStyles.collapseHidden
                    : undefined,
                ),
                [...attributes.panel],
              ),
              [subMenu(h, group, item.subItems)],
            ),
          ],
        ),
    },
    toParentMessage: item.toParentMessage,
  })

const tooltipEnabled = <ParentMessage>(
  ctx: SidebarCtx,
  item: NavItem<ParentMessage>,
): boolean => ctx.isCollapsed && item.tooltip !== undefined

const menuItemTrigger = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  item: NavItem<ParentMessage>,
  isActive: boolean,
  triggerAttributes: ReadonlyArray<unknown> = elAttrs<ParentMessage>(
    ...(item.onClick !== undefined ? [h.OnClick(item.onClick)] : []),
    menuButtonStyles(
      h,
      ctx,
      isActive,
      item.muted === true,
      false,
      item.action !== undefined,
    ),
  ),
): Html =>
  item.tooltip !== undefined
    ? StyledTooltip.wrapButton(h, {
        model: item.tooltip.model,
        label: item.label,
        enabled: tooltipEnabled(ctx, item),
        toParentMessage: item.tooltip.toParentMessage,
        triggerAttributes,
        triggerChildren: menuItemChildren(h, ctx, item),
      })
    : h.button(
        elAttrs<ParentMessage>(triggerAttributes),
        menuItemChildren(h, ctx, item),
      )

const menuItemButton = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  item: NavItem<ParentMessage>,
  isActive: boolean,
): Html => menuItemTrigger(h, ctx, item, isActive)

const groupMenu = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  group: SidebarGroupConfig<ParentMessage>,
): Html =>
  h.ul(
    elAttrs<ParentMessage>(menuStyles(h, ctx)),
    group.items.map(item => {
      if (
        item.subItems !== undefined &&
        item.model !== undefined &&
        item.toParentMessage !== undefined &&
        ctx.chevron !== undefined
      ) {
        return renderCollapsibleMenuItem(h, ctx, group, {
          ...item,
          model: item.model,
          toParentMessage: item.toParentMessage,
          subItems: item.subItems,
        }, ctx.chevron)
      }

      const menuButton = menuItemButton(
        h,
        ctx,
        item,
        item.id === group.activeItemId,
      )

      return h.li(
        elAttrs<ParentMessage>(
          ...(item.action !== undefined
            ? [h.DataAttribute('foldstylex-sidebar-menu-item', 'true')]
            : []),
          sxAttrs(
            h,
            sidebarStyles.menuItem,
            item.action !== undefined ? sidebarStyles.menuItemGroup : undefined,
          ),
        ),
        [
          menuButton,
          ...(item.action !== undefined ? [item.action] : []),
        ],
      )
    }),
  )

const groupStyles = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  group: SidebarGroupConfig<ParentMessage>,
) =>
  sxAttrs(
    h,
    sidebarStyles.group,
    ctx.isCollapsed && group.hideWhenCollapsed === true
      ? sidebarStyles.collapseHidden
      : undefined,
  )

const staticGroup = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  group: SidebarGroupConfig<ParentMessage>,
): Html =>
  h.div(
    elAttrs<ParentMessage>(groupStyles(h, ctx, group)),
    [
      h.div(
        elAttrs<ParentMessage>(
          sxAttrs(
            h,
            sidebarStyles.groupLabel,
            ctx.isCollapsed ? sidebarStyles.groupLabelCollapsed : undefined,
          ),
        ),
        [group.label],
      ),
      groupMenu(h, ctx, group),
    ],
  )

const collapsibleGroup = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  group: SidebarGroupConfig<ParentMessage> & {
    model: Disclosure.Model
    toParentMessage: (message: Disclosure.Message) => ParentMessage
  },
): Html =>
  h.submodel({
    slotId: submodelSlotId(ctx, group.id),
    model: group.model,
    view: Disclosure.view,
    viewInputs: {
      toView: attributes =>
        h.div(
          elAttrs<ParentMessage>(groupStyles(h, ctx, group)),
          [
            h.button(
              elAttrs<ParentMessage>(
                attributes.button,
                sxAttrs(h, sidebarStyles.groupLabelButton),
              ),
              [
                h.span(
                  elAttrs<ParentMessage>(
                    sxAttrs(
                      h,
                      sidebarStyles.groupLabel,
                      ctx.isCollapsed ? sidebarStyles.groupLabelCollapsed : undefined,
                    ),
                  ),
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
                      ctx.isCollapsed ? sidebarStyles.collapseHidden : undefined,
                    ),
                  ),
                  ['▾'],
                ),
              ],
            ),
            h.div(
              elAttrs<ParentMessage>(
                sxAttrs(
                  h,
                  ctx.isCollapsed || !group.model.isOpen
                    ? sidebarStyles.collapseHidden
                    : undefined,
                ),
                [...attributes.panel],
              ),
              [groupMenu(h, ctx, group)],
            ),
          ],
        ),
    },
    toParentMessage: group.toParentMessage,
  })

const brandHeader = <ParentMessage>(
  h: ReturnType<typeof html<ParentMessage>>,
  ctx: SidebarCtx,
  brand: SidebarBrandConfig,
): Html =>
  h.div(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.header)),
    [
      h.ul(
        elAttrs<ParentMessage>(menuStyles(h, ctx)),
        [
          h.li(
            elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuItem)),
            [
              brand.trigger !== undefined
                ? brand.trigger
                : h.button(
                    elAttrs<ParentMessage>(
                      menuButtonStyles(h, ctx, false, false, true),
                    ),
                    [
                      h.div(
                        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.brandLogo)),
                        brand.logo !== undefined ? [brand.logo] : [brand.name.charAt(0)],
                      ),
                      h.div(
                        elAttrs<ParentMessage>(
                          sxAttrs(
                            h,
                            sidebarStyles.brandText,
                            ctx.isCollapsed ? sidebarStyles.collapseHidden : undefined,
                          ),
                        ),
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
                                sxAttrs(
                                  h,
                                  sidebarStyles.menuButtonChevron,
                                  ctx.isCollapsed
                                    ? sidebarStyles.collapseHidden
                                    : undefined,
                                ),
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
  ctx: SidebarCtx,
  user: SidebarUserConfig,
): Html =>
  h.div(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.footer)),
    [
      h.ul(
        elAttrs<ParentMessage>(menuStyles(h, ctx)),
        [
          h.li(
            elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.menuItem)),
            [
              user.trigger !== undefined
                ? user.trigger
                : h.button(
                    elAttrs<ParentMessage>(
                      menuButtonStyles(h, ctx, false, false, true),
                    ),
                    [
                      h.div(
                        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.userAvatar)),
                        [user.avatarFallback],
                      ),
                      h.div(
                        elAttrs<ParentMessage>(
                          sxAttrs(
                            h,
                            sidebarStyles.brandText,
                            ctx.isCollapsed ? sidebarStyles.collapseHidden : undefined,
                          ),
                        ),
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
                                sxAttrs(
                                  h,
                                  sidebarStyles.menuButtonChevron,
                                  ctx.isCollapsed
                                    ? sidebarStyles.collapseHidden
                                    : undefined,
                                ),
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
  ctx: SidebarCtx,
): Html => {
  const h = html<ParentMessage>()

  return h.ul(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.groupList)),
    config.groups.map(group =>
      h.li(
        elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.groupListItem)),
        [
          group.model !== undefined && group.toParentMessage !== undefined
            ? collapsibleGroup(h, ctx, {
                ...group,
                model: group.model,
                toParentMessage: group.toParentMessage,
              })
            : staticGroup(h, ctx, group),
        ],
      ),
    ),
  )
}

const sidebarBody = <ParentMessage>(
  config: SidebarNavConfig<ParentMessage>,
  ctx: SidebarCtx,
): ReadonlyArray<Html> => {
  const h = html<ParentMessage>()

  return [
    brandHeader(h, ctx, config.brand),
    h.nav(
      elAttrs<ParentMessage>(
        sxAttrs(
          h,
          sidebarStyles.content,
          ctx.isCollapsed ? sidebarStyles.contentCollapsed : undefined,
        ),
      ),
      [navLinks(config, ctx)],
    ),
    ...(config.user !== undefined ? [footerUser(h, ctx, config.user)] : []),
  ]
}

/** Renders the desktop sidebar column. */
export const desktop = <ParentMessage>(
  config: SidebarNavConfig<ParentMessage>,
  options?: SidebarOptions,
): Html => {
  const h = html<ParentMessage>()
  const ctx = sidebarCtx(options)

  return h.aside(
    elAttrs<ParentMessage>(
      h.AriaLabel('Sidebar'),
      sxAttrs(
        h,
        sidebarStyles.desktop,
        sidebarStyles.desktopVisible,
        ctx.isCollapsed ? sidebarStyles.desktopCollapsed : undefined,
      ),
    ),
    sidebarBody(config, ctx),
  )
}

export type SidebarInsetConfig<ParentMessage> = Readonly<{
  headerChildren: ReadonlyArray<Html>
  children?: Html
  isCollapsed?: boolean
}>

/** Renders the main content area beside the sidebar. */
export const inset = <ParentMessage>(
  config: SidebarInsetConfig<ParentMessage>,
): Html => {
  const h = html<ParentMessage>()
  const isCollapsed = config.isCollapsed === true

  return h.main(
    elAttrs<ParentMessage>(
      sxAttrs(
        h,
        sidebarStyles.inset,
        isCollapsed ? sidebarStyles.insetCollapsed : undefined,
      ),
    ),
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
  options?: SidebarOptions,
): Html => {
  const h = html<ParentMessage>()

  return h.div(
    elAttrs<ParentMessage>(sxAttrs(h, sidebarStyles.mobileSheetPanel)),
    sidebarBody(config, sidebarCtx(options)),
  )
}