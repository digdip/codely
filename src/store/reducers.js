import { combineReducers } from 'redux'
import editorsReducer from '../editors/reducers/editorsReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    editorsReducer: editorsReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
