import { combineReducers } from 'redux'
import introReducer from '../reducers/introReducer'
import commonReducer from '../../common/reducers/commonReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    introReducer: introReducer,
    commonReducer: commonReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
