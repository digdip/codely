import * as types from '../../const/actionTypes'

export function addNewEntity(entityType) {
    return {
        type: types.ADD_NEW_ENTITY,
        entityType
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