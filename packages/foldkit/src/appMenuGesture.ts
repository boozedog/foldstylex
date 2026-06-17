export type AppMenuSide = 'start' | 'end'

export const GESTURE_THRESHOLD = 10

const isEndSide = (side: AppMenuSide): boolean => side === 'end'

export const checkEdgeSide = (
  posX: number,
  side: AppMenuSide,
  maxEdgeStart: number,
  viewportWidth: number,
): boolean => {
  if (isEndSide(side)) {
    return posX >= viewportWidth - maxEdgeStart
  }
  return posX <= maxEdgeStart
}

export const computeDelta = (
  deltaX: number,
  isOpen: boolean,
  side: AppMenuSide,
): number => {
  const end = isEndSide(side)
  return Math.max(0, isOpen !== end ? -deltaX : deltaX)
}

export const shouldCompleteGesture = (
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

export const shouldOpenAfterGesture = (
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

export const isOpeningFromEdge = (
  startX: number,
  deltaX: number,
  side: AppMenuSide,
  maxEdgeStart: number,
  shouldOpen: boolean,
  viewportWidth: number,
): boolean =>
  shouldOpen &&
  checkEdgeSide(startX, side, maxEdgeStart, viewportWidth) &&
  computeDelta(deltaX, false, side) > GESTURE_THRESHOLD

export type GestureDispatch = 'open' | 'close' | 'none'

/** Maps pointer-up gesture outcome to mount Messages.
 *  `isOpenNow` reads live DOM (`data-open`); `edgeOpen` covers the ×-close race
 *  where the model is closed but the attribute has not cleared yet. */
export const resolveGestureDispatch = (
  shouldOpen: boolean,
  isOpenNow: boolean,
  edgeOpen: boolean,
): GestureDispatch => {
  if ((shouldOpen && !isOpenNow) || edgeOpen) {
    return 'open'
  }
  if (!shouldOpen && isOpenNow) {
    return 'close'
  }
  return 'none'
}