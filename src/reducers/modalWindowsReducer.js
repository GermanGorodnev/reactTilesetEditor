import { MODAL_WINDOWS } from "constants.js"

const initialState = {
    modals: [],
    closing: false
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case MODAL_WINDOWS.ADD_MODAL: {
            return {
                ...state,
                closing: false,
                modals: [
                    ...state.modals,
                    {
                        type: action.payload.type
                    }
                ]
            }
        }

        case MODAL_WINDOWS.DISABLE_ALL: {
            return {
                ...state,
                modals: []
            }
        }

        case MODAL_WINDOWS.CLOSE: {
            const {ind} = action.payload
            return {
                ...state,
                modals: state.modals.filter((mod, i) => {
                    return i !== ind;
                }),
                closing: (state.modals.length === 1) ? true : false
            }
        }
        default:
            break;
    }

    return state;
} 