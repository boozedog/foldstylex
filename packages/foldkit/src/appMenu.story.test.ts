import * as Story from 'foldkit/story'
import { describe, expect, it } from '@effect/vitest'

import {
  EndedSwipe,
  init,
  RequestedClose,
  RequestedOpen,
  StartedSwipe,
  update,
} from './appMenu.js'

const closed = init({ id: 'menu' })
const open = init({ id: 'menu', isOpen: true })

describe('AppMenu update', () => {
  it('opens and clears dragging on RequestedOpen', () => {
    Story.story(
      update,
      Story.with({ ...closed, isDragging: true }),
      Story.message(RequestedOpen({ role: 'button' })),
      Story.model(model => {
        expect(model.isOpen).toBe(true)
        expect(model.isDragging).toBe(false)
      }),
      Story.Command.expectNone(),
    )
  })

  it('closes and clears dragging on RequestedClose', () => {
    Story.story(
      update,
      Story.with({ ...open, isDragging: true }),
      Story.message(RequestedClose({ role: 'backdrop' })),
      Story.model(model => {
        expect(model.isOpen).toBe(false)
        expect(model.isDragging).toBe(false)
      }),
      Story.Command.expectNone(),
    )
  })

  it('tracks swipe drag lifecycle', () => {
    Story.story(
      update,
      Story.with(closed),
      Story.message(StartedSwipe()),
      Story.model(model => {
        expect(model.isDragging).toBe(true)
        expect(model.isOpen).toBe(false)
      }),
      Story.message(EndedSwipe()),
      Story.model(model => {
        expect(model.isDragging).toBe(false)
      }),
      Story.Command.expectNone(),
    )
  })
})