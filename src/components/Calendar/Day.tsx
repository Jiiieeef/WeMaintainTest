import { Box, Text, Grid, GridProps } from '@chakra-ui/react'
import { format } from 'date-fns'
import React from 'react'

import { Hour } from './Hour'

export const Day: React.FC<{ date: Date; hoursGridProps?: GridProps }> = ({
  date,
  hoursGridProps,
}) => {
  return (
    <Box px={4}>
      <Text textAlign="center" fontWeight="bold" mb={10}>
        {format(date, 'dd/MM/yyyy')}
      </Text>
      <Grid templateColumns="repeat(1fr, 24)" {...hoursGridProps}>
        {Array.from({ length: 24 }, (_, index) => (
          <Hour key={index} hour={index} date={date} />
        ))}
      </Grid>
    </Box>
  )
}
