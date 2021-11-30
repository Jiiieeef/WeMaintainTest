import { Grid } from '@chakra-ui/react'
import { add } from 'date-fns'
import React from 'react'

import { Day } from './Day'

export const Week: React.FC<{ startOfWeek: Date }> = ({ startOfWeek }) => {
  return (
    <Grid templateColumns="repeat(7, 1fr)">
      {Array.from({ length: 7 }, (_, index) => {
        const date = add(startOfWeek, { days: index })
        return (
          <Day
            key={index}
            date={date}
            hoursGridProps={{ borderRightWidth: index < 6 ? '1px' : undefined }}
          />
        )
      })}
    </Grid>
  )
}
