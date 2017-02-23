import * as types from '../../const/actionTypes'
import * as appConstants from  '../../const/appConstants'
import * as grammar from  '../../const/grammar'
import * as reducerUtils from  '../../common/reducers/reducerUtils'
import Immutable from 'immutable'
import uuid from 'uuid'


function createInitialModel() {
    let model = {
        mainCharacterPrototype: {},
        enemyPrototype: {},
        selectedEntityRole: appConstants.EntityRole.MAIN_CHARACTER,
        appMode: appConstants.AppMode.EDITING,
        turnStatus: grammar.TurnStatuses.IDLE,
        mainCharacter: {},
        enemies: {},
        gameBoard: {
            Width: 0,
            Height: 0
        }
    }
    model[appConstants.EntityRole.MAIN_CHARACTER] = createSquare(appConstants.EntityRole.MAIN_CHARACTER)
    model[appConstants.EntityRole.ENEMY] = createSquare(appConstants.EntityRole.ENEMY, appConstants.DEFAULT_X_POSITION + appConstants.DEFAULT_WIDTH * 3, null, 'blue')
    return model
}
const initialState = Immutable.fromJS(createInitialModel())


export default function gameReducer(state = initialState, action = undefined) {

    switch (action.type) {
        case types.SELECT_ENTITY:
            return state.set(grammar.SELECTED_ENTITY_ROLE, getEntityRoleById(action.entityId, state))
        case types.ADD_NEW_METHOD:
            state = state.setIn([getEntityRoleById(action.entityId, state), grammar.METHODS, action.methodName], Immutable.fromJS(reducerUtils.createMethod()))
            return state.setIn([getEntityRoleById(action.entityId, state), grammar.SELECTED_METHOD], action.methodName)
        case types.SELECT_METHOD:
            return state.setIn([getEntityRoleById(action.entityId, state), grammar.SELECTED_METHOD], action.methodName)
        case types.UPDATE_METHOD_BODY:
            return state.setIn([getEntityRoleById(action.entityId, state), grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT], action.methodBody)
        case types.INSERT_TEXT_TO_METHOD:
            let currentBody = state.getIn([getEntityRoleById(action.entityId, state), grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT])
            if (currentBody && !currentBody.endsWith(' ')) {
                currentBody += ' '
            }
            currentBody += action.text + ' '
            return state.setIn([getEntityRoleById(action.entityId, state), grammar.METHODS, action.methodName, grammar.METHOD_SCRIPT], currentBody)
        case types.RUN_METHOD:
            return state.set(getEntityRoleById(action.entityId, state), reducerUtils.runMethod(state.get(getEntityRoleById(action.entityId, state)), action.methodName))
        case types.RUN_NEXT_LINE:
            return state.set(getEntityRoleById(action.entityId, state), reducerUtils.runMethodNextLine(state.get(getEntityRoleById(action.entityId, state))))
        case types.RESET_ENTITY:
            return state.set(getEntityRoleById(action.entityId, state), reducerUtils.resetRun(state.get(getEntityRoleById(action.entityId, state))))
        case types.PAUSE_ENTITY:
            return state.set(getEntityRoleById(action.entityId, state), reducerUtils.pauseRun(state.get(getEntityRoleById(action.entityId, state))))
        case types.ENTER_GAME_MODE:
            state = generateGameWorld(state, 4)
            return state.set(grammar.APP_MODE, appConstants.AppMode.GAME)
        case types.ENTER_EDITING_MODE:
            return state.set(grammar.APP_MODE, appConstants.AppMode.EDITING)
        case types.UPDATE_GAME_BOARD_SIZE:
            state = state.setIn([grammar.GAME_BOARD, grammar.WIDTH], action.width)
            return state.setIn([grammar.GAME_BOARD, grammar.HEIGHT], action.height)
        case types.START_TURN:
            return startTurn(state, action.methodName)
        case types.CONTINUE_TURN:
            return continueTurn(state)
        default:
            return state
    }
}

function getEntityRoleById(entityId, state) {
    return entityId === state.getIn([grammar.MAIN_CHARACTER_PROTOTYPE, grammar.ID]) ? grammar.MAIN_CHARACTER_PROTOTYPE : grammar.ENEMY_PROTOTYPE
}

function startEnemiesTurn(state) {
    let envVars = []
    envVars.push({
        key: appConstants.GAME_PARAM_MAIN_CHAR_X_POS,
        value: state.getIn([grammar.MAIN_CHARACTER, grammar.PROPERTIES, grammar.X])
    })
    envVars.push({
        key: appConstants.GAME_PARAM_MAIN_CHAR_Y_POS,
        value: state.getIn([grammar.MAIN_CHARACTER, grammar.PROPERTIES, grammar.Y])
    })

    state = state.set(grammar.TURN_STATUS, grammar.TurnStatuses.ENEMIES_RUNNING)
    state.get(grammar.ENEMIES).map((enemy, enemyId) => {
        if (enemy.getIn([grammar.RUN_DATA, grammar.COLLISIONS])) {
            state = state.setIn([grammar.ENEMIES, enemyId], reducerUtils.runMethod(enemy, grammar.ON_COLLISION))
        } else {
            enemy = enemy.setIn([grammar.RUN_DATA, grammar.ENV_VARS], envVars)
            state = state.setIn([grammar.ENEMIES, enemyId], reducerUtils.runMethod(enemy, grammar.ON_MAIN_CHARACTER_MOVE))
        }
    })
    return state
}

function continueMainCharTurn(state) {
    if (state.getIn([grammar.MAIN_CHARACTER, grammar.RUN_DATA, grammar.COLLISIONS])) {
        state = state.set(grammar.MAIN_CHARACTER, reducerUtils.runMethod(state.get(grammar.MAIN_CHARACTER), grammar.ON_COLLISION))
    } else {
        state = state.set(grammar.MAIN_CHARACTER, reducerUtils.runMethodNextLine(state.get(grammar.MAIN_CHARACTER)))
        if (state.getIn([grammar.MAIN_CHARACTER, grammar.RUN_DATA, grammar.RUN_STATUS]) === grammar.RunStatuses.IDLE) {
            state = state.set(grammar.TURN_STATUS, grammar.TurnStatuses.MAIN_CHAR_DONE)
        }
    }
    return state
}

function continueEnemiesTurn(state) {
    let finishedTurn = true
    state.get(grammar.ENEMIES).map((enemy, enemyId) => {
        if (enemy.getIn([grammar.RUN_DATA, grammar.COLLISIONS])) {
            state = state.setIn([grammar.ENEMIES, enemyId], reducerUtils.runMethod(enemy, grammar.ON_COLLISION))
        } else {
            state = state.setIn([grammar.ENEMIES, enemyId], reducerUtils.runMethodNextLine(state.getIn([grammar.ENEMIES, enemyId])))
            if (state.getIn([grammar.ENEMIES, enemyId, grammar.RUN_DATA, grammar.RUN_STATUS]) !== grammar.RunStatuses.IDLE) {
                finishedTurn = false
            }
        }
    })
    if(finishedTurn) {
        state = state.set(grammar.TURN_STATUS, grammar.TurnStatuses.IDLE)
    }
    return state
}

function startTurn(state, methodName) {
    if (state.getIn([grammar.MAIN_CHARACTER, grammar.RUN_DATA, grammar.COLLISIONS])) {
        state = state.set(grammar.MAIN_CHARACTER, reducerUtils.runMethod(state.get(grammar.MAIN_CHARACTER), grammar.ON_COLLISION))
    } else {
        state = state.set(grammar.MAIN_CHARACTER, reducerUtils.runMethod(state.get(grammar.MAIN_CHARACTER), methodName))
    }
    state = state.set(grammar.TURN_STATUS, grammar.TurnStatuses.MAIN_CHAR_RUNNING)
    return checkCollisions(state)
}

function continueTurn(state) {
    switch (state.get(grammar.TURN_STATUS)) {
        case grammar.TurnStatuses.MAIN_CHAR_RUNNING:
            //continue main turn
            state = continueMainCharTurn(state)
        case grammar.TurnStatuses.MAIN_CHAR_DONE:
            //start enemies turns
            state = startEnemiesTurn(state)
        case grammar.TurnStatuses.ENEMIES_RUNNING:
            //continue enemies turns
            state = continueEnemiesTurn(state)
    }
    return checkCollisions(state)
}

function addMainCharacterMethods(json) {
    json[grammar.METHODS][grammar.ON_KEY_UP] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_DOWN] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_LEFT] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_RIGHT] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_UP_RIGHT] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_DOWN_RIGHT] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_DOWN_LEFT] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_KEY_UP_LEFT] = reducerUtils.createMethod(true)
    json[grammar.METHODS][grammar.ON_COLLISION] = reducerUtils.createMethod(true)
}

function addEnemyMethods(json) {
    let params = [appConstants.GAME_PARAM_MAIN_CHAR_X_POS, appConstants.GAME_PARAM_MAIN_CHAR_Y_POS]
    json[grammar.METHODS][grammar.ON_MAIN_CHARACTER_MOVE] = reducerUtils.createMethod(true, params)
    json[grammar.METHODS][grammar.ON_COLLISION] = reducerUtils.createMethod(true)
}

function createSquare(entityRole, xPos, yPos, color) {
    let id = uuid()
    let json = {
        id: id,
        key: id,
        entityType: appConstants.EntityType.SQUARE,
        properties: {},
        methods: {},
        eventHandlers: {},
        selectedMethod: ''
    }
    json[grammar.RUN_DATA] = {
        lineNumber: -1,
        methodName: '',
        envVars: [],
        runStatus: grammar.RunStatuses.IDLE
    }
    if (entityRole === appConstants.EntityRole.MAIN_CHARACTER) {
        addMainCharacterMethods(json)
    } else {
        addEnemyMethods(json)
    }
    json[grammar.PROPERTIES][grammar.X] = xPos ? xPos : appConstants.DEFAULT_X_POSITION
    json[grammar.PROPERTIES][grammar.Y] = yPos ? yPos : appConstants.DEFAULT_Y_POSITION
    json[grammar.PROPERTIES][grammar.WIDTH] = appConstants.DEFAULT_WIDTH
    json[grammar.PROPERTIES][grammar.HEIGHT] = appConstants.DEFAULT_HEIGHT
    json[grammar.PROPERTIES][grammar.COLOR] = color ? color : appConstants.DEFAULT_COLOR
    json[grammar.PROPERTIES][grammar.IS_VISIBLE] = true

    return json
}

function generateGameWorld(state, numberOfEnemies) {
    let mainCharacterInstance = state.get(grammar.MAIN_CHARACTER_PROTOTYPE)
    let xPos = Math.floor(state.getIn([grammar.GAME_BOARD, grammar.WIDTH]) / appConstants.GRID_SIZE_PIXELS) / 2
    let yPos = Math.floor(state.getIn([grammar.GAME_BOARD, grammar.HEIGHT]) / appConstants.GRID_SIZE_PIXELS) / 2
    mainCharacterInstance = mainCharacterInstance.setIn([grammar.PROPERTIES, grammar.X], xPos)
    mainCharacterInstance = mainCharacterInstance.setIn([grammar.PROPERTIES, grammar.Y], yPos)
    mainCharacterInstance = mainCharacterInstance.set(grammar.ID, uuid())
    state = state.set(grammar.MAIN_CHARACTER, mainCharacterInstance)

    let enemies = Immutable.fromJS({})
    for (let i = 0; i < numberOfEnemies; i++) {
        let enemyInstance = state.get(grammar.ENEMY_PROTOTYPE)
        xPos = Math.floor(Math.random() * state.getIn([grammar.GAME_BOARD, grammar.WIDTH]) / appConstants.GRID_SIZE_PIXELS)
        yPos = Math.floor(Math.random() * state.getIn([grammar.GAME_BOARD, grammar.HEIGHT]) / appConstants.GRID_SIZE_PIXELS)
        enemyInstance = enemyInstance.setIn([grammar.PROPERTIES, grammar.X], xPos)
        enemyInstance = enemyInstance.setIn([grammar.PROPERTIES, grammar.Y], yPos)
        enemyInstance = enemyInstance.set(grammar.ID, uuid())
        enemies = enemies.set(enemyInstance.get(grammar.ID), enemyInstance)
    }
    return state.set(grammar.ENEMIES, enemies)
}

function getEntityRect(entity) {
    return {
        x1: entity.getIn([grammar.PROPERTIES, grammar.X]),
        x2: entity.getIn([grammar.PROPERTIES, grammar.X]) + entity.getIn([grammar.PROPERTIES, grammar.WIDTH]),
        y1: entity.getIn([grammar.PROPERTIES, grammar.Y]),
        y2: entity.getIn([grammar.PROPERTIES, grammar.Y]) + entity.getIn([grammar.PROPERTIES, grammar.HEIGHT])
    }
}
function areColliding(entity1, entity2) {
    var rect1 = getEntityRect(entity1)
    var rect2 = getEntityRect(entity2)

    if (rect1.x1 <= rect2.x2 && rect1.x2 >= rect2.x1 &&
        rect1.y1 <= rect2.y2 && rect1.y2 >= rect2.y1){
        return true
    }
    return false
}

function addCollisionToEntity(entity, collidingEntityId) {
    let entityCollisions = entity.getIn([grammar.RUN_DATA, grammar.COLLISIONS])
    if (!entityCollisions) {
        entityCollisions = Immutable.Set([])
        entity = entity.setIn([grammar.RUN_DATA, grammar.COLLISIONS], entityCollisions)
    }
    return entity.setIn([grammar.RUN_DATA, grammar.COLLISIONS], entityCollisions.add(collidingEntityId))
}

function checkCollisions(state) {
    //go over all enemies
    state.get(grammar.ENEMIES).map((enemy, enemyId) => {
        if (enemy.getIn([grammar.PROPERTIES, grammar.IS_VISIBLE]) === true) {
            //check collision with main char
            if (areColliding(enemy, state.get(grammar.MAIN_CHARACTER))) {
                //store the collision on the entities
                state = state.set(grammar.MAIN_CHARACTER, addCollisionToEntity(state.getIn([grammar.MAIN_CHARACTER]), enemyId))
                state = state.setIn([grammar.ENEMIES, enemyId], addCollisionToEntity(enemy, state.getIn([grammar.MAIN_CHARACTER, grammar.ID])))
            }
            //check collision with all other enemies
            state.get(grammar.ENEMIES).map((enemy2, enemy2Id) => {
                if (enemy2.getIn([grammar.PROPERTIES, grammar.IS_VISIBLE]) === true) {
                    //ignore myself
                    if (enemyId !== enemy2Id && areColliding(enemy, enemy2)) {
                        //store the collision on the entities
                        state = state.setIn([grammar.ENEMIES, enemyId], addCollisionToEntity(enemy, enemy2Id))
                        state = state.setIn([grammar.ENEMIES, enemy2Id], addCollisionToEntity(enemy2, enemyId))
                    }
                }
            })
        }
    })
    return state
}