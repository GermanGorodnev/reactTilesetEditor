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