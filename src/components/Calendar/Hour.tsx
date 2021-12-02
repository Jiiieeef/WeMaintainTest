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
import { useGetEventStyles } from './utils'

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

  const { border, borderTop, borderBottom, displayEventName } =
    useGetEventStyles(activeUserEventsForDate, startOfHour) || {}

  return (
    <>
      <Box
        aria-label={format(startOfHour, 'dd/MM/yyyy HH:mm')}
        key={hour}
        h={50}
        p={1}
        _hover={{ cursor: 'pointer', '& .hour': { fontWeight: 'bold' } }}
        sx={{
          ...border,
          ...borderTop,
          ...borderBottom,
        }}
        onClick={onOpen}
      >
        <Text fontSize={12} color="gray" className="hour">
          {format(startOfHour, 'HH:mm')}
        </Text>
        {activeUserEventsForDate && displayEventName && (
          <Text className="event-name">{activeUserEventsForDate.name}</Text>
        )}
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
