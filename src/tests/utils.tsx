import { ChakraProvider } from '@chakra-ui/react'
import { configureStore } from '@reduxjs/toolkit'
import { render as rtlRender, RenderResult } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import '@testing-library/jest-dom'

import { reducer, RootState } from '../store'

import { defaultPreloadedState } from './store'

export type RenderParams = {
  preloadedState?: Partial<RootState>
  store?: Store<RootState>
}

const customRender = (
  element: React.ReactElement,
  {
    preloadedState = defaultPreloadedState,
    store = configureStore({ reducer, preloadedState }),
  }: RenderParams = {} as RenderParams
): RenderResult => {
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <ChakraProvider>{children}</ChakraProvider>
    </Provider>
  )

  return rtlRender(element, {
    wrapper: Wrapper,
  })
}

export * from '@testing-library/react'
export { customRender }
