import type * as stylex from '@stylexjs/stylex'

/** Empty compiled styles for Scene/Story tests — avoids StyleX runtime compilation. */
const s = {} as stylex.StyleXStyles

const styles = <const K extends string>(...keys: K[]): Record<K, stylex.StyleXStyles> =>
  Object.fromEntries(keys.map(key => [key, s])) as Record<K, stylex.StyleXStyles>

export const appMenuStyles = styles(
  'host',
  'mobileOnly',
  'hostInteractive',
  'hostClosed',
  'hostDragging',
  'layerIdle',
  'backdrop',
  'backdropVisible',
  'backdropDragging',
  'panel',
  'panelStart',
  'panelEnd',
  'panelOpen',
  'panelDragging',
  'panelHeader',
  'closeButton',
  'panelBody',
  'contentLocked',
)

export const sidebarStyles = styles(
  'shell',
  'desktop',
  'desktopCollapsed',
  'desktopVisible',
  'header',
  'content',
  'contentCollapsed',
  'groupList',
  'groupListItem',
  'footer',
  'group',
  'groupLabel',
  'groupLabelCollapsed',
  'collapseHidden',
  'groupLabelButton',
  'groupChevron',
  'groupChevronOpen',
  'menu',
  'menuCollapsed',
  'menuItem',
  'menuItemGroup',
  'menuAction',
  'menuButton',
  'menuButtonLg',
  'menuButtonCollapsed',
  'menuButtonLgCollapsed',
  'menuButtonInner',
  'menuButtonInnerCollapsed',
  'menuButtonWithAction',
  'menuButtonMuted',
  'menuButtonIconMuted',
  'menuButtonActive',
  'menuButtonIcon',
  'menuButtonLabel',
  'menuButtonChevron',
  'menuButtonChevronOpen',
  'menuSub',
  'menuSubItem',
  'menuSubButton',
  'menuSubButtonActive',
  'inset',
  'insetCollapsed',
  'insetHeader',
  'insetHeaderInner',
  'insetMain',
  'mobileTrigger',
  'desktopTrigger',
  'mobileSheet',
  'mobileSheetPanel',
  'mobileSheetHeader',
  'mobileOnly',
  'mobileOverlay',
  'brandLogo',
  'brandText',
  'brandName',
  'brandSubtitle',
  'userAvatar',
  'srOnly',
)

export const tooltipStyles = styles('wrapper', 'content', 'contentHidden')

export const avatarStyles = styles(
  'root',
  'rootLg',
  'sizeSm',
  'sizeDefault',
  'sizeLg',
  'image',
  'fallback',
  'fallbackSm',
)

export const badgeStyles = styles(
  'base',
  'variantDefault',
  'variantSecondary',
  'variantDestructive',
  'variantOutline',
)

export const buttonStyles = styles(
  'base',
  'variantDefault',
  'variantGhost',
  'variantOutline',
  'variantSecondary',
  'variantDestructive',
  'variantLink',
  'sizeDefault',
  'sizeSm',
  'sizeIcon',
  'sizeIconSm',
)

export const cardStyles = styles(
  'page',
  'pageInner',
  'pageHeader',
  'pageTitle',
  'pageDescription',
  'sectionStack',
  'row',
  'root',
  'header',
  'title',
  'description',
  'content',
)

export const checkboxStyles = styles(
  'root',
  'rootChecked',
  'rootIndeterminate',
  'indicator',
)

export const dialogStyles = styles(
  'dialog',
  'dialogOpen',
  'backdrop',
  'panel',
  'panelSm',
  'header',
  'footer',
  'title',
  'description',
  'close',
)

export const dropdownMenuStyles = styles(
  'wrapper',
  'wrapperAction',
  'content',
  'contentWide',
  'backdrop',
  'item',
  'itemSpacious',
  'itemInteractive',
  'itemActive',
  'itemDisabled',
  'itemDestructive',
  'itemIcon',
  'iconBox',
  'iconInBox',
  'iconInBoxLg',
  'itemLabel',
  'itemLabelMuted',
  'label',
  'separator',
  'shortcut',
  'group',
  'itemInner',
)

export const fieldStyles = styles(
  'field',
  'fieldRow',
  'fieldContent',
  'label',
  'description',
  'error',
)

export const globalStyles = styles('root', 'bodyReset', 'mutedText', 'pageTitle')

export const inputStyles = styles('input')

export const separatorStyles = styles('horizontal', 'vertical')

export const switchStyles = styles('root', 'rootChecked', 'thumb', 'thumbChecked')

export const tabsStyles = styles('root', 'list', 'trigger', 'triggerActive', 'content')

export const toastStyles = styles(
  'viewport',
  'entry',
  'entryDefault',
  'entrySuccess',
  'entryWarning',
  'entryError',
  'title',
  'description',
  'dismiss',
)