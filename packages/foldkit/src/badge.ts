import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { badgeStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export type BadgeViewConfig = Readonly<{
  label: string
  variant?: BadgeVariant
}>

const variantStyle = (variant: BadgeVariant) => {
  switch (variant) {
    case 'secondary':
      return badgeStyles.variantSecondary
    case 'destructive':
      return badgeStyles.variantDestructive
    case 'outline':
      return badgeStyles.variantOutline
    default:
      return badgeStyles.variantDefault
  }
}

/** Renders a shadcn-styled badge. */
export const view = <ParentMessage>(config: BadgeViewConfig): Html => {
  const h = html<ParentMessage>()
  const variant = config.variant ?? 'default'

  return h.span(
    elAttrs<ParentMessage>(
      sxAttrs(h, badgeStyles.base, variantStyle(variant)),
    ),
    [config.label],
  )
}