import * as stylex from '@stylexjs/stylex'
import type { Attribute, ChildAttribute } from 'foldkit/html'

export type ElementAttribute<Message> = Attribute<Message> | ChildAttribute

/** Merges attribute groups for Foldkit element constructors. */
export const elAttrs = <Message>(
  ...parts: ReadonlyArray<unknown>
): ReadonlyArray<Attribute<Message> | ChildAttribute> => {
  const merged: Array<Attribute<Message> | ChildAttribute> = []

  for (const part of parts) {
    if (Array.isArray(part)) {
      merged.push(
        ...(part as ReadonlyArray<Attribute<Message> | ChildAttribute>),
      )
    } else {
      merged.push(part as Attribute<Message> | ChildAttribute)
    }
  }

  return merged
}

/** @deprecated Use `elAttrs` for element constructor attribute arrays. */
export const attrs = elAttrs

/** Converts StyleX styles into Foldkit `Class` and `Style` attributes. */
export const sxAttrs = <Message>(
  h: {
    Class: (value: string) => Attribute<Message>
    Style: (value: Record<string, string>) => Attribute<Message>
  },
  ...styles: ReadonlyArray<stylex.StyleXStyles | stylex.CompiledStyles>
): ReadonlyArray<Attribute<Message>> => {
  const { className, style } = stylex.props(
    ...(styles as ReadonlyArray<stylex.StyleXStyles>),
  )
  const attributes: Array<Attribute<Message>> = []

  if (className !== undefined && className !== '') {
    attributes.push(h.Class(className))
  }

  if (style !== undefined && Object.keys(style).length > 0) {
    attributes.push(h.Style(style as Record<string, string>))
  }

  return attributes as ReadonlyArray<Attribute<Message>>
}