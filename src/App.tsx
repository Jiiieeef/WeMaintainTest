import { Alert, AlertIcon, Box, Flex } from '@chakra-ui/react'
import React from 'react'

import { Calendar } from './components/Calendar/Calendar'
import { TopBar } from './components/TopBar'
import { useAppSelector } from './store/hooks'
import { activeUserSelector } from './store/users.reducer'

const App: React.FC = () => {
  return (
    <Box p={4}>
      <TopBar />
      <AuthorizationBouncer>
        <Calendar />
      </AuthorizationBouncer>
    </Box>
  )
}

const AuthorizationBouncer: React.FC = ({ children }) => {
  const activeUser = useAppSelector(activeUserSelector)

  if (activeUser) {
    return <>{children}</>
  }

  return (
    <Box position="relative">
      <Box pointerEvents="none" opacity={0.6}>
        {children}
      </Box>
      <Flex
        justifyContent="center"
        alignItems="center"
        position="fixed"
        top={12}
        bottom={0}
        right={0}
        left={0}
      >
        <Box>
          <Alert status="info" pointerEvents="none">
            <AlertIcon />
            You must create an user to create events in your calendar.
          </Alert>
        </Box>
      </Flex>
    </Box>
  )
}

export default App
