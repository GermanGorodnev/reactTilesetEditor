import React from "react"
import { connect } from "react-redux"

import {Stage, Layer, Rect, Image} from "react-konva"
import {renderGrid} from "util.js"
import {TILESET_SETTINGS} from "constants.js"

import {
    tilesetSetWidth, 
    tilesetSetHeight, 
    tilesetSetOffsetX,
    tilesetSetOffsetY,
    tilesetSetSepX,
    tilesetSetSepY,
} from "actions/tilesetLoaderActions"
import {
    setPenArea
} from "actions/tilesetAreaActions"

@connect((store) => {
    return {
        tilesets: store.tilesetLoader.tilesets,
        currentTileset: store.tilesetLoader.currentTileset,
        settings: store.tilesetSettings,
        areaWidth: store.tilesetArea.width
    }
})
export default class TilesetSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: undefined, // just a local ref to image in array, USE ONLY IN M_DOWN, M_MOVE, M_UP
            pickingTile: false,
            tileSelectArea: {
                x: 0,
                y: 0,
                currX: 0,
                currY: 0,
                tileX: 0, // index in tiles
                tileY: 0,
                currTileX: 0,
                currTileY: 0,
                w: 0,
                h: 0
            },
        }
    }

    

    onCanvasMouseDown(event) {
        // image won't change during the move, write it in state
        const {tilesets, currentTileset} = this.props;
        const tileset = tilesets[currentTileset] ? tilesets[currentTileset] : undefined;
        if (tileset === undefined)
            return;
        // resets

        const stage = this.stageNode.getStage();
        const mousePos = stage.getPointerPosition();

        const xs = tileset.tileOffsetX + mousePos.x;
        const ys = tileset.tileOffsetY + mousePos.y;

        const tilex = Math.floor(xs / tileset.tileW);
        const tiley = Math.floor(ys / tileset.tileH);
        this.setState({
            image: tileset,
            pickingTile: true,
            tileSelectArea: {
                ...this.state.tileSelectArea,
                x: xs,
                y: ys,
                tileX: tilex,
                tileY: tiley,
                currX: xs,
                currY: ys,
                currTileX: tilex,
                currTileY: tiley,
                w: 0,
                h: 0
            }
        });
    }

    onCanvasMouseMove(event) {
        if (!this.state.pickingTile || !this.state.image)
            return;
        const stage = this.stageNode.getStage();
        const mousePos = stage.getPointerPosition();
        const {tileSelectArea} = this.state;
        let neww; //= Math.abs(this.state.tileSelectArea.x - mousePos.x);
        let newh; //= Math.abs(this.state.tileSelectArea.y - mousePos.y);
        const {image} = this.state;
        const currx = image.tileOffsetX + mousePos.x;
        const curry = image.tileOffsetY + mousePos.y;
        let currtilex;
        let currtiley;
        if (currx >= tileSelectArea.x) {
            currtilex = Math.floor(currx / image.tileW) + 1;
            neww = Math.abs(currtilex - tileSelectArea.tileX) //Math.floor(Ma / image.tileW) + 1; 
        } else {
            currtilex = Math.ceil(currx / image.tileW) - 1;
            neww = Math.abs(currtilex - tileSelectArea.tileX) + 1;
            //Math.ceil(neww / image.tileW) + 1; 
        }
        if (curry >= tileSelectArea.y) {
            currtiley = Math.floor(curry / image.tileH) + 1;
            newh = Math.abs(currtiley - tileSelectArea.tileY);
            //Math.floor(newh / image.tileH) + 1; 
        } else {
            currtiley = Math.ceil(curry / image.tileH) - 1;
            newh = Math.abs(currtiley - tileSelectArea.tileY) + 1;
            //Math.ceil(newh / image.tileH) + 1; 
        }
        this.setState({
            tileSelectArea: {
                ...this.state.tileSelectArea,
                currX: currx,
                currY: curry,
                currTileX: currtilex,
                currTileY: currtiley,
                w: neww,
                h: newh
            }
        });

    }

    onCanvasMouseUp(event) {
        if (!this.state.pickingTile) {
            // just the dropdown on canvas, don't give a fuck
            return;
        }
        const {tileSelectArea} = this.state;
        let newPenArea = {
            tileX: Math.min(tileSelectArea.tileX, tileSelectArea.currTileX),
            tileY: Math.min(tileSelectArea.tileY, tileSelectArea.currTileY),
            tileWidth: tileSelectArea.w,
            tileHeight: tileSelectArea.h
        }
        if (tileSelectArea.x === tileSelectArea.currX 
            && tileSelectArea.y === tileSelectArea.currY) {
            this.setState({
                pickingTile: false,
                tileSelectArea: {
                    ...this.state.tileSelectArea,
                    currTileX: tileSelectArea.tileX,
                    currTileY: tileSelectArea.tileY,
                    w: 1,
                    h: 1
                }
            });   

            newPenArea = {
                tileX: tileSelectArea.tileX,
                tileY: tileSelectArea.tileY,
                tileWidth: 1,
                tileHeight: 1
            }         
        }
        else {
            this.setState({
                pickingTile: false,
            });   
        }
        // update global selected part
        this.props.dispatch(setPenArea(newPenArea));
    }

    renderArea() {
        const {image} = this.state;        
        if (image === undefined)
            return;        
        const strokeW = 2;
        const {tileSelectArea} = this.state;
        let x1 = tileSelectArea.tileX;
        let y1 = tileSelectArea.tileY;
        let ww = tileSelectArea.w;
        let hh = tileSelectArea.h;
        if (tileSelectArea.currX < tileSelectArea.x) {
            // current on the left -> beginX swap
            x1 = Math.floor(tileSelectArea.currX / image.tileW);
            ww = Math.abs(x1 - Math.ceil(tileSelectArea.x / image.tileW));
        }
        if (tileSelectArea.currY < tileSelectArea.y) {
            // current on the left -> beginX swap
            y1 = Math.floor(tileSelectArea.currY / image.tileH);
            hh = Math.abs(y1 - Math.ceil(tileSelectArea.y / image.tileH));
        }
        if (ww === 0 || hh === 0)
            return;
        const multWithSepW = image.tileW + image.tileSepX;
        const multWithSepH = image.tileH + image.tileSepY;
        const halfStroke = strokeW / 2;
        return (
            <Rect
                x={halfStroke + image.tileOffsetX + x1 * multWithSepW}
                y={halfStroke + image.tileOffsetY + y1 * multWithSepH}
                width={ww * multWithSepW - image.tileSepX - strokeW}
                height={hh * multWithSepH - image.tileSepY - strokeW}
                stroke={"#eee"}
                strokeWidth={strokeW}
            />
        )
    }

    renderCanvas() {
        const {tilesets, currentTileset} = this.props;
        const image = tilesets[currentTileset] ? tilesets[currentTileset] : undefined;
        let tilesetWrapperStyle = {
            justifyContent: "center",
            alignItems: "center"
        } 
        if (image === undefined) {
            return (
                <div 
                    className="tileset-wrapper"
                    style={tilesetWrapperStyle}
                >
                    <div>LUL</div>
                </div>
            )
        }
        const grid = renderGrid(
            image.width, image.height, 
            image.tileW, image.tileH, 
            image.tileOffsetX, image.tileOffsetY,
            image.tileSepX, image.tileSepY
        );
        const currentArea = this.renderArea();
        const wless = ((window.innerWidth - this.props.areaWidth) * TILESET_SETTINGS.LEFT_PERC  < image.width);
        const hless = (window.innerHeight / 2) < image.height;

        const canvasWrapperStyle = {
            display: "flex",
            flexDirection: "column",
            justifyContent: (hless) ? "flex-start" : "center",
            alignItems: (wless) ? "flex-start" : "center",
        }
        tilesetWrapperStyle = {
            ...tilesetWrapperStyle,
            justifyContent: (hless) ? "flex-start" : "center",
            alignItems: (wless) ? "flex-start" : "center",
        }
        return (
            <div 
                className="tileset-wrapper"
                style={tilesetWrapperStyle}
            >
                <Stage
                    width={image.width}
                    height={image.height}
                    className="canvas-wrapper"
                    ref={stage => this.stageNode = stage}
                    onMouseDown={(ev) => this.onCanvasMouseDown(ev)}
                    onMouseMove={(ev) => this.onCanvasMouseMove(ev)}
                    onMouseUp={(ev) => this.onCanvasMouseUp(ev)}   
                    style={canvasWrapperStyle}        
                >
                    <Layer
                    >
                        {grid}
                        <Image
                            image={image.imageObject}
                            y={0}
                            x={0}
                            width={image.width}
                            height={image.height}
                            ref={
                                node => this.imageNode = node
                            }
                        />
                        {currentArea}
                    </Layer>
                </Stage>
            </div>
        )
    }

    tileWidthChange(event) {
        if (this.props.currentTileset === undefined)
            return;
        this.props.dispatch(tilesetSetWidth(Number(event.target.value)));
    }

    tileHeightChange(event) {
        if (this.props.currentTileset === undefined)
            return;
        this.props.dispatch(tilesetSetHeight(Number(event.target.value)));
    }
    
    offsetXchange(event) {
        if (this.props.currentTileset === undefined)
            return;
        this.props.dispatch(tilesetSetOffsetX(Number(event.target.value)));
    }

    offsetYchange(event) {
        if (this.props.currentTileset === undefined)
            return;
        this.props.dispatch(tilesetSetOffsetY(Number(event.target.value)));
    }

    sepXchange(event) {
        if (this.props.currentTileset === undefined)
            return;
        this.props.dispatch(tilesetSetSepX(Number(event.target.value)));
    }

    sepYchange(event) {
        if (this.props.currentTileset === undefined)
            return;
        this.props.dispatch(tilesetSetSepY(Number(event.target.value)));
    }




    componentWillReceiveProps(next) {
        if (next.currentTileset === this.props.currentTileset)   
            return;
        const {tilesets, currentTileset} = next;
        const image = tilesets[currentTileset] ? tilesets[currentTileset] : undefined;
        if (!image)
            return;

        // assign
        this.iTileW.value = image.tileW;
        this.iTileH.value = image.tileH;
        this.iOffsetX.value = image.tileOffsetX;
        this.iOffsetY.value = image.tileOffsetY;
        this.iSepX.value = image.tileSepX;
        this.iSepY.value = image.tileSepY;
        // RESET CURRENT AREA
        this.setState({
            tileSelectArea: {
                ...this.state.tileSelectArea,
                currX: 0,
                currY: 0,
                currTileX: 0,
                currTileY: 0,
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }
        })
    }


    render() {
        const tilesetCanvas = this.renderCanvas();
        return (
            <div className="tileset-settings">
                    {tilesetCanvas}
                <div className="tileset-config">
                    <div className="zone-wrap">
                        <div className="zone">
                            <p className="input-name">Tile W</p>
                            <input 
                                type="number" 
                                name="tileW"
                                onChange={(ev) => this.tileWidthChange(ev)}
                                ref={(me) => this.iTileW = me}
                            />
                        </div>
                        <div className="zone">
                            <p className="input-name">Tile H</p>
                            <input 
                                type="number" 
                                name="tileH"
                                onChange={(ev) => this.tileHeightChange(ev)}
                                ref={(me) => this.iTileH = me}
                            />
                        </div>
                    </div>

                    <div className="zone-wrap">
                        <div className="zone">
                            <p className="input-name">Offset X</p>
                            <input 
                                type="number" 
                                name="offsetX"
                                defaultValue={0}
                                onChange={(ev) => this.offsetXchange(ev)}
                                ref={(me) => this.iOffsetX = me}
                            />
                        </div>
                        <div className="zone">
                            <p className="input-name">Offset Y</p>
                            <input 
                                type="number" 
                                name="offsetY"
                                defaultValue={0}
                                onChange={(ev) => this.offsetYchange(ev)}
                                ref={(me) => this.iOffsetY = me}
                            />
                        </div>
                    </div>

                    <div className="zone-wrap">
                        <div className="zone">
                            <p className="input-name">Sep X</p>
                            <input 
                                type="number" 
                                name="sepX"
                                defaultValue={0}
                                onChange={(ev) => this.sepXchange(ev)}
                                ref={(me) => this.iSepX = me}
                            />
                        </div>
                        <div className="zone">
                            <p className="input-name">Sep Y</p>
                            <input 
                                type="number" 
                                name="sepY"
                                defaultValue={0}
                                onChange={(ev) => this.sepYchange(ev)}
                                ref={(me) => this.iSepY = me}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}