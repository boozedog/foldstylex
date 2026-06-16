import { Predicate } from 'effect'
import { Button } from '@foldkit/ui'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { buttonStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'
export type ButtonSize = 'default' | 'sm' | 'icon' | 'iconSm'

export type ButtonViewConfig<ParentMessage> = Readonly<{
  label?: string
  icon?: Html
  onClick?: ParentMessage
  variant?: ButtonVariant
  size?: ButtonSize
  isDisabled?: boolean
}>

const variantStyle = (variant: ButtonVariant) => {
  switch (variant) {
    case 'secondary':
      return buttonStyles.variantSecondary
    case 'destructive':
      return buttonStyles.variantDestructive
    case 'ghost':
      return buttonStyles.variantGhost
    case 'outline':
      return buttonStyles.variantOutline
    case 'link':
      return buttonStyles.variantLink
    default:
      return buttonStyles.variantDefault
  }
}

const sizeStyle = (size: ButtonSize, variant: ButtonVariant) => {
  if (variant === 'link') {
    return undefined
  }

  switch (size) {
    case 'sm':
      return buttonStyles.sizeSm
    case 'icon':
      return buttonStyles.sizeIcon
    case 'iconSm':
      return buttonStyles.sizeIconSm
    default:
      return buttonStyles.sizeDefault
  }
}

/** Renders a shadcn-styled button using @foldkit/ui behavior. */
export const view = <ParentMessage>(
  config: ButtonViewConfig<ParentMessage>,
): Html => {
  const {
    label,
    icon,
    onClick,
    variant = 'default',
    size = 'default',
    isDisabled = false,
  } = config

  const toView = (
    attributes: Readonly<{ button: ReadonlyArray<Attribute<ParentMessage>> }>,
  ): Html => {
    const h = html<ParentMessage>()

    const children = [
      ...(icon !== undefined ? [icon] : []),
      ...(label !== undefined && label !== '' ? [label] : []),
    ]

    return h.button(
      elAttrs<ParentMessage>(
        attributes.button,
        sxAttrs(
          h,
          buttonStyles.base,
          variantStyle(variant),
          sizeStyle(size, variant),
        ),
      ),
      children,
    )
  }

  if (Predicate.isNotUndefined(onClick)) {
    return Button.view<ParentMessage>({ onClick, isDisabled, toView })
  }

  return Button.view<ParentMessage>({ isDisabled, toView })
}