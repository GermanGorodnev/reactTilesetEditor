import { TILESET_AREA } from "constants.js"
import {make2DArray} from "util.js"

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
        currentLayer: 0
    },
    needToRerender: false,

    instrument: TILESET_AREA.INSTR.PEN,
    penArea: {
        // left top edge in tiles
        tileX: 0,
        tileY: 0,
        tileWidth: 0,
        tileHeight: 0
    },
    
    currentLayer: undefined

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
                    ...newArea
                }
            }
        }




        case TILESET_AREA.ADD_LAYER: {
            const levelW = action.payload.width,
                levelH = action.payload.height;
            return {
                ...state,
                level: {
                    ...state.level,
                    layers: [
                        ...state.level.layers,
                        {
                            content: make2DArray(levelH, levelW, 0),
                            visible: true, 
                        }
                    ]
                }
            }
        }

        case TILESET_AREA.LAYER_SET_VISIBLE: {
            const {val, ind} = action.payload;
            const newLayers = state.level.layers.map((layer, i) => {
                if (i === ind) {
                    return {
                        ...layer,
                        visible: val
                    }
                } else {
                    return {
                        ...layer
                    }
                }
            });

            return {
                ...state,
                level: {
                    ...state.level,
                    layers: newLayers
                }
            }
        }

        case TILESET_AREA.LAYER_SET_CURRENT: {
            return {
                ...state,
                currentLayer: action.payload.ind
            }
        }




        case TILESET_AREA.LEVEL.RERENDER_NEED: {
            return {
                ...state,
                needToRerender: true
            }
        }
                
        case TILESET_AREA.LEVEL.RERENDER_SUCCESS: {
            return {
                ...state,
                needToRerender: false,
            }
        }

        case TILESET_AREA.LEVEL.PLACE_TILE: {
            const {params} = action.payload;
            const lh = state.level.height,  
                lw = state.level.width;
            const newLayers = state.level.layers.map((val, i) => {
                let layer = {...val};
                if (i === params.layerInd) {
                    // clamp
                    const y = Math.min(lh, params.ty);
                    const x = Math.min(lw, params.tx);
                    layer.content[y][x] = params.number;
                }
                return layer;
            });
            return {
                ...state,
                level: {
                    ...state.level,
                    layers: newLayers,
                }
            }
        }

        default:
            break;
    }

    return state;
} 