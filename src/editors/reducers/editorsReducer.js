import * as types from '../../const/actionTypes'
import * as entityTypes from  '../../const/entityTypes'

const DEFAULT_X_POSITION = 100
const DEFAULT_Y_POSITION = 100
const DEFAULT_WIDTH = 50
const DEFAULT_HEIGHT = 50
const DEFAULT_COLOR = 'red'

let counter = 0

const initialState = {
    entities: {},
    selectedEntityId: null
}

export default function editorsReducer(state = initialState, action = undefined) {

    var newState = Object.assign({}, state)

    switch (action.type) {
    case types.ADD_NEW_ENTITY:
        let newEntity = createEntity(action.entityType)
        newState.entities[newEntity.id] = newEntity
        //todo: fix
        newState.entities = Object.assign({}, newState.entities)
        newState.selectedEntityId = newEntity.id
        return newState
    case types.SAVE_ENTITY:
        return newState
    default:
        return state
    }

}

function createEntity(entityType) {
    switch (entityType) {
    case entityTypes.SQUARE:
        return createSquare()
    default:
        return {}
    }
}

function createSquare() {
    return {
        id: counter,
        key: counter++,
        entityType: entityTypes.SQUARE,
        properties: {
            leftRight: DEFAULT_X_POSITION + counter * DEFAULT_WIDTH * 2,
            upDown   : DEFAULT_Y_POSITION,
            width    : DEFAULT_WIDTH,
            height   : DEFAULT_HEIGHT,
            color    : DEFAULT_COLOR
        },
        methods: {}

    }
}


