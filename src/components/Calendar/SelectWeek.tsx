import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react'
import { add, sub, format } from 'date-fns'
import React from 'react'
import DatePicker from 'react-datepicker'
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa'

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
      <Flex mx={20} alignItems="center" justifyContent="center">
        {format(activeDate, 'dd/MM/YYY')} (Week {format(activeDate, 'w')})
        <Box ml={4}>
          <DatePicker
            selected={activeDate}
            onChange={(date: Date) => {
              setActiveDate(date)
            }}
            dateFormat="dd/MM/yyy"
            customInput={
              <IconButton
                aria-label="Open calendar"
                icon={<FaCalendarAlt />}
                size="sm"
              />
            }
          />
        </Box>
      </Flex>
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
