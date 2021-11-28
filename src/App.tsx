import { Box } from '@chakra-ui/react'
import React from 'react'

import { Calendar } from './components/Calendar/Calendar'
import { TopBar } from './components/TopBar'

const App: React.FC = () => {
  return (
    <Box p={4}>
      <TopBar />

      <Calendar />
    </Box>
  )
}

export default App
