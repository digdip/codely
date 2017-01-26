import * as types from '../../const/actionTypes'

const DEFAULT_X_POSITION = 100
const DEFAULT_Y_POSITION = 100
const DEFAULT_WIDTH = 50
const DEFAULT_HEIGHT = 50
const DEFAULT_COLOR = 'red'

let counter = 0

const initialState = {
    entities: []
}

export default function editorsReducer(state = initialState, action = undefined) {

    var newState = Object.assign({}, state)

    switch (action.type) {
    case types.ADD_NEW_ENTITY:
        newState.entities.push(createEntity(action.entityType))
        return newState
    case types.SAVE_ENTITY:
        return newState
    default:
        return state
    }

}


function createEntity(entityType) {
    return {
        id: counter++,
        entityType,
        x: DEFAULT_X_POSITION,
        y: DEFAULT_Y_POSITION,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        color: DEFAULT_COLOR
    }
}


