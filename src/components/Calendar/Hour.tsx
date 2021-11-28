import { Box, Text } from '@chakra-ui/react'
import { set, startOfHour as startOfHourDFNS, format, isSameHour } from 'date-fns'
import React, { useMemo } from 'react'

import { activeUserEventsSelector, createEvent } from '../../store/events.reducer'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { activeUserSelector } from '../../store/users.reducer'

export const Hour: React.FC<{ hour: number; date: Date }> = ({ hour, date }) => {
  const dispatch = useAppDispatch()
  const activeUser = useAppSelector(activeUserSelector)
  const startOfHour = startOfHourDFNS(set(date, { hours: hour }))

  const activeUserEvents = useAppSelector(activeUserEventsSelector)

  const activeUserEventsForDate = useMemo(
    () => activeUserEvents.find(({ date }) => isSameHour(date, startOfHour)),
    [startOfHour, activeUserEvents]
  )

  return (
    <Box
      key={hour}
      h={50}
      _hover={{ cursor: 'pointer', '& .hour': { fontWeight: 'bold' } }}
      sx={activeUserEventsForDate ? { border: '1px solid black' } : undefined}
      onClick={() =>
        dispatch(
          createEvent({
            event: {
              name: 'My event',
              date: startOfHour.getTime(),
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              userId: activeUser!.id,
            },
          })
        )
      }
    >
      <Text fontSize={12} color="gray" className="hour">
        {format(startOfHour, 'HH:mm')}
      </Text>
      {activeUserEventsForDate && <Text>{activeUserEventsForDate.name}</Text>}
    </Box>
  )
}
