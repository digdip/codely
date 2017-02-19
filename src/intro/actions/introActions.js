import * as types from '../../const/actionTypes'

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

export function pauseDemo(demoId) {
    return {
        type: types.PAUSE_DEMO,
        demoId
    }
}
