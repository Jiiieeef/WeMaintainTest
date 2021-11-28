import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from './index'

type Event = {
  id: number
  name: string
  date: number
  userId: number
}

type EventsState = {
  events: Event[]
  nextId: number
}

type CreateEventAction = {
  event: Omit<Event, 'id'>
}

const initialState: EventsState = {
  events: [],
  nextId: 1,
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    createEvent: (state, action: PayloadAction<CreateEventAction>) => {
      state.events.push({
        ...action.payload.event,
        id: state.nextId,
      })
      state.nextId += 1
    },
  },
})

export const { createEvent } = eventsSlice.actions

export const activeUserEventsSelector = (state: RootState): Event[] =>
  state.events.events.filter(({ userId }) => userId === state.users.activeUser?.id)

export const eventsReducer = eventsSlice.reducer
