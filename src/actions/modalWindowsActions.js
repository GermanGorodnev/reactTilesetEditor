import { MODAL_WINDOWS, APP } from "constants.js"
import {setState} from "actions/appActions"


export function addModal(type) {
    return function(dispatch) {
        dispatch({
            type: MODAL_WINDOWS.ADD_MODAL,
            payload: {
                type
            }
        });
        dispatch(setState(APP.STATE.MODAL));
    }
}

export function disableAllModals() {
    return function(dispatch) {
        dispatch({
            type: MODAL_WINDOWS.DISABLE_ALL,
            payload: {}
        });
        setTimeout(() => {
            dispatch(setState(APP.STATE.EDIT));
        }, 1000* 1);
    }
}

export function closeModal(ind) {
    return {
        type: MODAL_WINDOWS.CLOSE,
        payload: {
            ind
        }
    }
}