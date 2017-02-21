import * as grammar from './grammar'

export const GRID_SIZE_PIXELS = 10

//entity types
export const EntityType = {
    SQUARE: 'SQUARE'
}

// Application modes
export const AppMode = {
    EDITING: 'EDITING',
    GAME: 'GAME'
}

// entity's properties default values
export const DEFAULT_X_POSITION = 4
export const DEFAULT_Y_POSITION = 5
export const DEFAULT_WIDTH = 2
export const DEFAULT_HEIGHT = 2
export const DEFAULT_COLOR = 'red'


export const EntityRole = {
    MAIN_CHARACTER: grammar.MAIN_CHARACTER_PROTOTYPE,
    ENEMY: grammar.ENEMY_PROTOTYPE
}

export const GAME_PARAM_MAIN_CHAR_X_POS = 'playerLeft'
export const GAME_PARAM_MAIN_CHAR_Y_POS = 'playerTop'
