import { describe, expect, it } from '@effect/vitest'

import { submodelSlotId, tooltipEnabled } from './sidebar.js'
import { init as tooltipInit } from './tooltip.js'

const ctx = (isCollapsed: boolean, slotPrefix = '') => ({
  isCollapsed,
  slotPrefix,
})

describe('sidebar helpers', () => {
  describe('submodelSlotId', () => {
    it('returns the bare id without a slot prefix', () => {
      expect(submodelSlotId(ctx(false), 'playground')).toBe('playground')
    })

    it('prefixes the slot id for duplicate nav trees', () => {
      expect(submodelSlotId(ctx(false, 'mobile'), 'playground')).toBe(
        'mobile-playground',
      )
    })
  })

  describe('tooltipEnabled', () => {
    const itemWithTooltip = {
      id: 'playground',
      label: 'Playground',
      tooltip: {
        model: tooltipInit('tip'),
        toParentMessage: (message: unknown) => message,
      },
    }

    it('enables tooltips only in collapsed icon mode', () => {
      expect(tooltipEnabled(ctx(true), itemWithTooltip)).toBe(true)
      expect(tooltipEnabled(ctx(false), itemWithTooltip)).toBe(false)
    })

    it('returns false when the nav item has no tooltip config', () => {
      expect(
        tooltipEnabled(ctx(true), { id: 'playground', label: 'Playground' }),
      ).toBe(false)
    })
  })
})