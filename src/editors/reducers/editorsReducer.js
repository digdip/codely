import * as types from '../../const/actionTypes'
import * as entityTypes from  '../../const/entityTypes'
import * as grammar from  '../../const/grammar'
import Immutable from 'immutable'
import CoffeeScript from 'coffee-script'

const DEFAULT_X_POSITION = 4
const DEFAULT_Y_POSITION = 5
const DEFAULT_WIDTH = 2
const DEFAULT_HEIGHT = 2
const DEFAULT_COLOR = 'red'

let counter = 0

const initialState = Immutable.fromJS({
    entities: {},
    selectedEntityId: null,
    demos: {
        '1': createDemo1()
    }
})

function createDemo1() {
    let script = 'Left += 10\nWidth += 3\nLeft += 10\nWidth += 3\nTop +=3\nHeight +=2\nTop +=3\nHeight +=2'
    return createEntity(entityTypes.SQUARE, script)
}

export default function editorsReducer(state = initialState, action = undefined) {

    switch (action.type) {
        case types.ADD_NEW_ENTITY:
            let newEntity = createEntity(action.entityType)
            state = state.setIn([grammar.ENTITIES, newEntity.get('id')], newEntity)
            return state.set(grammar.SELECTED_ENTITY_ID, newEntity.get('id'))
        case types.SAVE_ENTITY:
            return state
        case types.ADD_NEW_METHOD:
            state = state.setIn([grammar.ENTITIES, action.entityId, 'methods', action.methodName], '')
            return state.setIn([grammar.ENTITIES, action.entityId, 'selectedMethod'], action.methodName)
        case types.SELECT_METHOD:
            return state.setIn([grammar.ENTITIES, action.entityId, 'selectedMethod'], action.methodName)
        case types.UPDATE_METHOD_BODY:
            return state.setIn([grammar.ENTITIES, action.entityId, 'methods', action.methodName], action.methodBody)
        case types.INSERT_TEXT_TO_METHOD:
            let currentBody = state.getIn([grammar.ENTITIES, action.entityId, 'methods', action.methodName])
            if (currentBody && !currentBody.endsWith(' ')) {
                currentBody += ' '
            }
            currentBody += action.text + ' '
            return state.setIn([grammar.ENTITIES, action.entityId, 'methods', action.methodName], currentBody)
        case types.RUN_METHOD:
            if(action.methodName === 'main') {
                //play the demo also (hard coded 1 as the demo for now
                state = state.setIn([grammar.DEMOS, '1'], runMethod(state.getIn([grammar.DEMOS, '1']), grammar.MAIN_METHOD))
            }
            return state.setIn([grammar.ENTITIES, action.entityId], runMethod(state.getIn([grammar.ENTITIES, action.entityId]), action.methodName))
        case types.RUN_NEXT_LINE:
            return state.setIn([grammar.ENTITIES, action.entityId], runMethodNextLine(state.getIn([grammar.ENTITIES, action.entityId])))
        case types.RUN_NEXT_DEMO_LINE:
            return state.setIn([grammar.DEMOS, action.demoId], runMethodNextLine(state.getIn([grammar.DEMOS, action.demoId])))
        case types.PLAY_DEMO:
            return state.setIn([grammar.DEMOS, action.demoId], runMethod(state.getIn([grammar.DEMOS, action.demoId]), grammar.MAIN_METHOD))
        case types.RESET_DEMO:
            return state.setIn([grammar.DEMOS, action.demoId], resetRun(state.getIn([grammar.DEMOS, action.demoId])))
        case types.RESET_ENTITY:
            state = state.setIn([grammar.ENTITIES, action.entityId], resetRun(state.getIn([grammar.ENTITIES, action.entityId])))
            return state.setIn([grammar.DEMOS, '1'], resetRun(state.getIn([grammar.DEMOS, '1'])))
        default:
            return state
    }

}

function runMethod(entity, methodName) {
    entity = entity.setIn([grammar.RUN_DATA, 'methodName'], methodName)
    entity = entity.setIn([grammar.RUN_DATA, grammar.RUN_CANCELED], false)
    return runMethodNextLine(entity)
}

function runMethodNextLine(entity) {

    if (entity.getIn([grammar.RUN_DATA, grammar.RUN_CANCELED])) {
        return entity
    }

    let code = {
        text: '',
        insertNewLine: function (line) {
            this.text += line + '\n'
        }
    }
    code.insertNewLine('"use strict"')

    let methodName = entity.getIn([grammar.RUN_DATA, 'methodName'])
    let lineNumber = entity.getIn([grammar.RUN_DATA, 'lineNumber'])
    let runComplete = false

    //increment line number
    entity = entity.setIn([grammar.RUN_DATA, 'lineNumber'], ++lineNumber)

    //prepare context

    //////add properties of the entity to code
    entity.get('properties').forEach(function (value, key) {
        code.insertNewLine(key + ' = ' + value)
    })

    //////add all other methods to code
    entity.get('methods').forEach(function (value, key) {
        if (key !== methodName) {
            code.insertNewLine(key + ' = -> ' + value.replace(/(?:\r\n|\r|\n)/g, ';'))
        } else {
            let methodLines = value.split(/(?:\r\n|\r|\n)/g)
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
    entity.get('properties').forEach(function (value, key) {
        code.insertNewLine('    ' + key + ':' + key + ',')
    })

    code.text = code.text.substr(0, code.text.length - 2)
    code.insertNewLine('}')

    //run the code
    let jsCode = CoffeeScript.compile(code.text)
    let output = eval(jsCode)

    //extract properties and update the entity model
    entity.get('properties').forEach(function (value, key) {
        entity = entity.setIn(['properties', key], output[key])
    })

    if (runComplete) {
        entity = entity.setIn([grammar.RUN_DATA, 'lineNumber'], -1)
    }

    return entity
}

//
//function resetDemo(state, demoId) {
//    //the next line tries to stop running the demo, for some reason it doesn't work
//    state = state.setIn([grammar.DEMOS, demoId], resetRun(state.getIn([grammar.DEMOS, demoId])))
//    return state.setIn([grammar.DEMOS, demoId], resetEntityProps(state.getIn([grammar.DEMOS, demoId])))
//}

function createEntity(entityType, runMethodScript) {
    switch (entityType) {
        case entityTypes.SQUARE:
            return createSquare(runMethodScript)
        default:
            return {}
    }
}

function createSquare(runMethodScript) {
    let json = {
        id: counter,
        key: counter++,
        entityType: entityTypes.SQUARE,
        properties: {},
        methods: {},
        selectedMethod: grammar.MAIN_METHOD
    }
    json[grammar.RUN_DATA] = {
        lineNumber: -1,
        methodName: '',
        runCanceled: false
    }
    json.methods[grammar.MAIN_METHOD] = runMethodScript ? runMethodScript : ''
    json.properties[grammar.X] = DEFAULT_X_POSITION
    json.properties[grammar.Y] = DEFAULT_Y_POSITION
    json.properties[grammar.WIDTH] = DEFAULT_WIDTH
    json.properties[grammar.HEIGHT] = DEFAULT_HEIGHT

    return Immutable.fromJS(json)
}

function resetEntityProps(entity) {
    entity = entity.setIn(['properties', grammar.X], DEFAULT_X_POSITION)
    entity = entity.setIn(['properties', grammar.Y], DEFAULT_Y_POSITION)
    entity = entity.setIn(['properties', grammar.WIDTH], DEFAULT_WIDTH)
    entity = entity.setIn(['properties', grammar.HEIGHT], DEFAULT_HEIGHT)
    return entity
}

function resetRun(entity) {
    entity = entity.setIn([grammar.RUN_DATA, 'lineNumber'], -1)
    entity = resetEntityProps(entity)
    return entity.setIn([grammar.RUN_DATA, grammar.RUN_CANCELED], true)
}