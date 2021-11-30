import { Box, Text, Grid, GridProps } from '@chakra-ui/react'
import { format, startOfDay as startOfDayDFNS } from 'date-fns'
import React from 'react'

import { Hour } from './Hour'

export const Day: React.FC<{ date: Date; hoursGridProps?: GridProps }> = ({
  date,
  hoursGridProps,
}) => {
  const startOfDay = startOfDayDFNS(date)
  return (
    <Box>
      <Text textAlign="center" fontWeight="bold" mb={10}>
        {format(startOfDay, 'dd/MM/yyyy')}
      </Text>
      <Grid
        templateColumns="repeat(1fr, 24)"
        px={4}
        {...hoursGridProps}
        borderRightStyle="solid"
        borderRightColor="primary.500"
      >
        {Array.from({ length: 24 }, (_, index) => (
          <Hour key={index} hour={index} date={startOfDay} />
        ))}
      </Grid>
    </Box>
  )
}
