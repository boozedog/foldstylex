import * as stylex from '@stylexjs/stylex'
import { Menu } from '@foldkit/ui'
import type { AnchorConfig, ViewInputs } from '@foldkit/ui/menu'
import type { Html } from 'foldkit/html'
import { childAttributes, html } from 'foldkit/html'

import { dropdownMenuStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export type DropdownMenuItemVariant = 'default' | 'destructive'

export type DropdownMenuItemSpec = Readonly<{
  label: string
  icon?: Html
  shortcut?: string
  variant?: DropdownMenuItemVariant
  iconBox?: boolean
  labelMuted?: boolean
}>

export type DropdownMenuStyledConfig<Item extends string, ParentMessage> = Readonly<{
  items: ReadonlyArray<Item>
  itemSpec: (item: Item) => DropdownMenuItemSpec
  buttonContent: Html
  buttonAttributes?: ReadonlyArray<unknown>
  anchor?: AnchorConfig
  itemGroupKey?: (item: Item, index: number) => string
  groupLabel?: (groupKey: string) => string | undefined
  isItemDisabled?: (item: Item, index: number) => boolean
  inline?: boolean
  wide?: boolean
  isAnimated?: boolean
}>

const menuAnimationClassName =
  'transition duration-100 ease-out data-[closed]:opacity-0 data-[closed]:scale-95'

const className = (
  ...styles: ReadonlyArray<stylex.StyleXStyles | false | undefined>
): string =>
  stylex.props(
    ...(styles.filter(Boolean) as ReadonlyArray<stylex.StyleXStyles>),
  ).className ?? ''

const itemClassName = (
  isActive: boolean,
  isDisabled: boolean,
  variant: DropdownMenuItemVariant,
  iconBox: boolean,
): string =>
  className(
    dropdownMenuStyles.item,
    iconBox ? dropdownMenuStyles.itemSpacious : undefined,
    !isDisabled ? dropdownMenuStyles.itemInteractive : undefined,
    isActive ? dropdownMenuStyles.itemActive : undefined,
    isDisabled ? dropdownMenuStyles.itemDisabled : undefined,
    variant === 'destructive' ? dropdownMenuStyles.itemDestructive : undefined,
  )

/** Builds styled Foldkit Menu view inputs with shadcn dropdown-menu visuals. */
export const styledViewInputs = <Item extends string, ParentMessage>(
  config: DropdownMenuStyledConfig<Item, ParentMessage>,
): ViewInputs<Item> => {
  const h = html<ParentMessage>()

  return {
    items: config.items,
    anchor: config.anchor ?? { placement: 'bottom-start', gap: 4, padding: 8 },
    buttonContent: config.buttonContent,
    ...(config.buttonAttributes !== undefined
      ? { buttonAttributes: childAttributes(config.buttonAttributes) }
      : {}),
    itemsClassName: [
      className(
        dropdownMenuStyles.content,
        config.wide === true ? dropdownMenuStyles.contentWide : undefined,
      ),
      config.isAnimated === true ? menuAnimationClassName : '',
    ]
      .filter(Boolean)
      .join(' '),
    backdropAttributes: childAttributes(
      sxAttrs(h, dropdownMenuStyles.backdrop),
    ),
    attributes: childAttributes(
      sxAttrs(
        h,
        dropdownMenuStyles.wrapper,
        config.inline === true ? dropdownMenuStyles.wrapperAction : undefined,
      ),
    ),
    separatorClassName: className(dropdownMenuStyles.separator),
    groupClassName: className(dropdownMenuStyles.group),
    ...(config.itemGroupKey !== undefined
      ? {
          itemGroupKey: config.itemGroupKey,
          groupToHeading: (groupKey: string) => {
            const label = config.groupLabel?.(groupKey)

            if (label === undefined) {
              return undefined
            }

            return {
              content: h.span([], [label]),
              className: className(dropdownMenuStyles.label),
            }
          },
        }
      : {}),
    ...(config.isItemDisabled !== undefined
      ? { isItemDisabled: config.isItemDisabled }
      : {}),
    itemToConfig: (item, { isActive, isDisabled }) => {
      const spec = config.itemSpec(item)
      const variant = spec.variant ?? 'default'
      const iconBox = spec.iconBox === true

      return {
        className: itemClassName(isActive, isDisabled, variant, iconBox),
        content: h.div(
          elAttrs<ParentMessage>(sxAttrs(h, dropdownMenuStyles.itemInner)),
          [
            ...(spec.icon !== undefined
              ? iconBox
                ? [
                    h.div(
                      elAttrs<ParentMessage>(sxAttrs(h, dropdownMenuStyles.iconBox)),
                      [
                        h.span(
                          elAttrs<ParentMessage>(
                            sxAttrs(
                              h,
                              spec.labelMuted === true
                                ? dropdownMenuStyles.iconInBoxLg
                                : dropdownMenuStyles.iconInBox,
                            ),
                          ),
                          [spec.icon],
                        ),
                      ],
                    ),
                  ]
                : [
                    h.span(
                      elAttrs<ParentMessage>(sxAttrs(h, dropdownMenuStyles.itemIcon)),
                      [spec.icon],
                    ),
                  ]
              : []),
            h.span(
              elAttrs<ParentMessage>(
                sxAttrs(
                  h,
                  dropdownMenuStyles.itemLabel,
                  spec.labelMuted === true
                    ? dropdownMenuStyles.itemLabelMuted
                    : undefined,
                ),
              ),
              [spec.label],
            ),
            ...(spec.shortcut !== undefined
              ? [
                  h.span(
                    elAttrs<ParentMessage>(sxAttrs(h, dropdownMenuStyles.shortcut)),
                    [spec.shortcut],
                  ),
                ]
              : []),
          ],
        ),
      }
    },
  }
}

/** Creates a typed dropdown menu pairing Foldkit Menu behavior with foldstylex styles. */
export const create = Menu.create

export const init = Menu.init