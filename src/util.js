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

export function make1DArray(size, defaultValue = 0) {
    let arr = new Array(size);
    arr.fill(defaultValue);
    return arr;
}

export function make2DArray(rows, cols, defaultValue = 0) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; ++i) {
        arr[i] = new Array(cols);
        for (let j = 0; j < arr[i].length; ++j) {
            arr[i][j] = defaultValue;
        }
    }
    return arr;
}

export function shift2DArray(a, xoff, yoff, defaultValue = 0) {
    let arr = [...a];
    console.log(arr);
    const rows = arr.length;
    const cols = arr[0].length;
    const emptyRow = make1DArray(cols, defaultValue);
    let xa = Math.abs(xoff);
    let ya = Math.abs(yoff);
    const funcX = (xoff > 0) ? shiftRight : shiftLeft;
    const funcY = (yoff > 0) ? shiftDown : shiftUp;

    function shiftDown(na) {
        na.pop();
        na.unshift([...emptyRow]);
        return na;
    }
    function shiftUp(na) {
        na.shift();
        na.push([...emptyRow])
        return na;
    }

    function shiftRight(na) {
        na.forEach((row) => {
            row.pop();
            row.unshift(defaultValue);
        })
        return na;
    }
    function shiftLeft(na) {
        na.forEach((row) => {
            row.shift();
            row.push(defaultValue);
        })
        return na;
    }

    while (xa > 0) {
        arr = funcX(arr);
        --xa;
    }
    while (ya > 0) {
        arr = funcY(arr);
        --ya;
    }
    console.log(arr);
    return arr;
}

export function resize2DArray(_arr, nrows, ncols, defaultValue = 0) {
    let arr = [..._arr];
    while(nrows > arr.length) {
        let newrow = new Array(ncols);
        newrow.fill(defaultValue);
        arr.push(newrow);
    }
    arr.length = nrows;
    // now fill the cols
    arr.forEach((row) => {
        while(ncols > row.length) {
            row.push(defaultValue);
        }
        row.length = ncols;
    });
    return arr;
}

export function median(a, b, c) {
    return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}

export function sign(x) {
    return (x < 0) ? -1 : ((x > 0) ? 1 : 0);
}



export function getChar(event) {
    if (event.which === null) { 
        if (event.keyCode < 32) return null; 
        return String.fromCharCode(event.keyCode)
    }

    if (event.which !== 0 && event.charCode !== 0) { 
        if (event.which < 32) return null; 
        return String.fromCharCode(event.which); 
    }

    return null; // спец. символ
}