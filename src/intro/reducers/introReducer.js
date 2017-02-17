import * as types from '../../const/actionTypes'
import * as appConstants from  '../../const/appConstants'
import * as grammar from  '../../const/grammar'
import Immutable from 'immutable'
import CoffeeScript from 'coffee-script'
import uuid from 'uuid'
const DEFAULT_X_POSITION = 4
const DEFAULT_Y_POSITION = 5
const DEFAULT_WIDTH = 2
const DEFAULT_HEIGHT = 2
const DEFAULT_COLOR = 'red'

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
            state = state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID, grammar.METHODS, action.methodName], Immutable.fromJS(createMethod()))
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
                state = state.setIn([grammar.DEMOS, '1'], runMethod(state.getIn([grammar.DEMOS, '1']), grammar.MAIN_METHOD))
            }
            return state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID], runMethod(state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID]), action.methodName))
        case types.RUN_NEXT_LINE:
            return state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID], runMethodNextLine(state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID])))
        case types.RUN_NEXT_DEMO_LINE:
            return state.setIn([grammar.DEMOS, action.demoId], runMethodNextLine(state.getIn([grammar.DEMOS, action.demoId])))
        case types.PLAY_DEMO:
            return state.setIn([grammar.DEMOS, action.demoId], runMethod(state.getIn([grammar.DEMOS, action.demoId]), grammar.MAIN_METHOD))
        case types.RESET_DEMO:
            return state.setIn([grammar.DEMOS, action.demoId], resetRun(state.getIn([grammar.DEMOS, action.demoId])))
        case types.RESET_ENTITY:
            state = state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID], resetRun(state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID])))
            return state.setIn([grammar.DEMOS, '1'], resetRun(state.getIn([grammar.DEMOS, '1'])))
        case types.PAUSE_DEMO:
            return state.setIn([grammar.DEMOS, '1'], pauseRun(state.getIn([grammar.DEMOS, '1'])))
        case types.PAUSE_ENTITY:
            state = state.setIn([grammar.ENTITIES, TEMP_ENTITY_ID], pauseRun(state.getIn([grammar.ENTITIES, TEMP_ENTITY_ID])))
            return state.setIn([grammar.DEMOS, '1'], pauseRun(state.getIn([grammar.DEMOS, '1'])))
        default:
            return state
    }

}

function runMethod(entity, methodName) {
    entity = entity.setIn([grammar.RUN_DATA, grammar.METHOD_NAME], methodName)
    entity = entity.setIn([grammar.RUN_DATA, grammar.RUN_STATUS], grammar.RunStatuses.RUNNING)
    return runMethodNextLine(entity)
}

function runMethodNextLine(entity) {

    if (entity.getIn([grammar.RUN_DATA, grammar.RUN_STATUS]) !== grammar.RunStatuses.RUNNING) {
        return entity
    }

    let code = {
        text: '',
        insertNewLine: function (line) {
            this.text += line + '\n'
        }
    }
    code.insertNewLine('"use strict"')

    let methodName = entity.getIn([grammar.RUN_DATA, grammar.METHOD_NAME])
    let lineNumber = entity.getIn([grammar.RUN_DATA, grammar.LINE_NUMBER])
    let runComplete = false

    //increment line number
    entity = entity.setIn([grammar.RUN_DATA, grammar.LINE_NUMBER], ++lineNumber)

    //prepare context

    //////add properties of the entity to code
    entity.get(grammar.PROPERTIES).forEach(function (value, key) {
        code.insertNewLine(key + ' = ' + value)
    })

    //////add all other methods to code
    entity.get(grammar.METHODS).forEach(function (value, key) {
        let script = value.get(grammar.METHOD_SCRIPT)
        if (key !== methodName) {
            code.insertNewLine(key + ' = -> ' + script.replace(/(?:\r\n|\r|\n)/g, ';'))
        } else {
            let methodLines = script.split(/(?:\r\n|\r|\n)/g)
            if (lineNumber === methodLines.length - 1) {
                runComplete = true
            }
            code.insertNewLine(key + ' = -> ' + methodLines[lineNumber])
        }
    })

    // add execute method line
    code.insertNewLine(methodName + '()')

    //create the json that holds all the properties to be used for extracting outputs from the run
    code.insertNewLine('return {')
    entity.get(grammar.PROPERTIES).forEach(function (value, key) {
        code.insertNewLine('    ' + key + ':' + key + ',')
    })

    code.text = code.text.substr(0, code.text.length - 2)
    code.insertNewLine('}')

    //run the code
    let jsCode = CoffeeScript.compile(code.text)
    let output = eval(jsCode)

    //extract properties and update the entity model
    entity.get(grammar.PROPERTIES).forEach(function (value, key) {
        entity = entity.setIn([grammar.PROPERTIES, key], output[key])
    })

    if (runComplete) {
        entity = entity.setIn([grammar.RUN_DATA, grammar.LINE_NUMBER], -1)
        entity = entity.setIn([grammar.RUN_DATA, grammar.RUN_STATUS], grammar.RunStatuses.IDLE)
    }

    return entity
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

function createMethod(isPreDefined = false, script = '') {
    let json = {}
    json[grammar.METHOD_SCRIPT] = script
    json[grammar.IS_METHOD_PRE_DEFINED] = isPreDefined
    return json
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
    json[grammar.METHODS][grammar.MAIN_METHOD] = createMethod(true, runMethodScript ? runMethodScript : '')
    json[grammar.METHODS][grammar.ON_KEY_UP] = createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_DOWN] = createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_LEFT] = createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_RIGHT] = createMethod(true)
    json[grammar.PROPERTIES][grammar.X] = DEFAULT_X_POSITION
    json[grammar.PROPERTIES][grammar.Y] = DEFAULT_Y_POSITION
    json[grammar.PROPERTIES][grammar.WIDTH] = DEFAULT_WIDTH
    json[grammar.PROPERTIES][grammar.HEIGHT] = DEFAULT_HEIGHT

    return json
}

function resetEntityProps(entity) {
    entity = entity.setIn([grammar.PROPERTIES, grammar.X], DEFAULT_X_POSITION)
    entity = entity.setIn([grammar.PROPERTIES, grammar.Y], DEFAULT_Y_POSITION)
    entity = entity.setIn([grammar.PROPERTIES, grammar.WIDTH], DEFAULT_WIDTH)
    entity = entity.setIn([grammar.PROPERTIES, grammar.HEIGHT], DEFAULT_HEIGHT)
    return entity
}

function resetRun(entity) {
    entity = entity.setIn([grammar.RUN_DATA, grammar.LINE_NUMBER], -1)
    entity = resetEntityProps(entity)
    return entity.setIn([grammar.RUN_DATA, grammar.RUN_STATUS], grammar.RunStatuses.IDLE)
}

function pauseRun(entity) {
    return entity.setIn([grammar.RUN_DATA, grammar.RUN_STATUS], grammar.RunStatuses.PAUSED)
}