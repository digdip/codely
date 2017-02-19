import * as types from '../../const/actionTypes'
import * as appConstants from  '../../const/appConstants'
import * as grammar from  '../../const/grammar'
import * as reducerUtils from  '../../common/reducers/reducerUtils'
import Immutable from 'immutable'
import uuid from 'uuid'


function createInitialModel() {
    let model = {
        mainCharacter: {},
        enemy: {},
        selectedEntityRole: appConstants.EntityRole.MAIN_CHARACTER,
        appMode: appConstants.AppMode.EDITING
    }
    model[appConstants.EntityRole.MAIN_CHARACTER] = createSquare()
    model[appConstants.EntityRole.ENEMY] = createSquare(appConstants.DEFAULT_X_POSITION + appConstants.DEFAULT_WIDTH * 3)
    return model
}
const initialState = Immutable.fromJS(createInitialModel())


export default function gameReducer(state = initialState, action = undefined) {

    switch (action.type) {
        case types.ADD_NEW_METHOD:
            state = state.setIn([action.selectedEntityRole, grammar.METHODS, action.methodName], Immutable.fromJS(reducerUtils.createMethod()))
            return state.setIn([action.selectedEntityRole, grammar.SELECTED_METHOD], action.methodName)
        case types.SELECT_METHOD:
            return state.setIn([grammar.ENTITIES, action.entityId, grammar.SELECTED_METHOD], action.methodName)
        case types.UPDATE_METHOD_BODY:
            return state.setIn([grammar.ENTITIES, action.entityId, grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT], action.methodBody)
        case types.INSERT_TEXT_TO_METHOD:
            let currentBody = state.getIn([grammar.ENTITIES, action.entityId, grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT])
            if (currentBody && !currentBody.endsWith(' ')) {
                currentBody += ' '
            }
            currentBody += action.text + ' '
            return state.setIn([grammar.ENTITIES, action.entityId, grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT], currentBody)
        case types.RUN_METHOD:
            return state.setIn([grammar.ENTITIES, action.entityId], reducerUtils.runMethod(state.getIn([grammar.ENTITIES, action.entityId]), action.methodName))
        case types.RUN_NEXT_LINE:
            return state.setIn([grammar.ENTITIES, action.entityId], reducerUtils.runMethodNextLine(state.getIn([grammar.ENTITIES, action.entityId])))
        case types.RESET_ENTITY:
            return state.setIn([grammar.ENTITIES, action.entityId], reducerUtils.resetRun(state.getIn([grammar.ENTITIES, action.entityId])))
        case types.PAUSE_ENTITY:
            return state.setIn([grammar.ENTITIES, action.entityId], reducerUtils.pauseRun(state.getIn([grammar.ENTITIES, action.entityId])))
        case types.ENTER_GAME_MODE:
            return state.set(grammar.APP_MODE, appConstants.AppMode.GAME)
        case types.ENTER_EDITING_MODE:
            return state.set(grammar.APP_MODE, appConstants.AppMode.EDITING)
        default:
            return state
    }

}

function createEntity(entityType, runMethodScript) {
    switch (entityType) {
        case appConstants.EntityType.SQUARE:
            return createSquare()
        default:
            return {}
    }
}

function createSquare(xPos, yPos) {
    let id = uuid()
    let json = {
        id: id,
        key: id,
        entityType: appConstants.EntityType.SQUARE,
        properties: {},
        methods: {},
        eventHandlers: {},
        selectedMethod: grammar.MAIN_METHOD
    }
    json[grammar.RUN_DATA] = {
        lineNumber: -1,
        methodName: '',
        runStatus: grammar.RunStatuses.IDLE
    }
    json[grammar.METHODS][grammar.MAIN_METHOD] = reducerUtils.createMethod(true, '')
    json[grammar.METHODS][grammar.ON_KEY_UP] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_DOWN] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_LEFT] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_RIGHT] = reducerUtils.createMethod(true)
    json[grammar.PROPERTIES][grammar.X] = xPos ? xPos : appConstants.DEFAULT_X_POSITION
    json[grammar.PROPERTIES][grammar.Y] = yPos ? yPos : appConstants.DEFAULT_Y_POSITION
    json[grammar.PROPERTIES][grammar.WIDTH] = appConstants.DEFAULT_WIDTH
    json[grammar.PROPERTIES][grammar.HEIGHT] = appConstants.DEFAULT_HEIGHT

    return json
}