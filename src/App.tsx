import { Box } from '@chakra-ui/react'
import React from 'react'

import { Calendar } from './components/Calendar/Calendar'
import { TopBar } from './components/TopBar'
import { useAppSelector } from './store/hooks'
import { activeUserSelector } from './store/users.reducer'

const App: React.FC = () => {
  const activeUser = useAppSelector(activeUserSelector)
  return (
    <Box p={4}>
      <TopBar />

      {activeUser && <Calendar />}
    </Box>
  )
}

export default App
