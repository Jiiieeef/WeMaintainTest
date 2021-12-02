import { cleanup, fireEvent } from '@testing-library/react'
import { advanceTo, clear } from 'jest-date-mock'
import React from 'react'
import { act } from 'react-dom/test-utils'

import { RootState } from '../../store/index'
import { defaultPreloadedState } from '../../tests/store'
import { customRender } from '../../tests/utils'

import { Calendar } from './Calendar'

describe('Calendar', () => {
  beforeEach(() => {
    advanceTo(new Date('10/10/2020'))
  })

  afterEach(() => {
    cleanup()
    clear()
  })

  describe('SelectWeek', () => {
    test('it should display active date', () => {
      const { getByTestId } = customRender(<Calendar />)

      expect(getByTestId('active-week')).toHaveTextContent('(Week 41)')
    })

    test('it should allow to change week', () => {
      const { getByTestId, getByLabelText } = customRender(<Calendar />)

      fireEvent.click(getByLabelText('Next week'))
      fireEvent.click(getByLabelText('Next week'))

      expect(getByTestId('active-week')).toHaveTextContent('(Week 43)')

      fireEvent.click(getByLabelText('Previous week'))
      fireEvent.click(getByLabelText('Previous week'))
      fireEvent.click(getByLabelText('Previous week'))

      expect(getByTestId('active-week')).toHaveTextContent('(Week 40)')
    })

    test('it should allow to change date with a calendar', async () => {
      const { getByTestId, getByLabelText } = customRender(<Calendar />)

      fireEvent.click(getByLabelText('Open calendar'))

      fireEvent.click(getByLabelText('Choose Tuesday, October 27th, 2020'))
      expect(getByTestId('active-week')).toHaveTextContent('(Week 44)')
    })
  })

  test('it should allow to create an event', async () => {
    const { getByPlaceholderText, getByLabelText, findByTestId } = customRender(
      <Calendar />
    )
    fireEvent.click(getByLabelText('10/10/2020 05:00'))
    fireEvent.change(getByPlaceholderText('Event name'), {
      target: { value: 'My first event' },
    })
    await act(async () => {
      const el = await findByTestId('save-event')
      fireEvent.click(el)
    })

    expect(
      getByLabelText('10/10/2020 05:00').querySelector('.event-name')
    ).toHaveTextContent('My first event')
  })

  test('it should allow to delete an event', async () => {
    const newState: RootState = {
      ...defaultPreloadedState,
      events: {
        nextId: 2,
        events: [
          {
            startDate: 1602298800000,
            endDate: 1602302400000,
            id: 1,
            name: 'Event to delete',
            userId: 1,
          },
        ],
      },
    }
    const { getByLabelText, getByTestId } = customRender(<Calendar />, {
      preloadedState: newState,
    })

    fireEvent.click(getByLabelText('10/10/2020 05:00'))

    fireEvent.click(getByTestId('delete-event'))
    fireEvent.click(getByTestId('confirm-delete-event'))

    expect(getByLabelText('10/10/2020 05:00').querySelector('.event-name')).toBe(null)
  })

  test('it should allow to edit an event', async () => {
    const newState: RootState = {
      ...defaultPreloadedState,
      events: {
        nextId: 2,
        events: [
          {
            startDate: 1602298800000,
            endDate: 1602302400000,
            id: 1,
            name: 'Event to edit',
            userId: 1,
          },
        ],
      },
    }
    const { getByLabelText, getByPlaceholderText, findByTestId, getByTestId } =
      customRender(<Calendar />, {
        preloadedState: newState,
      })

    fireEvent.click(getByLabelText('10/10/2020 05:00'))

    fireEvent.change(getByPlaceholderText('Event name'), {
      target: { value: 'Edited' },
    })

    fireEvent.click(getByTestId('event-start-date'))

    fireEvent.click(getByLabelText('Choose Friday, October 9th, 2020'))

    await act(async () => {
      const el = await findByTestId('save-event')
      fireEvent.click(el)
    })

    expect(
      getByLabelText('09/10/2020 05:00').querySelector('.event-name')
    ).toHaveTextContent('Edited')
  })

  test('it should not allow to edit have events which overlap', async () => {
    const newState: RootState = {
      ...defaultPreloadedState,
      events: {
        nextId: 3,
        events: [
          {
            startDate: 1602298800000,
            endDate: 1602302400000,
            id: 1,
            name: 'Event 1',
            userId: 1,
          },
          {
            startDate: 1602370800000,
            endDate: 1602460800000,
            id: 2,
            name: 'Event 2',
            userId: 1,
          },
        ],
      },
    }
    const { getByLabelText, findByLabelText, queryByTestId, getByTestId } =
      customRender(<Calendar />, {
        preloadedState: newState,
      })

    fireEvent.click(getByLabelText('10/10/2020 23:00'))
    expect(queryByTestId('events-overlap-error')).toBe(null)

    fireEvent.click(getByTestId('event-start-date'))
    await act(async () => {
      const el = await findByLabelText('Choose Tuesday, October 6th, 2020')
      fireEvent.click(el)
    })

    expect(getByTestId('events-overlap-error')).toBeDefined()
    expect(getByTestId('save-event')).toHaveAttribute('disabled')
  })
})
