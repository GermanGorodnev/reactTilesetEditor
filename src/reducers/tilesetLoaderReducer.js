import { TILESET_LOADER } from "constants.js"

const initialState = {
    tilesets: [],
    currentTileset: undefined
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case TILESET_LOADER.LOAD_TILESET: {
            return {
                ...state,
                tilesets: [
                    ...state.tilesets,
                    {
                        name: action.payload.name,
                        imageObject: action.payload.image,
                        image: action.payload.image.src,
                        width: action.payload.width,
                        height: action.payload.height,
                        tileW: 64,
                        tileH: 64,
                        tileOffsetX: 0,
                        tileOffsetY: 0,
                        tileSepX: 0,
                        tileSepY: 0
                    }
                ]
            }
        }
        case TILESET_LOADER.SET_CURRENT: {
            return {
                ...state,
                currentTileset: action.payload.index
            }
        }
        
        case TILESET_LOADER.TILESET_SET_WIDTH: {
            return {
                ...state,
                tilesets: state.tilesets.map((tileset, ind) => {
                    if (ind === state.currentTileset) {
                        return {
                            ...tileset,
                            tileW: action.payload.newWidth
                        }
                    }
                    else {
                        return {
                            ...tileset
                        };
                    }
                })
            }
        }

        case TILESET_LOADER.TILESET_SET_HEIGHT: {
            return {
                ...state,
                tilesets: state.tilesets.map((tileset, ind) => {
                    if (ind === state.currentTileset) {
                        return {
                            ...tileset,
                            tileH: action.payload.newHeight
                        }
                    }
                    else {
                        return {
                            ...tileset
                        };
                    }
                })
            }
        }

        case TILESET_LOADER.TILESET_SET_OFFSET_X: {
            return {
                ...state,
                tilesets: state.tilesets.map((tileset, ind) => {
                    if (ind === state.currentTileset) {
                        return {
                            ...tileset,
                            tileOffsetX: action.payload.newOffsetX
                        }
                    }
                    else {
                        return {
                            ...tileset
                        };
                    }
                })
            }
        }

        case TILESET_LOADER.TILESET_SET_OFFSET_Y: {
            return {
                ...state,
                tilesets: state.tilesets.map((tileset, ind) => {
                    if (ind === state.currentTileset) {
                        return {
                            ...tileset,
                            tileOffsetY: action.payload.newOffsetY
                        }
                    }
                    else {
                        return {
                            ...tileset
                        };
                    }
                })
            }
        }

        case TILESET_LOADER.TILESET_SET_SEP_X: {
            return {
                ...state,
                tilesets: state.tilesets.map((tileset, ind) => {
                    if (ind === state.currentTileset) {
                        return {
                            ...tileset,
                            tileSepX: action.payload.newSepX
                        }
                    }
                    else {
                        return {
                            ...tileset
                        };
                    }
                })
            }
        }

        case TILESET_LOADER.TILESET_SET_SEP_Y: {
            return {
                ...state,
                tilesets: state.tilesets.map((tileset, ind) => {
                    if (ind === state.currentTileset) {
                        return {
                            ...tileset,
                            tileSepY: action.payload.newSepY
                        }
                    }
                    else {
                        return {
                            ...tileset
                        };
                    }
                })
            }
        }

        default:
            break;
    }

    return state;
} 