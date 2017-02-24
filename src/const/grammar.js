// entity's properties

export const X = 'Left'
export const Y = 'Top'
export const WIDTH = 'Width'
export const HEIGHT = 'Height'
export const COLOR = 'Color'
export const IS_VISIBLE = 'isVisible'

// pre-defined names
export const MAIN_METHOD = 'main'
export const ON_KEY_LEFT = 'onLeftArrow'
export const ON_KEY_RIGHT = 'onRightArrow'
export const ON_KEY_UP = 'onUpArrow'
export const ON_KEY_DOWN = 'onDownArrow'
export const ON_KEY_UP_RIGHT = 'onUpRightArrow'
export const ON_KEY_DOWN_RIGHT = 'onDownRightArrow'
export const ON_KEY_DOWN_LEFT = 'onDownLeftArrow'
export const ON_KEY_UP_LEFT = 'onUpLeftArrow'
export const ON_MAIN_CHARACTER_MOVE = 'onMainCharacterMove'
export const ON_COLLISION = 'onCollision'

// keywords
export const ID = 'id'
export const RUN_DATA = 'runData'
export const ENTITIES = 'entities'
export const MAIN_CHARACTER_PROTOTYPE = 'mainCharacterPrototype'
export const GAME_BOARD = 'gameBoard'
export const ENEMY_PROTOTYPE = 'enemyPrototype'
export const MAIN_CHARACTER = 'mainCharacter'
export const ENEMIES = 'enemies'
export const DEMOS = 'demos'
export const APP_MODE = 'appMode'
export const SELECTED_ENTITY_ID = 'selectedEntityId'
export const SELECTED_ENTITY_ROLE = 'selectedEntityRole'
export const METHODS = 'methods'
export const PROPERTIES = 'properties'
export const LINE_NUMBER = 'lineNumber'
export const METHOD_NAME = 'methodName'
export const ENV_VARS = 'envVars'
export const SELECTED_METHOD = 'selectedMethod'
export const RUN_STATUS = 'runStatus'
export const COLLISIONS = 'collisions'
export const METHOD_SCRIPT = 'methodScript'
export const IS_METHOD_PRE_DEFINED = 'isMethodPreDefined'
export const METHOD_PARAMS = 'methodsParams'
export const TURN_STATUS = 'turnStatus'
export const MAIN_CHAR_DEMO_PROTOTYPE = 'mainCharacterDemoPrototype'
export const ENEMY_DEMO_PROTOTYPE = 'enemyDemoPrototype'

//run statuses
export const RunStatuses = {
    CANCELED: 'CANCELED',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    IDLE: 'IDLE'
}

//turn statuses
export const TurnStatuses = {
    IDLE: 'IDLE',
    MAIN_CHAR_RUNNING: 'MAIN_CHAR_RUNNING',
    MAIN_CHAR_DONE: 'MAIN_CHAR_DONE',
    ENEMIES_RUNNING: 'ENEMIES_RUNNING'
}
