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

export function tilesetSetWidth(newWidth) {
    return {
        type: TILESET_LOADER.TILESET_SET_WIDTH,
        payload: {
            newWidth
        }
    }
}

export function tilesetSetHeight(newHeight) {
    return {
        type: TILESET_LOADER.TILESET_SET_HEIGHT,
        payload: {
            newHeight
        }
    }
}

export function tilesetSetOffsetX(newOffsetX) {
    return {
        type: TILESET_LOADER.TILESET_SET_OFFSET_X,
        payload: {
            newOffsetX
        }
    }
}

export function tilesetSetOffsetY(newOffsetY) {
    return {
        type: TILESET_LOADER.TILESET_SET_OFFSET_Y,
        payload: {
            newOffsetY
        }
    }
}

export function tilesetSetSepX(newSepX) {
    return {
        type: TILESET_LOADER.TILESET_SET_SEP_X,
        payload: {
            newSepX
        }
    }
}

export function tilesetSetSepY(newSepY) {
    return {
        type: TILESET_LOADER.TILESET_SET_SEP_Y,
        payload: {
            newSepY
        }
    }
}

