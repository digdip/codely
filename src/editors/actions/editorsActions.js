import * as types from '../../const/actionTypes'
import * as entityTypes from '../../const/entityTypes'

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