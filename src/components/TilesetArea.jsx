import React from "react"
import { connect } from "react-redux"
import { ResizableBox } from "react-resizable"
import {Stage, Layer, Rect, Group, Image} from "react-konva"

import { setAreaSize, levelSetSize, levelSetTileSize } from "../actions/tilesetAreaActions"
import {renderGrid} from "util.js"
import { TILESET_AREA } from "../constants";

@connect((store) => {
    return {
        width: store.tilesetArea.width,
        maxWidth: store.tilesetArea.maxWidth,
        height: store.tilesetArea.height,
        level: store.tilesetArea.level,
        instrument: store.tilesetArea.instrument,
        penArea: store.tilesetArea.penArea,

        tilesets: store.tilesetLoader.tilesets,
        currentTileset: store.tilesetLoader.currentTileset,
    }
})
export default class TilesetArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            pen: undefined
        }
    }
    componentDidMount() {
        window.addEventListener("resize", () => this.onWindowResize());
    }

    onResize = (event, {element, size}) => {
        this.props.dispatch(setAreaSize(size.width, window.innerHeight));
    }

    onWindowResize() {
        this.props.dispatch(setAreaSize(this.props.width, window.innerHeight));
    }

    onCanvasMouseDown(event) {
    }
    onCanvasMouseMove(event) {
        // redraw pen if necessary
        this.setState((prev) => {
            return {
                ...prev,
                pen: this.renderPen()
            }
        })
    }
    onCanvasMouseUp(event) {
    }

    someBadInput(event) {
        return (
            //(event.key !== "Enter") ||
            (Number(event.target.value) <= 0)
        );
    }


    levelWidthChange(event) {
        if (this.someBadInput(event)) 
            return;
        const val = Number(event.target.value);
        const {level} = this.props; 
        this.props.dispatch(levelSetSize(val, level.height));
    }
    levelHeightChange(event) {
        if (this.someBadInput(event)) 
            return;
        const val = Number(event.target.value);
        const {level} = this.props; 
        this.props.dispatch(levelSetSize(level.width, val));
    }

    levelTileWidthChange(event) {
        if (this.someBadInput(event)) 
            return;
        const val = Number(event.target.value);
        const {level} = this.props; 
        this.props.dispatch(levelSetTileSize(val, level.tileH));
    }

    levelTileHeightChange(event) {
        if (this.someBadInput(event)) 
            return;
        const val = Number(event.target.value);
        const {level} = this.props; 
        this.props.dispatch(levelSetTileSize(level.tileW, val));
    }

    renderArea() {
        const strokeW = 2;
        const {tileSelectArea} = this.state;
        const {level} = this.props;
        let x1 = tileSelectArea.tileX;
        let y1 = tileSelectArea.tileY;
        let ww = tileSelectArea.w;
        let hh = tileSelectArea.h;
        if (tileSelectArea.currX < tileSelectArea.x) {
            // current on the left -> beginX swap
            x1 = Math.floor(tileSelectArea.currX / level.tileW);
            ww = Math.abs(x1 - Math.ceil(tileSelectArea.x / level.tileW));
        }
        if (tileSelectArea.currY < tileSelectArea.y) {
            // current on the left -> beginX swap
            y1 = Math.floor(tileSelectArea.currY / level.tileH);
            hh = Math.abs(y1 - Math.ceil(tileSelectArea.y / level.tileH));
        }
        if (ww === 0 || hh === 0)
            return;
        const halfStroke = strokeW / 2;
        return (
            <Rect
                x={halfStroke + x1 * level.tileW}
                y={halfStroke + y1 * level.tileH}
                width={ww * level.tileW - strokeW}
                height={hh * level.tileH - strokeW}
                stroke={"#eee"}
                strokeWidth={strokeW}
            />
        )
    }

    renderLevel() {
        const {level} = this.props;
        if (level.layers.length === 0)
            return;
        level.layers.forEach((layer, index) => {

        })
    }

    renderPen() {
        const {penArea, level} = this.props; 
        const {tilesets, currentTileset} = this.props;
        const image = tilesets[currentTileset] ? tilesets[currentTileset] : undefined;
        if (image === undefined) {
            return;
        }
        const mouse = this.stageNode.getStage().getPointerPosition();
        if (mouse === undefined) 
            return;
        console.log("MOUSE POS:", mouse.x, mouse.y);
        console.log("PEN AREA W/H", penArea.tileWidth, penArea.tileHeight)
        const clipArea = {
            x: penArea.tileX * level.tileW,
            y: penArea.tileY * level.tileH,
            width: penArea.tileWidth * level.tileW,
            height: penArea.tileHeight * level.tileH
        }
        return (
            <Group
                clip={
                    clipArea
                }
                x={Math.floor(mouse.x / level.tileW) * level.tileW - clipArea.x}
                y={Math.floor(mouse.y / level.tileH) * level.tileH - clipArea.y}
            >
                <Image
                    image={image.imageObject}
                    width={image.width}
                    height={image.height}
                />
            </Group>
        )
    }

    render() {
        const {height} = this.props;
        const {level, instrument} = this.props;
        const levelRW = level.width * level.tileW;
        const levelRH = level.height * level.tileH;

        // BACK GRID
        const grid = renderGrid(
            levelRW, levelRH,
            level.tileW, level.tileH,
            0, 0, 0, 0
        );
        // CURRENT LEVEL AS-IS
        const levelRepresentation = this.renderLevel();
        // CURRENT CHOOSEN AREA IF NEEDED
        const currentArea = this.renderArea();

        const wless = this.props.width < levelRW;
        const hless = this.props.height < levelRH;
        const tilesetAreaStyle = {
            justifyContent: (hless) ? "flex-start" : "center",
            alignItems: (wless) ? "flex-start" : "center",
            width: this.props.width,
            height: height
        }
        const canvasWrapperStyle = {
            display: "flex",
            flexDirection: "column",
            justifyContent: tilesetAreaStyle.justifyContent,
            alignItems: tilesetAreaStyle.alignItems,
        }

        let instrumentRender = undefined;
        if (instrument === TILESET_AREA.INSTR.PEN) {
            instrumentRender = (this.state.pen) || (undefined);
        }
        return (
            <ResizableBox 
                className="tileset-area" 
                width={this.props.width}
                height={height}
                minConstraints={[300, height]}
                maxConstraints={[this.props.maxWidth, height]}
                onResize={this.onResize}
                style={tilesetAreaStyle}
            >    
                 <Stage
                    width={levelRW}
                    height={levelRH}
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
                        {levelRepresentation}
                        {
                            instrumentRender
                        }
                    </Layer>
                </Stage>
                <div className="level-params">
                    <div className="zone-wrap">
                        <div className="zone">
                            <p className="input-name">Level W</p>
                            <input 
                                type="number" 
                                name="levelW"
                                onChange={(ev) => this.levelWidthChange(ev)}
                                ref={(me) => this.iLevelW = me}
                            />
                        </div>
                        <div className="zone">
                            <p className="input-name">Level H</p>
                            <input 
                                type="number" 
                                name="levelH"
                                onChange={(ev) => this.levelHeightChange(ev)}
                                ref={(me) => this.iLevelH = me}
                            />
                        </div>
                    </div>

                    <div className="zone-wrap">
                        <div className="zone">
                            <p className="input-name">Tile W</p>
                            <input 
                                type="number" 
                                name="tileW"
                                onChange={(ev) => this.levelTileWidthChange(ev)}
                                ref={(me) => this.iTileW = me}
                            />
                        </div>
                        <div className="zone">
                            <p className="input-name">Tile H</p>
                            <input 
                                type="number" 
                                name="tileH"
                                onChange={(ev) => this.levelTileHeightChange(ev)}
                                ref={(me) => this.iTileH = me}
                            />
                        </div>
                    </div>
                </div>
            </ResizableBox>
        );
    }
}