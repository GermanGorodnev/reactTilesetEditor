import {Rect} from "react-konva"
import React from "react"

export function renderGrid(canvasW, canvasH, tileW, tileH, offsetX = 0, offsetY = 0, sepX = 0, sepY = 0) {
    let grid = [];
    let uid = 0;
    for (let i = 0, ci = Math.ceil(canvasW / tileW); i < ci; ++i) {
        for (let j = 0, cj = Math.ceil(canvasH / tileH); j < cj; ++j) {
            const x1 = offsetX + i * (tileW + sepX);
            const y1 = offsetY + j * (tileH + sepY);
            grid.push(
                <Rect
                    key={uid} 
                    x={x1}
                    y={y1}
                    width={tileW}
                    height={tileH}
                    fill={ ((i + j) % 2 === 0) ? "#555" : "#666"}
                />
            )
            uid++;
        }
    }
    return grid;
}

export function make2DArray(rows, cols, defaultValue = 0) {
    var arr = new Array(rows);
    for (let i = 0; i < arr.length; ++i) {
        arr[i] = new Array(cols);
        for (let j = 0; j < arr[i].length; ++j) {
            arr[i][j] = defaultValue;
        }
    }
    return arr;
}