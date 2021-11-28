import { Box } from '@chakra-ui/react'
import React from 'react'

import { TopBar } from './components/TopBar'

const App: React.FC = () => {
  return (
    <Box p={4}>
      <TopBar />
    </Box>
  )
}

export default App
