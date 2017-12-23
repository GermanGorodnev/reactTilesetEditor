import { TILESET_AREA } from "constants.js"

const initialState = {
    width: window.innerWidth / 2,
    maxWidth: window.innerWidth / 1.5,
    height: window.innerHeight,
    level: {
        width: 3, // in tiles
        height: 3, // in tiles
        tileW: 64, 
        tileH: 64,
        layers: [], // array of objects
        textures: {},
    },
    instrument: TILESET_AREA.INSTR.PEN,
    penArea: {
        // left top edge in tiles
        tileX: 0,
        tileY: 0,
        tileWidth: 0,
        tileHeight: 0
    }
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case TILESET_AREA.SET_SIZE: {
            return {
                ...state,
                width: action.payload.newWidth,
                height: action.payload.newHeight,
            }
        }


        case TILESET_AREA.LEVEL.SET_SIZE: {
            return {
                ...state,
                level: {
                    ...state.level,
                    width: action.payload.newWidth,
                    height: action.payload.newHeight
                }
            }
        }

        case TILESET_AREA.LEVEL.SET_TILE_SIZE: {
            return {
                ...state,
                level: {
                    ...state.level,
                    tileW: action.payload.newTileW,
                    tileH: action.payload.newTileH
                }
            }
        }


        case TILESET_AREA.SET_PEN_AREA: {
            const {newArea} = action.payload;
            return {
                ...state,
                penArea: {
                    ...state.penArea,
                    tileX: newArea.tileX,
                    tileY: newArea.tileY,
                    tileWidth: newArea.w,
                    tileHeight: newArea.h
                }
            }
        }

        default:
            break;
    }

    return state;
} 