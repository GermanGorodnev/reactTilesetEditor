import { TILESET_AREA } from "constants.js"

export function setAreaSize(newWidth, newHeight) {
    return {
        type: TILESET_AREA.SET_SIZE,
        payload: {
            newWidth,
            newHeight
        }
    }
}

export function levelSetSize(newWidth, newHeight) {
    return function(dispatch) {
        dispatch({
            type: TILESET_AREA.LEVEL.SET_SIZE,
            payload: {
                newWidth,
                newHeight
            }
        });
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_AREA.LEVEL.RERENDER_NEED,
                payload: {}
            })
        }, 1)
    }
}

export function levelSetTileSize(newTileW, newTileH) {
    return function(dispatch) {
        dispatch({
            type: TILESET_AREA.LEVEL.SET_TILE_SIZE,
            payload: {
                newTileW,
                newTileH
            }
        });
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_AREA.LEVEL.RERENDER_NEED,
                payload: {}
            })
        }, 1)
    }
}

export function setPenArea(newArea) {
    return {
        type: TILESET_AREA.SET_PEN_AREA,
        payload: {
            newArea
        }
    }
}



export function levelLayerAdd(name, width, height) {
    return function(dispatch) {
        dispatch({
            type: TILESET_AREA.ADD_LAYER,
            payload: {
                name,
                width,
                height
            }
        });
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_AREA.LEVEL.RERENDER_NEED,
                payload: {}
            })
        }, .005)
    } 
}

export function levelLayerLoad(layer) {
    return {
        type: TILESET_AREA.LOAD_LAYER,
        payload: {
            layer
        }
    }
}

export function levelLayerSetVisible(ind, val) {
    return function(dispatch) {
        dispatch({
            type: TILESET_AREA.LAYER_SET_VISIBLE,
            payload: {
                ind,
                val
            }
        })
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_AREA.LEVEL.RERENDER_NEED,
                payload: {}
            })
        }, 1)
    }
}

export function setCurrentLayer(ind) {
    return {
        type: TILESET_AREA.LAYER_SET_CURRENT,
        payload: {
            ind
        }
    }
}

export function shiftLayer(ind, step) {
    return function(dispatch) {
        dispatch({
            type: TILESET_AREA.LAYER_SHIFT,
            payload: {
                ind,
                step
            }
        })
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_AREA.LEVEL.RERENDER_NEED,
                payload: {}
            })
        }, 0.05)
    }
}

export function shiftLayersByTile(ind, xoff, yoff) {
    if (ind === -1) {
        // all
        return function(dispatch) {
            dispatch({
                type: TILESET_AREA.LAYER_SHIFT_BY_TILE_ALL,
                payload: {
                    xoff,
                    yoff
                }
            })
            // TODO: WHAT THE FUCK
            setTimeout(() => {
                dispatch({
                    type: TILESET_AREA.LEVEL.RERENDER_NEED,
                    payload: {}
                })
            }, 0.05)
        }
    } else {
        // just one
        return function(dispatch) {
            dispatch({
                type: TILESET_AREA.LAYER_SHIFT_BY_TILE,
                payload: {
                    ind,
                    xoff,
                    yoff
                }
            })
            // TODO: WHAT THE FUCK
            setTimeout(() => {
                dispatch({
                    type: TILESET_AREA.LEVEL.RERENDER_NEED,
                    payload: {}
                })
            }, 0.05)
        } 
    }
}



export function levelPlaceTile(params) {
    return {
        type: TILESET_AREA.LEVEL.PLACE_TILE,
        payload: {
            params
        }
    }
}

export function levelRerenderNeed() {
    return {
        type: TILESET_AREA.LEVEL.RERENDER_NEED,
        payload: {}
    }
}
export function levelRerenderSuccess() {
    return {
        type: TILESET_AREA.LEVEL.RERENDER_SUCCESS,
        payload: {}
    }
}



export function showLevelParams(toggle) {
    return function(dispatch) {
        dispatch({
            type: TILESET_AREA.TOGGLE_PARAMS_WINDOW,
            payload: {
                toggle
            }
        })
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_AREA.LEVEL.RERENDER_NEED,
                payload: {}
            })
        }, 1)
    }
}

export function setTool(newTool) {
    return {
        type: TILESET_AREA.TOOL.SET_TOOL,
        payload: {
            newTool
        }
    }
}


export function triggerSave(toggle) {
    return {
        type: TILESET_AREA.TRIGGER_SAVE,
        payload: {
            toggle
        }
    }
}

export function triggerLoad(toggle) {
    return {
        type: TILESET_AREA.TRIGGER_LOAD,
        payload: {
            toggle
        }
    }
}


export function loadLevel(level) {
    console.log("start lo load", level);
    return function(dispatch) {
        dispatch(levelSetSize(level.width, level.height));
        dispatch(levelSetTileSize(level.tileW, level.tileH));
        for (let layer of level.layers) {
            console.log("LAYER", layer);
            dispatch(levelLayerLoad(layer));
        }
    }
}