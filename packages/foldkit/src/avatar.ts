import * as stylex from '@stylexjs/stylex'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { avatarStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

export type AvatarSize = 'sm' | 'default' | 'lg'
export type AvatarShape = 'circle' | 'lg'

export type AvatarViewConfig = Readonly<{
  fallback: string
  imageSrc?: string
  imageAlt?: string
  size?: AvatarSize
  shape?: AvatarShape
}>

const sizeStyle = (size: AvatarSize) => {
  switch (size) {
    case 'sm':
      return avatarStyles.sizeSm
    case 'lg':
      return avatarStyles.sizeLg
    default:
      return avatarStyles.sizeDefault
  }
}

/** Renders a shadcn-styled avatar with optional image and text fallback. */
export const view = <ParentMessage>(config: AvatarViewConfig): Html => {
  const h = html<ParentMessage>()
  const size = config.size ?? 'default'
  const shape = config.shape ?? 'circle'

  return h.div(
    elAttrs<ParentMessage>(
      sxAttrs(
        h,
        avatarStyles.root,
        sizeStyle(size),
        shape === 'lg' ? avatarStyles.rootLg : undefined,
      ),
    ),
    [
      ...(config.imageSrc !== undefined
        ? [
            h.img([
              h.Class(stylex.props(avatarStyles.image).className ?? ''),
              h.Src(config.imageSrc),
              ...(config.imageAlt !== undefined ? [h.Alt(config.imageAlt)] : []),
            ]),
          ]
        : []),
      h.div(
        elAttrs<ParentMessage>(
          sxAttrs(
            h,
            avatarStyles.fallback,
            size === 'sm' ? avatarStyles.fallbackSm : undefined,
          ),
        ),
        [config.fallback],
      ),
    ],
  )
}