import React from 'react'
import { act } from 'react-dom/test-utils'

import App from './App'
import { cleanup, customRender, fireEvent } from './tests/utils'

describe('App', () => {
  afterEach(cleanup)

  test('it should not displays a notice when there is a user selected', () => {
    const { queryByTestId } = customRender(<App />)

    expect(queryByTestId('authorization-bouncer')).toBe(null)
  })

  test('it should displays a notice when there is no users created yet', async () => {
    const { queryByTestId, getByTestId, getByPlaceholderText, findByTestId } =
      customRender(<App />, {
        preloadedState: {
          users: {
            users: [],
            activeUser: undefined,
            nextId: 1,
          },
        },
      })

    expect(queryByTestId('add-user-form')).toBe(null)
    expect(queryByTestId('authorization-bouncer')).not.toBe(null)

    fireEvent.click(getByTestId('add-user-button'))
    expect(queryByTestId('add-user-form')).not.toBe(null)
    fireEvent.change(getByPlaceholderText('Type your name'), {
      target: { value: 'Jief' },
    })

    await act(async () => {
      const el = await findByTestId('submit-user-form')
      fireEvent.click(el)
    })

    expect(queryByTestId('authorization-bouncer')).toBe(null)
  })
})
