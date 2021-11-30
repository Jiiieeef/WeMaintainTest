import { IconButton, Tooltip, Flex, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FaPlusCircle } from 'react-icons/fa'

import { AddUserModal } from './AddUserModal'
import { UsersMenu } from './UsersMenu'

export const TopBar: React.FC = () => {
  const disclosureProps = useDisclosure()
  const { onOpen } = disclosureProps

  return (
    <>
      <Flex justifyContent="space-between">
        <Text>We maintain Test</Text>
        <Flex alignItems="center">
          <UsersMenu mr={4} />

          <Tooltip label="Add user" hasArrow placement="bottom">
            <IconButton
              aria-label="Add user"
              data-testid="add-user-button"
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
