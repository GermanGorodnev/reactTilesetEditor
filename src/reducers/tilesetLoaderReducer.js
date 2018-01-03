import { TILESET_LOADER } from "constants.js"

const initialState = {
    tilesets: [],
    currentTileset: undefined
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case TILESET_LOADER.LOAD_TILESET: {
            const {params} = action.payload;
            return {
                ...state,
                tilesets: [
                    ...state.tilesets,
                    {
                        name: params.name,
                        imageObject: params.image,
                        image: params.image.src,
                        width: params.width,
                        height: params.height,

                        tileWidth: params.tileWidth,
                        tileHeight: params.tileHeight,

                        tileW: params.tileW,
                        tileH: params.tileH,

                        tileOffsetX: params.tileOffsetX,
                        tileOffsetY: params.tileOffsetY,

                        tileSepX: params.tileSepX,
                        tileSepY: params.tileSepY,

                        firstgridid: params.firstgridid
                    }
                ]
            }
        }

        case TILESET_LOADER.CLEAR_TILESETS: {
            return {
                ...state,
                currentTileset: undefined,
                tilesets: []
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
                    if (ind === action.payload.ind) {
                        return {
                            ...tileset,
                            tileW: action.payload.newWidth,
                            tileWidth: Math.floor(tileset.width / action.payload.newWidth)
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
                    if (ind === action.payload.ind) {
                        return {
                            ...tileset,
                            tileH: action.payload.newHeight,
                            tileHeight: Math.floor(tileset.height / action.payload.newHeight)
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
                    if (ind === action.payload.ind) {
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
                    if (ind === action.payload.ind) {
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
                    if (ind === action.payload.ind) {
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
                    if (ind === action.payload.ind) {
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

        case TILESET_LOADER.TILESETS_RECALCULATE_IDS: {
            let newTilesets = [...state.tilesets];
            newTilesets[0].firstgridid = 1;
            for (let i = 1; i < newTilesets.length; i++) {
                const prev = newTilesets[i - 1];
                newTilesets[i].firstgridid = prev.firstgridid + 
                    (Math.ceil(prev.width / prev.tileW) * 
                    Math.ceil(prev.height / prev.tileH))
            }

            return {
                ...state,
                tilesets: newTilesets
            }
        }

        default:
            break;
    }

    return state;
} 