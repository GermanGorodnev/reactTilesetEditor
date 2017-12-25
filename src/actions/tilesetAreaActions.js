import { TILESET_AREA } from "constants.js"
import thunk from "redux-thunk"
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
    return {
        type: TILESET_AREA.LEVEL.SET_SIZE,
        payload: {
            newWidth,
            newHeight
        }
    }
}

export function levelSetTileSize(newTileW, newTileH) {
    return {
        type: TILESET_AREA.LEVEL.SET_TILE_SIZE,
        payload: {
            newTileW,
            newTileH
        }
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



export function levelLayerAdd(width, height) {
    return {
        type: TILESET_AREA.ADD_LAYER,
        payload: {
            width,
            height
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