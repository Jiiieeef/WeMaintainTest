import { useDisclosure } from '@chakra-ui/react'
import { isBefore, set, startOfHour, isAfter, isSameHour } from 'date-fns'
import React, { useMemo } from 'react'

import { activeUserEventsSelector } from '../store/events.reducer'
import { useAppSelector } from '../store/hooks'
import { activeUserSelector } from '../store/users.reducer'

import { CreateEVentModal } from './CreateEventModal'

export const Hour: React.FC<{ hour: number; date: Date }> = ({ hour, date }) => {
  const { isOpen, onOpen, onClose, ...disclosureProps } = useDisclosure()
  const activeUser = useAppSelector(activeUserSelector)
  const _startOfHour = startOfHour(set(date, { hours: hour }))

  const activeUserEvents = useAppSelector(activeUserEventsSelector)

  const activeUserEventsForDate = useMemo(
    () =>
      activeUserEvents.find(
        ({ startDate, endDate }) =>
          (isBefore(startDate, _startOfHour) || isSameHour(startDate, _startOfHour)) &&
          isAfter(endDate, _startOfHour)
      ),
    [_startOfHour, activeUserEvents]
  )

  return (
    <>
      <li
        key={hour}
        style={{ height: '50px' }}
        onClick={() => {
          if (!activeUser) {
            return
          }
          onOpen()
        }}
      >
        {hour}:00 {activeUserEventsForDate ? activeUserEventsForDate.name : 'no'} events
      </li>

      <CreateEVentModal
        startHour={_startOfHour}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        {...disclosureProps}
      />
    </>
  )
}
