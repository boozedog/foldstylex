import { Effect, Match as M, Option, Queue, Schema as S, Stream } from 'effect'
import type { Command } from 'foldkit/command'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import * as Mount from 'foldkit/mount'
import { evo } from 'foldkit/struct'
import { defineView } from 'foldkit/submodel'

import { appMenuStyles } from '@foldstylex/styles'

import {
  type AppMenuSide,
  checkEdgeSide,
  computeDelta,
  GESTURE_THRESHOLD,
  isOpeningFromEdge,
  resolveGestureDispatch,
  shouldCompleteGesture,
  shouldOpenAfterGesture,
} from './appMenuGesture.js'
import { elAttrs, sxAttrs } from './sx.js'

// MODEL

export const Model = S.Struct({
  id: S.String,
  isOpen: S.Boolean,
  isDragging: S.Boolean,
})

export type Model = typeof Model.Type

// MESSAGE

export const RequestedOpen = m('RequestedOpen', {
  role: S.optional(S.Literals(['button', 'gesture'] as const)),
})

export const RequestedClose = m('RequestedClose', {
  role: S.optional(S.Literals(['backdrop', 'escape', 'gesture'] as const)),
})

export const StartedSwipe = m('StartedSwipe')

export const EndedSwipe = m('EndedSwipe')

export const Message = S.Union([
  RequestedOpen,
  RequestedClose,
  StartedSwipe,
  EndedSwipe,
])

export type Message = typeof Message.Type

export type CloseRole = 'backdrop' | 'escape' | 'gesture'

// INIT

export const init = (
  config: Readonly<{ id: string; isOpen?: boolean }>,
): Model => ({
  id: config.id,
  isOpen: config.isOpen ?? false,
  isDragging: false,
})

// UPDATE

export const update = (
  model: Model,
  message: Message,
): readonly [Model, ReadonlyArray<Command<Message>>] =>
  M.value(message).pipe(
    M.withReturnType<readonly [Model, ReadonlyArray<Command<Message>>]>(),
    M.tagsExhaustive({
      RequestedOpen: () => [
        evo(model, { isOpen: () => true, isDragging: () => false }),
        [],
      ],
      RequestedClose: () => [
        evo(model, { isOpen: () => false, isDragging: () => false }),
        [],
      ],
      StartedSwipe: () => [evo(model, { isDragging: () => true }), []],
      EndedSwipe: () => [evo(model, { isDragging: () => false }), []],
    }),
  )

export const open = (
  model: Model,
): readonly [Model, ReadonlyArray<Command<Message>>] =>
  update(model, RequestedOpen({ role: 'button' }))

export const close = (
  model: Model,
): readonly [Model, ReadonlyArray<Command<Message>>] =>
  update(model, RequestedClose({}))

export const toggle = (
  model: Model,
): readonly [Model, ReadonlyArray<Command<Message>>] =>
  model.isOpen ? close(model) : open(model)

// GESTURE

const PANEL_SELECTOR = '[data-app-menu-panel]'
const BACKDROP_SELECTOR = '[data-app-menu-backdrop]'
const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, label, summary, [role="button"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'
const IOS_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'
const GESTURE_TRANSITION_MS = 300

const isMobileViewport = (): boolean =>
  window.matchMedia('(max-width: 767px)').matches

const isEndSide = (side: AppMenuSide): boolean => side === 'end'

const readIsOpen = (host: Element): boolean => host.hasAttribute('data-open')

const isInteractivePointerTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false
  }

  return target.closest(INTERACTIVE_SELECTOR) !== null
}

const applyGestureStyles = (
  panel: HTMLElement,
  backdrop: HTMLElement,
  progress: number,
  side: AppMenuSide,
): void => {
  const width = panel.getBoundingClientRect().width
  const offset = (1 - progress) * width
  panel.style.transitionProperty = 'none'
  backdrop.style.transitionProperty = 'none'

  if (isEndSide(side)) {
    panel.style.transform = `translateX(${offset}px)`
  } else {
    panel.style.transform = `translateX(${-offset}px)`
  }

  backdrop.style.opacity = String(progress * 0.25)
}

const clearGestureStyles = (panel: HTMLElement, backdrop: HTMLElement): void => {
  panel.style.removeProperty('transition')
  panel.style.removeProperty('transition-property')
  panel.style.removeProperty('transition-duration')
  panel.style.removeProperty('transition-timing-function')
  panel.style.removeProperty('transform')
  backdrop.style.removeProperty('transition')
  backdrop.style.removeProperty('transition-property')
  backdrop.style.removeProperty('transition-duration')
  backdrop.style.removeProperty('transition-timing-function')
  backdrop.style.removeProperty('opacity')
}

const animateGestureFinish = (
  panel: HTMLElement,
  backdrop: HTMLElement,
  side: AppMenuSide,
  shouldOpen: boolean,
): (() => void) => {
  panel.style.transitionProperty = 'transform'
  panel.style.transitionDuration = `${GESTURE_TRANSITION_MS}ms`
  panel.style.transitionTimingFunction = IOS_EASING
  backdrop.style.transitionProperty = 'opacity'
  backdrop.style.transitionDuration = `${GESTURE_TRANSITION_MS}ms`
  backdrop.style.transitionTimingFunction = IOS_EASING

  if (isEndSide(side)) {
    panel.style.transform = shouldOpen ? 'translateX(0)' : 'translateX(100%)'
  } else {
    panel.style.transform = shouldOpen ? 'translateX(0)' : 'translateX(-100%)'
  }

  backdrop.style.opacity = shouldOpen ? '0.25' : '0'

  let cleared = false
  const finishCleanup = (): void => {
    if (cleared) {
      return
    }
    cleared = true
    panel.removeEventListener('transitionend', onTransitionEnd)
    backdrop.removeEventListener('transitionend', onTransitionEnd)
    clearTimeout(fallbackTimer)
    clearGestureStyles(panel, backdrop)
  }

  const onTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== panel && event.target !== backdrop) {
      return
    }
    finishCleanup()
  }

  const fallbackTimer = window.setTimeout(
    finishCleanup,
    GESTURE_TRANSITION_MS + 50,
  )

  panel.addEventListener('transitionend', onTransitionEnd)
  backdrop.addEventListener('transitionend', onTransitionEnd)

  return finishCleanup
}

export const SwipeEdgeMenu = Mount.defineStream(
  'SwipeEdgeMenu',
  {
    side: S.Literals(['start', 'end'] as const),
    maxEdgeStart: S.Number,
    swipeGesture: S.Boolean,
  },
  StartedSwipe,
  EndedSwipe,
  RequestedOpen,
  RequestedClose,
)(({ side, maxEdgeStart, swipeGesture }) => hostElement =>
  Stream.callback<Message>(queue =>
    Effect.gen(function* () {
      yield* Effect.acquireRelease(
        Effect.sync(() => {
          const doc = document
          const listenerOptions = { capture: true }
          const moveListenerOptions = { capture: true, passive: false }
          let active = false
          let started = false
          let isOpenAtStart = false
          let startX = 0
          let startY = 0
          let lastX = 0
          let lastTime = 0
          let panel: HTMLElement | undefined
          let backdrop: HTMLElement | undefined
          let cancelFinishAnimation: (() => void) | undefined

          const cancelPendingFinish = (): void => {
            cancelFinishAnimation?.()
            cancelFinishAnimation = undefined
          }

          const releaseGesture = (offerEndedSwipe: boolean): void => {
            if (started && offerEndedSwipe) {
              Queue.offerUnsafe(queue, EndedSwipe())
            }

            cancelPendingFinish()
            hostElement.removeAttribute('data-dragging')
            doc.body.style.removeProperty('overflow')

            if (panel !== undefined && backdrop !== undefined) {
              clearGestureStyles(panel, backdrop)
            }

            active = false
            started = false
            isOpenAtStart = false
            panel = undefined
            backdrop = undefined
          }

          const canStart = (clientX: number): boolean => {
            if (!swipeGesture || !isMobileViewport()) {
              return false
            }

            const isOpen = readIsOpen(hostElement)
            if (isOpen) {
              return true
            }
            return checkEdgeSide(
              clientX,
              side,
              maxEdgeStart,
              window.innerWidth,
            )
          }

          const onPointerDown = (event: PointerEvent): void => {
            if (event.button !== 0 || !canStart(event.clientX)) {
              return
            }

            if (readIsOpen(hostElement) && isInteractivePointerTarget(event.target)) {
              // Mirror backdrop-tap cleanup: stale finish animations from a prior
              // swipe can otherwise outlive an ×-button close.
              cancelPendingFinish()
              return
            }

            if (active) {
              releaseGesture(true)
            }

            cancelPendingFinish()

            const panelEl = hostElement.querySelector(PANEL_SELECTOR)
            const backdropEl = hostElement.querySelector(BACKDROP_SELECTOR)
            if (
              !(panelEl instanceof HTMLElement) ||
              !(backdropEl instanceof HTMLElement)
            ) {
              return
            }

            active = true
            started = false
            isOpenAtStart = readIsOpen(hostElement)
            startX = event.clientX
            startY = event.clientY
            lastX = event.clientX
            lastTime = event.timeStamp
            panel = panelEl
            backdrop = backdropEl
          }

          const onPointerMove = (event: PointerEvent): void => {
            if (!active || panel === undefined || backdrop === undefined) {
              return
            }

            const deltaX = event.clientX - startX
            const deltaY = event.clientY - startY

            if (!started) {
              if (
                Math.abs(deltaX) < GESTURE_THRESHOLD &&
                Math.abs(deltaY) < GESTURE_THRESHOLD
              ) {
                return
              }
              if (Math.abs(deltaY) > Math.abs(deltaX)) {
                releaseGesture(started)
                return
              }

              started = true
              hostElement.setAttribute('data-dragging', '')
              doc.body.style.overflow = 'hidden'
              Queue.offerUnsafe(queue, StartedSwipe())
            }

            event.preventDefault()

            const width = panel.getBoundingClientRect().width
            const delta = computeDelta(deltaX, isOpenAtStart, side)
            const rawProgress = delta / width
            const progress = Math.min(
              1,
              Math.max(0, isOpenAtStart ? 1 - rawProgress : rawProgress),
            )
            applyGestureStyles(panel, backdrop, progress, side)

            lastX = event.clientX
            lastTime = event.timeStamp
          }

          const onPointerEnd = (event: PointerEvent): void => {
            if (!active || panel === undefined || backdrop === undefined) {
              return
            }

            if (!started) {
              releaseGesture(false)
              return
            }

            const deltaX = event.clientX - startX
            const width = panel.getBoundingClientRect().width
            const delta = computeDelta(deltaX, isOpenAtStart, side)
            const velocityX =
              (event.clientX - lastX) /
              Math.max(1, event.timeStamp - lastTime)
            const shouldComplete = shouldCompleteGesture(
              deltaX,
              delta,
              width,
              velocityX,
              isOpenAtStart,
              side,
            )
            const shouldOpen = shouldOpenAfterGesture(isOpenAtStart, shouldComplete)

            cancelPendingFinish()
            cancelFinishAnimation = animateGestureFinish(
              panel,
              backdrop,
              side,
              shouldOpen,
            )
            Queue.offerUnsafe(queue, EndedSwipe())

            const isOpenNow = readIsOpen(hostElement)
            const edgeOpen = isOpeningFromEdge(
              startX,
              deltaX,
              side,
              maxEdgeStart,
              shouldOpen,
              window.innerWidth,
            )
            const dispatch = resolveGestureDispatch(
              shouldOpen,
              isOpenNow,
              edgeOpen,
            )
            if (dispatch === 'open') {
              Queue.offerUnsafe(queue, RequestedOpen({ role: 'gesture' }))
            } else if (dispatch === 'close') {
              Queue.offerUnsafe(queue, RequestedClose({ role: 'gesture' }))
            }

            active = false
            started = false
            isOpenAtStart = false
            panel = undefined
            backdrop = undefined
            hostElement.removeAttribute('data-dragging')
            doc.body.style.removeProperty('overflow')
          }

          const syncGestureStylesToModel = (): void => {
            cancelPendingFinish()

            const panelEl = hostElement.querySelector(PANEL_SELECTOR)
            const backdropEl = hostElement.querySelector(BACKDROP_SELECTOR)
            if (
              panelEl instanceof HTMLElement &&
              backdropEl instanceof HTMLElement
            ) {
              clearGestureStyles(panelEl, backdropEl)
            }
          }

          const openObserver = new MutationObserver(syncGestureStylesToModel)
          openObserver.observe(hostElement, {
            attributes: true,
            attributeFilter: ['data-open'],
          })

          doc.addEventListener('pointerdown', onPointerDown, listenerOptions)
          doc.addEventListener('pointermove', onPointerMove, moveListenerOptions)
          doc.addEventListener('pointerup', onPointerEnd, listenerOptions)
          doc.addEventListener('pointercancel', onPointerEnd, listenerOptions)

          return () => {
            releaseGesture(false)
            openObserver.disconnect()
            doc.removeEventListener('pointerdown', onPointerDown, listenerOptions)
            doc.removeEventListener(
              'pointermove',
              onPointerMove,
              moveListenerOptions,
            )
            doc.removeEventListener('pointerup', onPointerEnd, listenerOptions)
            doc.removeEventListener(
              'pointercancel',
              onPointerEnd,
              listenerOptions,
            )
          }
        }),
        cleanup => Effect.sync(cleanup),
      )

      return yield* Effect.never
    }),
  ),
)

// VIEW

export type { AppMenuSide } from './appMenuGesture.js'

export type AppMenuStyledConfig = Readonly<{
  /** Top-level render fn so nested submodels stay boundary-scoped. */
  renderContent: () => Html
  ariaLabel?: string
  side?: AppMenuSide
  showClose?: boolean
  closeButton?: Html
  swipeGesture?: boolean
  maxEdgeStart?: number
}>

export type ViewInputs = AppMenuStyledConfig

/** Ion-menu overlay drawer: slides over content with backdrop dismiss. */
export const view = defineView<Model, Message, ViewInputs>((model, viewInputs) => {
  const h = html<Message>()
  const { isOpen, id, isDragging } = model
  const side = viewInputs.side ?? 'start'
  const ariaLabel = viewInputs.ariaLabel ?? 'Menu'
  const swipeGesture = viewInputs.swipeGesture ?? true
  const maxEdgeStart = viewInputs.maxEdgeStart ?? 50

  const handleKeyDown = (key: string): Option.Option<typeof RequestedClose.Type> =>
    M.value(key).pipe(
      M.when('Escape', () =>
        isOpen ? Option.some(RequestedClose({ role: 'escape' })) : Option.none(),
      ),
      M.orElse(() => Option.none()),
    )

  const hostAttributes = [
    h.Id(id),
    ...(isOpen
      ? [
          h.Role('dialog'),
          h.AriaModal(true),
          h.AriaLabel(ariaLabel),
          h.Tabindex(-1),
          h.DataAttribute('open', ''),
        ]
      : [h.AriaHidden(true)]),
    ...(isDragging ? [h.DataAttribute('dragging', '')] : []),
    h.OnKeyDownPreventDefault(handleKeyDown),
    h.OnMount(
      SwipeEdgeMenu({
        side,
        maxEdgeStart,
        swipeGesture,
      }),
    ),
    sxAttrs(
      h,
      appMenuStyles.host,
      appMenuStyles.mobileOnly,
      isOpen || isDragging
        ? appMenuStyles.hostInteractive
        : appMenuStyles.hostClosed,
      isDragging ? appMenuStyles.hostDragging : undefined,
    ),
  ]

  return h.div(elAttrs<Message>(...hostAttributes), [
    h.div(
      elAttrs<Message>(
        ...(isOpen
          ? [h.OnClick(RequestedClose({ role: 'backdrop' }))]
          : []),
        h.DataAttribute('app-menu-backdrop', 'true'),
        sxAttrs(
          h,
          appMenuStyles.backdrop,
          isOpen || isDragging ? appMenuStyles.backdropVisible : undefined,
          isDragging ? appMenuStyles.backdropDragging : undefined,
          !isOpen && !isDragging ? appMenuStyles.layerIdle : undefined,
        ),
      ),
      [],
    ),
    h.div(
      elAttrs<Message>(
        h.DataAttribute('app-menu-panel', 'true'),
        sxAttrs(
          h,
          appMenuStyles.panel,
          side === 'end' ? appMenuStyles.panelEnd : appMenuStyles.panelStart,
          isOpen ? appMenuStyles.panelOpen : undefined,
          isDragging ? appMenuStyles.panelDragging : undefined,
          !isOpen && !isDragging ? appMenuStyles.layerIdle : undefined,
        ),
      ),
      [
        ...(viewInputs.showClose === true
          ? [
              h.div(
                elAttrs<Message>(sxAttrs(h, appMenuStyles.panelHeader)),
                [
                  h.button(
                    elAttrs<Message>(
                      h.OnClick(RequestedClose({})),
                      h.AriaLabel('Close menu'),
                      sxAttrs(h, appMenuStyles.closeButton),
                    ),
                    viewInputs.closeButton !== undefined
                      ? [viewInputs.closeButton]
                      : ['×'],
                  ),
                ],
              ),
            ]
          : []),
        h.div(
          elAttrs<Message>(sxAttrs(h, appMenuStyles.panelBody)),
          [viewInputs.renderContent()],
        ),
      ],
    ),
  ])
})

/** Builds view inputs that reuse sidebar nav content inside the overlay panel. */
export const styledViewInputs = (config: AppMenuStyledConfig): ViewInputs => config