import type * as stylex from '@stylexjs/stylex'
import { html } from 'foldkit/html'
import { describe, expect, it } from '@effect/vitest'

import { elAttrs, sxAttrs } from './sx.js'

const emptyStyle = {} as stylex.StyleXStyles

describe('sx', () => {
  describe('elAttrs', () => {
    it('flattens nested attribute arrays', () => {
      const h = html<never>()
      const merged = elAttrs(
        h.Id('field'),
        [h.Class('one'), h.Class('two')],
        h.AriaLabel('Label'),
      )

      expect(merged).toHaveLength(4)
    })
  })

  describe('sxAttrs', () => {
    it('omits class and style attributes when styles resolve empty', () => {
      const h = html<never>()
      const attributes = sxAttrs(h, emptyStyle)

      expect(attributes).toHaveLength(0)
    })
  })
})