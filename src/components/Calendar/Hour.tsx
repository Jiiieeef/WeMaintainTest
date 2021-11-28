import { Box, Text } from '@chakra-ui/react'
import { set, startOfHour as startOfHourDFNS, format } from 'date-fns'
import React from 'react'

export const Hour: React.FC<{ hour: number; date: Date }> = ({ hour, date }) => {
  const startOfHour = startOfHourDFNS(set(date, { hours: hour }))

  return (
    <Box key={hour} h={50}>
      <Text fontSize={12} color="gray">
        {format(startOfHour, 'HH:mm')}
      </Text>
    </Box>
  )
}
