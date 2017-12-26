import { TILESET_LOADER } from "constants.js"
import { TILESET_AREA } from "../constants";

export function loadTileset(params) {
    return {
        type: TILESET_LOADER.LOAD_TILESET,
        payload: {
            params
        }
    }
}

export function setCurrent(index) {
    return {
        type: TILESET_LOADER.SET_CURRENT,
        payload: {
            index
        }
    }
}

export function tilesetSetWidth(ind, newWidth) {
    return function(dispatch) {
        dispatch({
            type: TILESET_LOADER.TILESET_SET_WIDTH,
            payload: {
                ind,
                newWidth
            }
        })
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_LOADER.TILESETS_RECALCULATE_IDS,
                payload: {}
            })
        }, 1);
    }
}

export function tilesetSetHeight(ind, newHeight) {
    return function(dispatch) {
        dispatch({
            type: TILESET_LOADER.TILESET_SET_HEIGHT,
            payload: {
                ind,
                newHeight
            }
        });
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_LOADER.TILESETS_RECALCULATE_IDS,
                payload: {}
            })
        }, 1);
    }
}

export function tilesetSetOffsetX(ind, newOffsetX) {
    return function(dispatch) {
        dispatch({
            type: TILESET_LOADER.TILESET_SET_OFFSET_X,
            payload: {
                ind,
                newOffsetX
            }
        });
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_LOADER.TILESETS_RECALCULATE_IDS,
                payload: {}
            })
        }, 1);
    }
}

export function tilesetSetOffsetY(ind, newOffsetY) {
    return function(dispatch) {
        dispatch({
            type: TILESET_LOADER.TILESET_SET_OFFSET_Y,
            payload: {
                ind,
                newOffsetY
            }
        });
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_LOADER.TILESETS_RECALCULATE_IDS,
                payload: {}
            })
        }, 1)
    }
}

export function tilesetSetSepX(ind, newSepX) {
    return function(dispatch) {
        dispatch({
            type: TILESET_LOADER.TILESET_SET_SEP_X,
            payload: {
                ind,
                newSepX
            }
        });
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_LOADER.TILESETS_RECALCULATE_IDS,
                payload: {}
            })
        }, 1)
    }
}

export function tilesetSetSepY(ind, newSepY) {
    return function(dispatch) {
        dispatch({
            type: TILESET_LOADER.TILESET_SET_SEP_Y,
            payload: {
                ind,
                newSepY
            }
        });
        // TODO: WHAT THE FUCK
        setTimeout(() => {
            dispatch({
                type: TILESET_LOADER.TILESETS_RECALCULATE_IDS,
                payload: {}
            })
        }, 1)
    }
}

