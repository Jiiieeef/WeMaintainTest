import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from './index'

type User = {
  id: number
  name: string
}

type UsersState = {
  users: User[]
  nextId: number
  activeUser?: User
}

type AddUserAction = {
  user: Omit<User, 'id'>
}

type SelectUserAction = {
  id: number
}

const initialState: UsersState = {
  users: [],
  nextId: 1,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<AddUserAction>) => {
      const newUser = { ...action.payload.user, id: state.nextId }

      state.users.push(newUser)
      state.nextId += 1

      state.activeUser = newUser
    },
    selectUser: (state, action: PayloadAction<SelectUserAction>) => {
      state.activeUser = state.users.find(({ id }) => id === action.payload.id)
    },
  },
})

export const { addUser, selectUser } = usersSlice.actions

export const usersSelector = (state: RootState): User[] => state.users.users
export const activeUserSelector = (state: RootState): User | undefined =>
  state.users.activeUser

export const usersReducer = usersSlice.reducer
