import { isBefore, isSameHour, isAfter } from 'date-fns'

/**
 * Check that `startNewEvent`or `endNewEvent` are between `startEvent`and `endEvent`.
 */
export const checkDatesIntersection = (
  startEvent: Date | number,
  endEvent: Date | number,
  startNewEvent: Date | number,
  endNewEvent: Date | number
): boolean => {
  return (
    ((isBefore(startEvent, startNewEvent) || isSameHour(startEvent, startNewEvent)) &&
      isAfter(endEvent, startNewEvent)) ||
    (isBefore(startEvent, endNewEvent) && isAfter(endEvent, endNewEvent)) ||
    (isBefore(startNewEvent, startEvent) && isAfter(endNewEvent, endEvent))
  )
}
