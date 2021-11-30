import { cleanup } from '@testing-library/react'
import { advanceTo, clear } from 'jest-date-mock'
import React from 'react'

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

  test('it should display active date', () => {
    const { getByTestId } = customRender(<Calendar />)

    expect(getByTestId('active-week')).toHaveTextContent('(Week 41)')
  })
})
