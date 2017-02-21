import * as grammar from  '../../const/grammar'
import * as appConstants from  '../../const/appConstants'
import CoffeeScript from 'coffee-script'

export function resetRun(entity) {
    entity = entity.setIn([grammar.RUN_DATA, grammar.LINE_NUMBER], -1)
    entity = resetEntityProps(entity)
    return entity.setIn([grammar.RUN_DATA, grammar.RUN_STATUS], grammar.RunStatuses.IDLE)
}

export function pauseRun(entity) {
    return entity.setIn([grammar.RUN_DATA, grammar.RUN_STATUS], grammar.RunStatuses.PAUSED)
}


export function createMethod(isPreDefined = false, params, script = '') {
    let json = {}
    json[grammar.METHOD_SCRIPT] = script
    json[grammar.IS_METHOD_PRE_DEFINED] = isPreDefined
    json[grammar.METHOD_PARAMS] = params
    return json
}

export function runMethod(entity, methodName, context) {
    entity = entity.setIn([grammar.RUN_DATA, grammar.METHOD_NAME], methodName)
    entity = entity.setIn([grammar.RUN_DATA, grammar.RUN_STATUS], grammar.RunStatuses.RUNNING)
    return runMethodNextLine(entity, context)
}

export function runMethodNextLine(entity, context) {

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
        if (typeof value === 'string') {
            code.insertNewLine(key + ' = "' + value + '"')
        } else {
            code.insertNewLine(key + ' = ' + value)
        }
    })

    // add context to the code
    if (context) {
        context.forEach(function (item) {
            if (typeof item.value === 'string') {
                code.insertNewLine(item.key + ' = "' + item.value + '"')
            } else {
                code.insertNewLine(item.key + ' = ' + item.value)
            }
        })
    }

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



function resetEntityProps(entity) {
    entity = entity.setIn([grammar.PROPERTIES, grammar.X], appConstants.DEFAULT_X_POSITION)
    entity = entity.setIn([grammar.PROPERTIES, grammar.Y], appConstants.DEFAULT_Y_POSITION)
    entity = entity.setIn([grammar.PROPERTIES, grammar.WIDTH], appConstants.DEFAULT_WIDTH)
    entity = entity.setIn([grammar.PROPERTIES, grammar.HEIGHT], appConstants.DEFAULT_HEIGHT)
    return entity
}
