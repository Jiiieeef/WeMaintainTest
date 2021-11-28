import { Menu, MenuButton, MenuList, MenuItem, MenuButtonProps } from '@chakra-ui/menu'
import { Button } from '@chakra-ui/react'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import { activeUserSelector, selectUser, usersSelector } from '../store/users.reducer'

export const UsersMenu: React.FC<MenuButtonProps> = (props) => {
  const dispatch = useAppDispatch()
  const activeUser = useAppSelector(activeUserSelector)
  const users = useAppSelector(usersSelector)

  const otherUsers = users.filter(({ id }) => id !== activeUser?.id)

  return !!activeUser && users.length ? (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        isDisabled={!otherUsers.length}
        {...props}
      >
        {activeUser.name}
      </MenuButton>
      <MenuList>
        {otherUsers.map(({ id, name }) => (
          <MenuItem key={id} minH="48px" onClick={() => dispatch(selectUser({ id }))}>
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  ) : null
}
