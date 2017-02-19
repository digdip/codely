import * as types from '../../const/actionTypes'
import * as appConstants from  '../../const/appConstants'
import * as grammar from  '../../const/grammar'
import * as reducerUtils from  '../../common/reducers/reducerUtils'
import Immutable from 'immutable'
import uuid from 'uuid'

const TEMP_ENTITY_ID = '1'

let squareEntity = createSquare('', TEMP_ENTITY_ID)
var model = {
    entities: {'1': squareEntity},
    demos: {
        '1': createDemo1()
    }
}

const initialState = Immutable.fromJS(model)

function createDemo1() {
    let script = 'Left += 10\nWidth += 3\nLeft += 10\nWidth += 3\nTop +=3\nHeight +=2\nTop +=3\nHeight +=2'
    return createEntity(appConstants.EntityType.SQUARE, script)
}

export default function editorsReducer(state = initialState, action = undefined) {

    switch (action.type) {
        case types.ADD_NEW_METHOD:
            state = state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID, grammar.METHODS, action.methodName], Immutable.fromJS(reducerUtils.createMethod()))
            return state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID, grammar.SELECTED_METHOD], action.methodName)
        case types.SELECT_METHOD:
            return state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID, grammar.SELECTED_METHOD], action.methodName)
        case types.UPDATE_METHOD_BODY:
            return state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID, grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT], action.methodBody)
        case types.INSERT_TEXT_TO_METHOD:
            let currentBody = state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID, grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT])
            if (currentBody && !currentBody.endsWith(' ')) {
                currentBody += ' '
            }
            currentBody += action.text + ' '
            return state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID, grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT], currentBody)
        case types.RUN_METHOD:
            if(action.methodName === grammar.MAIN_METHOD) {
                //play the demo also (hard coded 1 as the demo for now
                state = state.setIn([grammar.DEMOS, '1'], reducerUtils.runMethod(state.getIn([grammar.DEMOS, '1']), grammar.MAIN_METHOD))
            }
            return state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID], reducerUtils.runMethod(state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID]), action.methodName))
        case types.RUN_NEXT_LINE:
            return state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID], reducerUtils.runMethodNextLine(state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID])))
        case types.RUN_NEXT_DEMO_LINE:
            return state.setIn([grammar.DEMOS, action.demoId], reducerUtils.runMethodNextLine(state.getIn([grammar.DEMOS, action.demoId])))
        case types.PLAY_DEMO:
            return state.setIn([grammar.DEMOS, action.demoId], reducerUtils.runMethod(state.getIn([grammar.DEMOS, action.demoId]), grammar.MAIN_METHOD))
        case types.RESET_DEMO:
            return state.setIn([grammar.DEMOS, action.demoId], reducerUtils.resetRun(state.getIn([grammar.DEMOS, action.demoId])))
        case types.RESET_ENTITY:
            state = state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID], reducerUtils.resetRun(state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID])))
            return state.setIn([grammar.DEMOS, '1'], reducerUtils.resetRun(state.getIn([grammar.DEMOS, '1'])))
        case types.PAUSE_DEMO:
            return state.setIn([grammar.DEMOS, '1'], reducerUtils.pauseRun(state.getIn([grammar.DEMOS, '1'])))
        case types.PAUSE_ENTITY:
            state = state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID], reducerUtils.pauseRun(state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID])))
            return state.setIn([grammar.DEMOS, '1'], reducerUtils.pauseRun(state.getIn([grammar.DEMOS, '1'])))
        default:
            return state
    }

}

function createEntity(entityType, runMethodScript) {
    switch (entityType) {
        case appConstants.EntityType.SQUARE:
            let id = uuid()
            return Immutable.fromJS(createSquare(runMethodScript, id))
        default:
            return {}
    }
}

function createSquare(runMethodScript, id) {
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
    json[grammar.METHODS][grammar.MAIN_METHOD] = reducerUtils.createMethod(true, runMethodScript ? runMethodScript : '')
    json[grammar.PROPERTIES][grammar.X] = appConstants.DEFAULT_X_POSITION
    json[grammar.PROPERTIES][grammar.Y] = appConstants.DEFAULT_Y_POSITION
    json[grammar.PROPERTIES][grammar.WIDTH] = appConstants.DEFAULT_WIDTH
    json[grammar.PROPERTIES][grammar.HEIGHT] = appConstants.DEFAULT_HEIGHT

    return json
}
