import { Effect, Match as M, Option, Queue, Schema as S, Stream } from 'effect'
import type { Command } from 'foldkit/command'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import * as Mount from 'foldkit/mount'
import { evo } from 'foldkit/struct'
import { defineView } from 'foldkit/submodel'

import { appMenuStyles } from '@foldstylex/styles'

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
      RequestedOpen: () => [evo(model, { isOpen: () => true }), []],
      RequestedClose: () => [evo(model, { isOpen: () => false }), []],
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
const GESTURE_THRESHOLD = 10
const IOS_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

const isMobileViewport = (): boolean =>
  window.matchMedia('(max-width: 767px)').matches

const isEndSide = (side: AppMenuSide): boolean => side === 'end'

const checkEdgeSide = (
  posX: number,
  side: AppMenuSide,
  maxEdgeStart: number,
): boolean => {
  if (isEndSide(side)) {
    return posX >= window.innerWidth - maxEdgeStart
  }
  return posX <= maxEdgeStart
}

const computeDelta = (
  deltaX: number,
  isOpen: boolean,
  side: AppMenuSide,
): number => {
  const end = isEndSide(side)
  return Math.max(0, isOpen !== end ? -deltaX : deltaX)
}

const readIsOpen = (host: Element): boolean => host.hasAttribute('data-open')

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
  panel.style.removeProperty('transition-property')
  panel.style.removeProperty('transform')
  backdrop.style.removeProperty('transition-property')
  backdrop.style.removeProperty('opacity')
}

const animateGestureFinish = (
  panel: HTMLElement,
  backdrop: HTMLElement,
  side: AppMenuSide,
  shouldOpen: boolean,
): void => {
  panel.style.transitionProperty = 'transform'
  panel.style.transitionDuration = '300ms'
  panel.style.transitionTimingFunction = IOS_EASING
  backdrop.style.transitionProperty = 'opacity'
  backdrop.style.transitionDuration = '300ms'
  backdrop.style.transitionTimingFunction = IOS_EASING

  if (isEndSide(side)) {
    panel.style.transform = shouldOpen ? 'translateX(0)' : 'translateX(100%)'
  } else {
    panel.style.transform = shouldOpen ? 'translateX(0)' : 'translateX(-100%)'
  }

  backdrop.style.opacity = shouldOpen ? '0.25' : '0'

  const onTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== panel && event.target !== backdrop) {
      return
    }
    panel.removeEventListener('transitionend', onTransitionEnd)
    backdrop.removeEventListener('transitionend', onTransitionEnd)
    clearGestureStyles(panel, backdrop)
  }

  panel.addEventListener('transitionend', onTransitionEnd)
  backdrop.addEventListener('transitionend', onTransitionEnd)
}

const shouldCompleteGesture = (
  deltaX: number,
  delta: number,
  width: number,
  velocityX: number,
  isOpen: boolean,
  side: AppMenuSide,
): boolean => {
  const z = width / 2
  const shouldCompleteRight =
    velocityX >= 0 && (velocityX > 0.2 || deltaX > z)
  const shouldCompleteLeft =
    velocityX <= 0 && (velocityX < -0.2 || deltaX < -z)

  if (isOpen) {
    return isEndSide(side) ? shouldCompleteRight : shouldCompleteLeft
  }
  return isEndSide(side) ? shouldCompleteLeft : shouldCompleteRight
}

const shouldOpenAfterGesture = (
  isOpenAtStart: boolean,
  shouldComplete: boolean,
): boolean => {
  if (!isOpenAtStart && shouldComplete) {
    return true
  }
  if (isOpenAtStart && !shouldComplete) {
    return true
  }
  return false
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
          let active = false
          let started = false
          let isOpenAtStart = false
          let startX = 0
          let startY = 0
          let lastX = 0
          let lastTime = 0
          let panel: HTMLElement | undefined
          let backdrop: HTMLElement | undefined

          const resetGesture = (): void => {
            active = false
            started = false
            isOpenAtStart = false
            panel = undefined
            backdrop = undefined
            doc.body.style.removeProperty('overflow')
          }

          const canStart = (clientX: number): boolean => {
            if (!swipeGesture || !isMobileViewport()) {
              return false
            }

            const isOpen = readIsOpen(hostElement)
            if (isOpen) {
              return true
            }
            return checkEdgeSide(clientX, side, maxEdgeStart)
          }

          const onPointerDown = (event: PointerEvent): void => {
            if (event.button !== 0 || !canStart(event.clientX)) {
              return
            }

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
                resetGesture()
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

            hostElement.removeAttribute('data-dragging')
            doc.body.style.removeProperty('overflow')

            if (!started) {
              resetGesture()
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

            animateGestureFinish(panel, backdrop, side, shouldOpen)
            Queue.offerUnsafe(queue, EndedSwipe())
            Queue.offerUnsafe(
              queue,
              shouldOpen
                ? RequestedOpen({ role: 'gesture' })
                : RequestedClose({ role: 'gesture' }),
            )
            resetGesture()
          }

          doc.addEventListener('pointerdown', onPointerDown)
          doc.addEventListener('pointermove', onPointerMove, { passive: false })
          doc.addEventListener('pointerup', onPointerEnd)
          doc.addEventListener('pointercancel', onPointerEnd)

          return () => {
            doc.removeEventListener('pointerdown', onPointerDown)
            doc.removeEventListener('pointermove', onPointerMove)
            doc.removeEventListener('pointerup', onPointerEnd)
            doc.removeEventListener('pointercancel', onPointerEnd)
            hostElement.removeAttribute('data-dragging')
            doc.body.style.removeProperty('overflow')
          }
        }),
        cleanup => Effect.sync(cleanup),
      )

      return yield* Effect.never
    }),
  ),
)

// VIEW

export type AppMenuSide = 'start' | 'end'

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