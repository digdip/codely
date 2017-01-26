import * as types from '../../const/actionTypes'
import * as entityTypes from '../../const/entityTypes'

export function addNewEntity() {
    return {
        type: types.ADD_NEW_ENTITY,
        entityType: entityTypes.SQUARE
    }
}

export function saveEntity(entityId, entityCode) {
    return {
        type: types.SAVE_ENTITY,
        entityId,
        entityCode
    }
}