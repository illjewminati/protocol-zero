import { applyMiddleware, AnyAction } from 'redux'
import { configureStore } from "@reduxjs/toolkit"
import { composeWithDevTools } from 'redux-devtools-extension'
import { createRootReducer } from './reducers';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { StoreState } from '../types/store';
import { enableWeb3, getWeb3Wrapper, listenNetwork, initializeWeb3Wrapper, getExternalSigner, getExternalProvider, getWebSocketProvider } from '../services/web3_wrapper'
import { localStorageMiddleware } from './middlewares';

    // "@opengsn/common": "^3.0.0-beta.1",
    // "@opengsn/provider@^3.0.0-beta.1",


/** If you want to add more than one middleware */

const rootReducer = createRootReducer();

const extraArgument = {
  enableWeb3,
  getWeb3Wrapper,
  listenNetwork,
  initializeWeb3Wrapper,
  getExternalSigner,
  getExternalProvider,
  getWebSocketProvider
};
export type ExtraArgument = typeof extraArgument;

const thunkMiddleware = thunk.withExtraArgument(extraArgument) as ThunkMiddleware<StoreState, AnyAction>;

const middlewares = [thunkMiddleware]


const middlewareEnhancer = applyMiddleware(...middlewares)

const enhancers = [middlewareEnhancer]

export function initializeStore (initialState = {}) {
  return configureStore({
    reducer: rootReducer, 
    preloadedState: initialState,
    middleware: middlewares,
    devTools: true,
    enhancers
  })
}
