import { APP } from "constants.js"

const initialState = {
    language: APP.LANG.RUS,
    state: undefined
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case APP.SET_STATE: {
            return {
                ...state,
                state: action.payload.newState
            }
        }

        default:
            break;
    }

    return state;
} 