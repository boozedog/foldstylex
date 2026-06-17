import { describe, expect, it } from '@effect/vitest'

import {
  checkEdgeSide,
  computeDelta,
  isOpeningFromEdge,
  resolveGestureDispatch,
  shouldCompleteGesture,
  shouldOpenAfterGesture,
} from './appMenuGesture.js'

const VIEWPORT = 390

describe('appMenuGesture', () => {
  describe('checkEdgeSide', () => {
    it('detects the start edge within maxEdgeStart', () => {
      expect(checkEdgeSide(20, 'start', 50, VIEWPORT)).toBe(true)
      expect(checkEdgeSide(51, 'start', 50, VIEWPORT)).toBe(false)
    })

    it('detects the end edge within maxEdgeStart', () => {
      expect(checkEdgeSide(370, 'end', 50, VIEWPORT)).toBe(true)
      expect(checkEdgeSide(300, 'end', 50, VIEWPORT)).toBe(false)
    })
  })

  describe('computeDelta', () => {
    it('measures positive drag when opening from the start edge', () => {
      expect(computeDelta(80, false, 'start')).toBe(80)
    })

    it('ignores drag in the closing direction from a closed start menu', () => {
      expect(computeDelta(-80, false, 'start')).toBe(0)
    })
  })

  describe('shouldOpenAfterGesture', () => {
    it('opens when a closed menu completes the gesture', () => {
      expect(shouldOpenAfterGesture(false, true)).toBe(true)
    })

    it('stays open when an open menu completes the gesture', () => {
      expect(shouldOpenAfterGesture(true, true)).toBe(false)
    })

    it('reopens when an open menu cancels the gesture', () => {
      expect(shouldOpenAfterGesture(true, false)).toBe(true)
    })
  })

  describe('shouldCompleteGesture', () => {
    it('completes an edge open when drag passes half width', () => {
      expect(
        shouldCompleteGesture(200, 200, 300, 0, false, 'start'),
      ).toBe(true)
    })
  })

  describe('resolveGestureDispatch', () => {
    it('dispatches open when the menu should open and DOM is still closed', () => {
      expect(resolveGestureDispatch(true, false, false)).toBe('open')
    })

    it('dispatches open on edge intent while data-open is still true after × close', () => {
      expect(resolveGestureDispatch(true, true, true)).toBe('open')
    })

    it('does not dispatch open when already open without edge intent', () => {
      expect(resolveGestureDispatch(true, true, false)).toBe('none')
    })

    it('dispatches close when the gesture dismisses an open menu', () => {
      expect(resolveGestureDispatch(false, true, false)).toBe('close')
    })
  })

  describe('isOpeningFromEdge', () => {
    it('detects edge open intent after a rightward swipe from the start edge', () => {
      expect(
        isOpeningFromEdge(10, 60, 'start', 50, true, VIEWPORT),
      ).toBe(true)
    })

    it('ignores edge open when the swipe is too small', () => {
      expect(
        isOpeningFromEdge(10, 5, 'start', 50, true, VIEWPORT),
      ).toBe(false)
    })
  })
})