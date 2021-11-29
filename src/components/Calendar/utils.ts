import { BoxProps } from '@chakra-ui/layout'
import { isBefore, isSameHour, isAfter, add, startOfDay, startOfWeek } from 'date-fns'
import { useMemo } from 'react'

import { Event } from '../../store/events.reducer'
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

export const useGetEventStyles = (
  event: Event | undefined,
  startOfHour: Date
):
  | {
      border: BoxProps
      borderTop: BoxProps
      borderBottom: BoxProps
      displayEventName: boolean
    }
  | undefined =>
  useMemo(() => {
    if (!event) {
      return undefined
    }
    const isBeginningOfEvent = event && startOfHour.getTime() === event.startDate
    const isEndOfEvent =
      event && add(startOfHour, { hours: 1 }).getTime() === event.endDate

    const border = { border: '1px solid black' }
    const borderTop = isBeginningOfEvent
      ? { borderTopLeftRadius: 4, borderTopRightRadius: 4 }
      : { borderTopWidth: 0 }
    const borderBottom = isEndOfEvent
      ? { borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }
      : { borderBottomWidth: 0 }

    const isStartOfWeek = startOfHour.getTime() === startOfWeek(startOfHour).getTime()
    const isStartOfDay = startOfHour.getTime() === startOfDay(startOfHour).getTime()

    return {
      border,
      borderTop,
      borderBottom,
      displayEventName: isBeginningOfEvent || isStartOfWeek || isStartOfDay,
    }
  }, [event, startOfHour])
