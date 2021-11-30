import { RootState } from '../store/index'

const userJief = {
  id: 1,
  name: 'Jief',
}

export const defaultPreloadedState: RootState = {
  users: {
    users: [userJief],
    nextId: 2,
    activeUser: userJief,
  },
  events: {
    events: [],
    nextId: 1,
  },
}
