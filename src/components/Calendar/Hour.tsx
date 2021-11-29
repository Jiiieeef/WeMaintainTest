import { Box, Text, useDisclosure } from '@chakra-ui/react'
import {
  set,
  startOfHour as startOfHourDFNS,
  format,
  isSameHour,
  isAfter,
  isBefore,
} from 'date-fns'
import React, { useMemo } from 'react'

import { activeUserEventsSelector } from '../../store/events.reducer'
import { useAppSelector } from '../../store/hooks'

import { FormEventModal } from './FormEventModal'

export const Hour: React.FC<{ hour: number; date: Date }> = ({ hour, date }) => {
  const { isOpen, onOpen, onClose, ...disclosureProps } = useDisclosure()

  const startOfHour = startOfHourDFNS(set(date, { hours: hour }))

  const activeUserEvents = useAppSelector(activeUserEventsSelector)

  const activeUserEventsForDate = useMemo(
    () =>
      activeUserEvents.find(
        ({ startDate, endDate }) =>
          (isBefore(startDate, startOfHour) || isSameHour(startDate, startOfHour)) &&
          isAfter(endDate, startOfHour)
      ),
    [startOfHour, activeUserEvents]
  )

  return (
    <>
      <Box
        key={hour}
        h={50}
        _hover={{ cursor: 'pointer', '& .hour': { fontWeight: 'bold' } }}
        sx={activeUserEventsForDate ? { border: '1px solid black' } : undefined}
        onClick={onOpen}
      >
        <Text fontSize={12} color="gray" className="hour">
          {format(startOfHour, 'HH:mm')}
        </Text>
        {activeUserEventsForDate && <Text>{activeUserEventsForDate.name}</Text>}
      </Box>
      {isOpen && (
        <FormEventModal
          event={activeUserEventsForDate}
          startHour={startOfHour}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          {...disclosureProps}
        />
      )}
    </>
  )
}
