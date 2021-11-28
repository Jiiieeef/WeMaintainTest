import { IconButton, Tooltip, Flex, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FaPlusCircle } from 'react-icons/fa'

import { useAppSelector } from '../store/hooks'
import { activeUserSelector } from '../store/users.reducer'

import { AddUserModal } from './AddUserModal'

export const TopBar: React.FC = () => {
  const disclosureProps = useDisclosure()
  const { onOpen } = disclosureProps

  const activeUser = useAppSelector(activeUserSelector)

  return (
    <>
      <Flex justifyContent="space-between">
        <Text>We maintain Test</Text>
        <Flex alignItems="center">
          {!!activeUser && <Text mr={4}>{activeUser.name}</Text>}

          <Tooltip label="Add user" hasArrow placement="bottom">
            <IconButton
              aria-label="Add user"
              icon={<FaPlusCircle />}
              onClick={onOpen}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <AddUserModal {...disclosureProps} />
    </>
  )
}
