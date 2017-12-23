import { APP } from "constants.js"


export function setState(newState) {
    return {
        type: APP.SET_STATE,
        payload: {
            newState
        }
    }
}

export function appInit() {
    return function(dispatch) {
        setState(APP.STATE.EDIT);        
    }
}