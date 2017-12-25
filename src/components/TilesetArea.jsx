import React from "react"
import { connect } from "react-redux"
import { ResizableBox } from "react-resizable"
import {Stage, Layer, Rect, Group, Image, Text} from "react-konva"

import { 
    setAreaSize, 

    levelSetSize, 
    levelSetTileSize,
    levelPlaceTile, 

    levelLayerAdd,
    levelLayerSetVisible,

    levelRerenderNeed,
    levelRerenderSuccess,

    setCurrentLayer

} from "../actions/tilesetAreaActions"
import {renderGrid} from "util.js"
import { TILESET_AREA } from "../constants";

@connect((store) => {
    return {
        width: store.tilesetArea.width,
        maxWidth: store.tilesetArea.maxWidth,
        height: store.tilesetArea.height,
        level: store.tilesetArea.level,
        currentLayer: store.tilesetArea.currentLayer,

        instrument: store.tilesetArea.instrument,
        penArea: store.tilesetArea.penArea,

        needToRerender: store.tilesetArea.needToRerender,
        renderedLevel: store.tilesetArea.renderedLevel,

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
            pen: undefined,
            renderedLevel: undefined
        }
    }
    componentDidMount() {
        window.addEventListener("resize", () => this.onWindowResize());
    }
    componentWillReceiveProps(newProps) {
        if (newProps.needToRerender) {
            this.setState({
                ...this.state,
                renderedLevel: this.renderLevel()
            });           
            this.props.dispatch(levelRerenderSuccess());
        }
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
        });
    }
    onCanvasMouseLeave(event) {
        this.setState((prev) => {
            return {
                ...prev,
                pen: undefined
            }
        })
    }
    onCanvasMouseUp(event) {

    }

    onCanvasClick(event) {
        if (this.props.level.layers.length === 0) {
            // || this.props.currentLayer === undefined) {
            return;
        }
        switch (this.props.instrument) {
            case TILESET_AREA.INSTR.PEN: {
                // place the tile
                const {tilesets, currentTileset, level, penArea, currentLayer} = this.props;

                const tileset = tilesets[currentTileset] ? tilesets[currentTileset] : undefined;
                if (tileset === undefined)
                    return;
                const imagetilew = Math.floor(tileset.width / tileset.tileW);
                const pentilex = penArea.tileX;
                const pentiley = penArea.tileY;
                const mouse = this.stageNode.getStage().getPointerPosition();
                let xtile = Math.floor(mouse.x / level.tileW);
                let ytile = Math.floor(mouse.y / level.tileH);
                
                for (let j = 0; j < penArea.tileHeight; j++) {
                    for (let i = 0; i < penArea.tileWidth; i++) {
                        this.props.dispatch(levelPlaceTile(
                            {
                                tx: xtile + i,
                                ty: ytile + j,
                                number: (tileset.firstgridid - 1) + imagetilew * (pentiley + j) + pentilex + i + 1,
                                layerInd: currentLayer
                            }
                        ));
                    }
                }

                this.props.dispatch(levelRerenderNeed());
            }
        }
    }

    onLayerListItemInputChange(event) {
        const tg = event.target;
        const newval = tg.checked;
        this.props.dispatch(levelLayerSetVisible(Number(tg.parentNode.getAttribute("index")), newval));
        event.stopPropagation();
        //this.props.dispatch(levelRerenderNeed());
    }

    onLayerListItemClick(event) {
        const tg = event.target;
        console.log(tg);
        console.log(Number(tg.getAttribute("index")))
        this.props.dispatch(setCurrentLayer(Number(tg.getAttribute("index"))));
    }








    levelLayerAdd() {
        // get current level width
        const lw = this.props.level.width;
        const lh = this.props.level.height;
        this.props.dispatch(levelLayerAdd(lw, lh));
    }





    someBadInput(event) {
        return (
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






    findImageByNumber(number) {
        const {tilesets} = this.props;
        // iterate over images and find good range
        for (let i = 0; i < tilesets.length; i++) {
            const tileset = tilesets[i];
            const tilesCount = tileset.tileWidth * tileset.tileHeight;
            if ((number >= tileset.firstgridid) 
                && (number < tileset.firstgridid + tilesCount)) {
                return i;
            }
        }
        return undefined;
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
        const {level, tilesets} = this.props;
        const that = this;
        if (this.stageNode === undefined)
            return undefined;

        const stage = this.stageNode.getStage();
        if (level.layers.length === 0)
        {
            console.log("fail to render!", 'background: #222; color: #bada55')
            return (
                <Layer>
                    <Text 
                        className="nolayers"
                        x={stage.getWidth() / 2}
                        y={stage.getHeight() / 2}
                        align="center"
                        width={stage.getWidth()}
                        fontFamily="Arial"
                        fontSize="16"
                        text="Please add at least one layer"
                    />
                </Layer>
            )
        }

        let LEVEL = [];
        let GROUP = 0;
        for (var index = 0; index < level.layers.length; index++) {
            const layer = level.layers[index];
            if (!layer.visible)
                continue;
            let tiles = [];
            layer.content.forEach((row, rowi) => {
                row.forEach((tile, ti) => {
                    if (tile === 0) {
                        // LUL
                        return;
                    }
                    const imagePos = that.findImageByNumber(tile);
                    if (imagePos !== undefined) {
                        const tileset = tilesets[imagePos];
                        // w-5 h-4
                        // 13 x-2, y-3
                        // 18 x-2 y-4

                        // 6 x 4
                        // 22 x-3 y-
                        const xoff = (tile - tileset.firstgridid -0) % tileset.tileWidth;
                        const yoff = ~~((tile - tileset.firstgridid -0) / tileset.tileWidth);
                        const clipArea = {
                            x: (tileset.tileW + tileset.tileOffsetX) * (xoff ),
                            y: (tileset.tileH + tileset.tileOffsetY) * (yoff ),
                            width: tileset.tileW,
                            height: tileset.tileH
                        }
                        tiles.push(
                            <Group
                                clip={clipArea}
                                x={ti * tileset.tileW - clipArea.x}
                                y={rowi * tileset.tileH - clipArea.y}
                                key={GROUP}
                            >
                                <Image
                                    image={tileset.imageObject}
                                    width={tileset.width}
                                    height={tileset.height}
                                />
                            </Group>
                        )
                        GROUP++;
                    }
                })
            })
            LEVEL.push(
                <Layer
                    key={index}
                >
                    {tiles}
                </Layer>
            )
        }
        return LEVEL;
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
        if (penArea.tileWidth === 0
            && penArea.tileHeight === 0)
            return;
        console.log("PEN AREA", penArea);
        const clipArea = {
            x: penArea.tileX * image.tileW,
            y: penArea.tileY * image.tileH,
            width: penArea.tileWidth * image.tileW,
            height: penArea.tileHeight * image.tileH
        }
        console.log("CLIP AREA", clipArea);
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

    renderLayersList() {
        // render the top-right representiation with all custom fields
        let layers = [];
        const {level, currentLayer} = this.props;
        if (level.layers.length === 0)
            return;
        // TODO: DIV NOT P!
        level.layers.forEach((layer, index) => {
            const classes = "layer-item" +
                ((index === currentLayer) ? " current-layer" : "") ;           
            layers.push(
                <div 
                    key={index}
                    className={classes}
                    index={index}
                    onClickCapture={(ev) => this.onLayerListItemClick(ev)}
                >
                    <p 
                        className="name"
                    >{"Layer " + (index + 1).toString()}</p>
                    <input 
                        type="checkbox" 
                        defaultChecked={layer.visible}
                        onChange={(ev) => this.onLayerListItemInputChange(ev)}
                    />
                </div>
            );
        });

        return layers;
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
        const levelRepresentation = this.state.renderedLevel || undefined;
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
            justifyContent: tilesetAreaStyle.justifyContent,
            alignItems: tilesetAreaStyle.alignItems,
        }

        let instrumentRender = undefined;
        if (instrument === TILESET_AREA.INSTR.PEN) {
            instrumentRender = (this.state.pen) || (undefined);
        }

        let layersList = this.renderLayersList();
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
                    onMouseDown={(ev) => this.onCanvasClick(ev)}
                    onMouseMove={(ev) => this.onCanvasMouseMove(ev)}
                    onMouseLeave={(ev => this.onCanvasMouseLeave(ev))}
                    onMouseUp={(ev) => this.onCanvasMouseUp(ev)}   
                    style={canvasWrapperStyle}         
                >
                    <Layer>
                        {grid}
                    </Layer>
                        {levelRepresentation}
                    <Layer>
                        {instrumentRender}
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

                    <div className="layers-list">
                        <div className="layers-controller">
                            <p className="input-name">Layers</p>
                            <p 
                                className="button-add-layer"
                                onClick={() => this.levelLayerAdd()}
                            >+</p>
                        </div>
                        {layersList}
                    </div>
                </div>
            </ResizableBox>
        );
    }
}