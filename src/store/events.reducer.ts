import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from './index'

export type Event = {
  id: number
  name: string
  startDate: number
  endDate: number
  userId: number
}

type EventsState = {
  events: Event[]
  nextId: number
}

type CreateEventAction = {
  event: Omit<Event, 'id'>
}

type EditEventAction = {
  event: Event
}

type DeleteEventAction = {
  id: number
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
      const { startDate, endDate, ...eventProps } = action.payload.event
      state.events.push({
        startDate: startDate,
        endDate: endDate,
        id: state.nextId,
        ...eventProps,
      })
      state.nextId += 1
    },
    editEvent: (state, action: PayloadAction<EditEventAction>) => {
      const index = state.events.findIndex(({ id }) => id === action.payload.event.id)
      state.events[index] = action.payload.event
    },
    deleteEvent: (state, action: PayloadAction<DeleteEventAction>) => {
      state.events = state.events.filter(({ id }) => id !== action.payload.id)
    },
  },
})

export const { createEvent, deleteEvent, editEvent } = eventsSlice.actions

export const activeUserEventsSelector = (state: RootState): Event[] =>
  state.events.events.filter(({ userId }) => userId === state.users.activeUser?.id)

export const eventsReducer = eventsSlice.reducer
