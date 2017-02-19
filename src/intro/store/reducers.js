import { combineReducers } from 'redux'
import introReducer from '../reducers/introReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    introReducer: introReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
