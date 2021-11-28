import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react'
import { add, sub, format } from 'date-fns'
import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export const SelectWeek: React.FC<{
  activeDate: Date
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>
}> = ({ activeDate, setActiveDate }) => {
  return (
    <Flex alignItems="center" justifyContent="center" mb={5} h={30}>
      <Tooltip label="Previous week">
        <IconButton
          aria-label="Previous week"
          icon={<FaChevronLeft />}
          onClick={() => {
            setActiveDate(sub(activeDate, { weeks: 1 }))
          }}
        />
      </Tooltip>
      <Box mx={20}>
        {format(activeDate, 'dd/MM/YYY')} (Week {format(activeDate, 'w')})
      </Box>
      <Tooltip label="Next week">
        <IconButton
          aria-label="Next week"
          icon={<FaChevronRight />}
          onClick={() => {
            setActiveDate(add(activeDate, { weeks: 1 }))
          }}
        />
      </Tooltip>
    </Flex>
  )
}
