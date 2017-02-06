import * as types from '../../const/actionTypes'
import * as entityTypes from  '../../const/entityTypes'
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
    selectedEntityId: null
})

function runMethod(entity, methodName) {
    //store current properties so we can revert to it after run

    let code = {
        text : '',
        insertNewLine: function(line) {
            this.text += line + '\n'
        }
    }
    code.insertNewLine('"use strict"')

    //prepare context

    //////add properties of the entity to code
    entity.get('properties').forEach(function(value, key) {
        code.insertNewLine(key + ' = ' + value)
    })

    //////add all methods to code
    entity.get('methods').forEach(function(value, key) {
        code.insertNewLine(key + ' = -> ' + value.replace(/(?:\r\n|\r|\n)/g, ';'))
    })

    // add execute method line
    code.insertNewLine(methodName + '()')

    //create the json that holds all the properties to be used for extracting outputs from the run
    code.insertNewLine('return {')
    entity.get('properties').forEach(function(value, key) {
        code.insertNewLine('    ' + key + ':' + key + ',')
    })

    code.text = code.text.substr(0, code.text.length - 2)
    code.insertNewLine('}')

    //run the code
    let jsCode = CoffeeScript.compile(code.text)
    let output = eval(jsCode)

    //extract properties and update the entity model
    entity.get('properties').forEach(function(value, key) {
        entity = entity.setIn(['properties', key], output[key])
    })

    return entity
}


export default function editorsReducer(state = initialState, action = undefined) {

    switch (action.type) {
    case types.ADD_NEW_ENTITY:
        let newEntity = createEntity(action.entityType)
        state = state.setIn(['entities', newEntity.get('id')], newEntity)
        return state.set('selectedEntityId', newEntity.get('id'))
    case types.SAVE_ENTITY:
        return state
    case types.ADD_NEW_METHOD:
        state = state.setIn(['entities', action.entityId, 'methods', action.methodName], '')
        return state.setIn(['entities', action.entityId, 'selectedMethod'], action.methodName)
    case types.SELECT_METHOD:
        return state.setIn(['entities', action.entityId, 'selectedMethod'], action.methodName)
    case types.UPDATE_METHOD_BODY:
        return state.setIn(['entities', action.entityId, 'methods', action.methodName], action.methodBody)
    case types.INSERT_TEXT_TO_METHOD:
        let currentBody = state.getIn(['entities', action.entityId, 'methods', action.methodName])
        if (currentBody && !currentBody.endsWith(' ')) {
            currentBody += ' '
        }
        currentBody += action.text + ' '
        return state.setIn(['entities', action.entityId, 'methods', action.methodName], currentBody)
    case types.RUN_METHOD:
        let entity = runMethod(state.getIn(['entities', action.entityId]), action.methodName)
        return state.setIn(['entities', action.entityId], entity)
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
    return Immutable.fromJS({
        id: counter,
        key: counter++,
        entityType: entityTypes.SQUARE,
        properties: {
            leftRight: DEFAULT_X_POSITION + counter * DEFAULT_WIDTH * 2,
            upDown   : DEFAULT_Y_POSITION,
            width    : DEFAULT_WIDTH,
            height   : DEFAULT_HEIGHT
        },
        methods: {},
        selectedMethod: ''

    })
}


