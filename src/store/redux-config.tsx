import React from 'react'
import { StoreState } from '../types/store';
import {initializeStore} from './index';

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore (initialState?: StoreState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}

export type Store = ReturnType<typeof getOrCreateStore>

type Props = { reduxStore: Store }

const AppWithReduxStore = (App: React.ComponentClass<Props>) => {
  return class AppWithRedux extends React.Component<Props> {

    private reduxStore

    static async getInitialProps (appContext) {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore: any = getOrCreateStore()

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore

      let appProps = {}
      if ((App as any).getInitialProps) {
        appProps = await (App as any).getInitialProps(appContext)
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState() 
      }
    }

    constructor (props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render () {
      return (<App {...this.props} reduxStore={this.reduxStore}  />)
    }
  }
}

export default AppWithReduxStore
