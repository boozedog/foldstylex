import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cardStyles } from '@foldstylex/styles'

import { elAttrs, sxAttrs } from './sx.js'

/** Renders a shadcn-styled card container. */
export const root = <ParentMessage>(children: ReadonlyArray<Html>): Html => {
  const h = html<ParentMessage>()

  return h.div(elAttrs<ParentMessage>(sxAttrs(h, cardStyles.root)), children)
}

/** Renders a card header block. */
export const header = <ParentMessage>(children: ReadonlyArray<Html>): Html => {
  const h = html<ParentMessage>()

  return h.div(elAttrs<ParentMessage>(sxAttrs(h, cardStyles.header)), children)
}

/** Renders a card title. */
export const title = <ParentMessage>(text: string): Html => {
  const h = html<ParentMessage>()

  return h.div(elAttrs<ParentMessage>(sxAttrs(h, cardStyles.title)), [text])
}

/** Renders a card description. */
export const description = <ParentMessage>(text: string): Html => {
  const h = html<ParentMessage>()

  return h.div(elAttrs<ParentMessage>(sxAttrs(h, cardStyles.description)), [text])
}

/** Renders a card content section. */
export const content = <ParentMessage>(children: ReadonlyArray<Html>): Html => {
  const h = html<ParentMessage>()

  return h.div(elAttrs<ParentMessage>(sxAttrs(h, cardStyles.content)), children)
}