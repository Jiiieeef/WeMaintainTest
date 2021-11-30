import { configureStore } from '@reduxjs/toolkit'

import { eventsReducer } from './events.reducer'
import { usersReducer } from './users.reducer'

export const reducer = {
  users: usersReducer,
  events: eventsReducer,
}

export const store = configureStore({
  reducer,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
