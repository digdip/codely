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

const initialState = Immutable.fromJS({
    entities: {},
    selectedEntityId: null,
    appMode: appConstants.AppMode.EDITING
})

export default function editorsReducer(state = initialState, action = undefined) {

    switch (action.type) {
        case types.ADD_NEW_ENTITY:
            let newEntity = createEntity(action.entityType)
            state = state.setIn([grammar.ENTITIES, newEntity.get(grammar.ID)], newEntity)
            return state.set(grammar.SELECTED_ENTITY_ID, newEntity.get(grammar.ID))
        case types.ADD_NEW_METHOD:
            state = state.setIn([grammar.ENTITIES, action.entityId, grammar.METHODS, action.methodName], Immutable.fromJS(createMethod()))
            return state.setIn([grammar.ENTITIES, action.entityId, grammar.SELECTED_METHOD], action.methodName)
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
            return state.setIn([grammar.ENTITIES, action.entityId], runMethod(state.getIn([grammar.ENTITIES, action.entityId]), action.methodName))
        case types.RUN_NEXT_LINE:
            return state.setIn([grammar.ENTITIES, action.entityId], runMethodNextLine(state.getIn([grammar.ENTITIES, action.entityId])))
        case types.ENTER_GAME_MODE:
            return state.set(grammar.APP_MODE, appConstants.AppMode.GAME)
        case types.ENTER_EDITING_MODE:
            return state.set(grammar.APP_MODE, appConstants.AppMode.EDITING)
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
            return createSquare(runMethodScript)
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

function createSquare(runMethodScript) {
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
    json[grammar.METHODS][grammar.MAIN_METHOD] = createMethod(true, runMethodScript ? runMethodScript : '')
    json[grammar.METHODS][grammar.ON_KEY_UP] = createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_DOWN] = createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_LEFT] = createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_RIGHT] = createMethod(true)
    json[grammar.PROPERTIES][grammar.X] = DEFAULT_X_POSITION
    json[grammar.PROPERTIES][grammar.Y] = DEFAULT_Y_POSITION
    json[grammar.PROPERTIES][grammar.WIDTH] = DEFAULT_WIDTH
    json[grammar.PROPERTIES][grammar.HEIGHT] = DEFAULT_HEIGHT

    return Immutable.fromJS(json)
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