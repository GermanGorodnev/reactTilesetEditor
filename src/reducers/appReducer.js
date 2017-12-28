import { APP } from "constants.js"

const initialState = {
    language: APP.LANG.RUS,
    appState: undefined,
    modalWindowActive: false
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case APP.SET_STATE: {
            return {
                ...state,
                appState: action.payload.newState
            }
        }

        default:
            break;
    }

    return state;
} 