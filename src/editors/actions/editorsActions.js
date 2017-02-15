import * as types from '../../const/actionTypes'

export function addNewEntity(entityType) {
    return {
        type: types.ADD_NEW_ENTITY,
        entityType
    }
}

export function saveEntity(entityId, entityCode) {
    return {
        type: types.SAVE_ENTITY,
        entityId,
        entityCode
    }
}

export function addNewMethod(entityId, methodName) {
    return {
        type: types.ADD_NEW_METHOD,
        entityId,
        methodName
    }
}

export function selectMethod(entityId, methodName) {
    return {
        type: types.SELECT_METHOD,
        entityId,
        methodName
    }
}

export function updateMethodBody(entityId, methodName, methodBody) {
    return {
        type: types.UPDATE_METHOD_BODY,
        entityId,
        methodName,
        methodBody
    }
}

export function insertTextToMethod(entityId, methodName, text) {
    return {
        type: types.INSERT_TEXT_TO_METHOD,
        entityId,
        methodName,
        text
    }
}

export function runMethod(entityId, methodName) {
    return {
        type: types.RUN_METHOD,
        entityId,
        methodName
    }
}

export function runNextLine(entityId) {
    return {
        type: types.RUN_NEXT_LINE,
        entityId
    }
}

export function runNextDemoLine(demoId) {
    return {
        type: types.RUN_NEXT_DEMO_LINE,
        demoId
    }
}

export function playDemo(demoId) {
    return {
        type: types.PLAY_DEMO,
        demoId
    }
}

export function resetDemo(demoId) {
    return {
        type: types.RESET_DEMO,
        demoId
    }
}

export function resetEntity(entityId) {
    return {
        type: types.RESET_ENTITY,
        entityId
    }
}

export function pauseDemo(demoId) {
    return {
        type: types.PAUSE_DEMO,
        demoId
    }
}

export function pauseEntity(entityId) {
    return {
        type: types.PAUSE_ENTITY,
        entityId
    }
}

export function enterGameMode() {
    return {
        type: types.ENTER_GAME_MODE
    }
}

export function enterEditingMode() {
    return {
        type: types.ENTER_EDITING_MODE
    }
}