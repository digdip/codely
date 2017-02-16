import { combineReducers } from 'redux'
import gameReducer from '../reducers/gameReducer'
import commonReducer from '../../common/reducers/commonReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    gameReducer: gameReducer,
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
