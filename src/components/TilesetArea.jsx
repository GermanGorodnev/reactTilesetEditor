import React from "react"
import { connect } from "react-redux"
import { ResizableBox } from "react-resizable"
import {Stage, Layer, Rect, Group, Image, Text} from "react-konva"
import FileSaver from "file-saver"

import { 
    setAreaSize, 

    levelSetSize, 
    levelSetTileSize,
    levelPlaceTile, 

    levelRerenderNeed,
    levelRerenderSuccess,

    showLevelParams,
    updateLevelInputs,

    triggerSave,
    triggerLoad

} from "\actions/tilesetAreaActions"
import {renderGrid} from "util.js"
import { TILESET_AREA } from "constants.js";
import Menu from "components/Menu"
import LayersList from "components/LayersList"

@connect((store) => {
    return {
        width: store.tilesetArea.width,
        height: store.tilesetArea.height,
        level: store.tilesetArea.level,
        currentLayer: store.tilesetArea.currentLayer,

        tool: store.tilesetArea.tool,
        penArea: store.tilesetArea.penArea,

        needToRerender: store.tilesetArea.needToRerender,
        renderedLevel: store.tilesetArea.renderedLevel,

        showLevelParams: store.tilesetArea.showLevelParams,
        updateLevelParams: store.tilesetArea.updateLevelParams,

        saveTrigger: store.tilesetArea.saveTrigger,
        loadTrigger: store.tilesetArea.loadTrigger,

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
            renderedLevel: undefined,
            renderedLayersList: undefined
        }
    }
    componentDidMount() {
        window.addEventListener("resize", () => this.onWindowResize());
        this.props.dispatch(levelRerenderNeed());
    }
    componentWillUnmount() {
        window.removeEventListener("resize", () => this.onWindowResize())
    }
    componentWillReceiveProps(newProps) {
        if (newProps.needToRerender) {
            this.setState({
                ...this.state,
                renderedLevel: this.renderLevel(),
            });           
            this.props.dispatch(levelRerenderSuccess());
        }
        if (newProps.saveTrigger) {
            const save = this.saveToFile();
            const json = JSON.stringify(save);
            var blob = new Blob([json], {type: "application/json"});
            FileSaver.saveAs(blob, "rteSave.json");
            setTimeout(() => {
                this.props.dispatch(triggerSave(false));
            }, 5);
        }
        if (newProps.updateLevelParams) {
            this.iLevelW.value = newProps.level.width;
            this.iLevelH.value = newProps.level.height;
            this.iTileW.value = newProps.level.tileW;
            this.iTileH.value = newProps.level.tileH;
            setTimeout(() => {
                this.props.dispatch(updateLevelInputs(false));
            }, 5);
        }
    }


    saveToFile() {
        let save = {
            tilesets: [],
            level: undefined
        };
        // save images
        for (let tileset of this.props.tilesets) {
            save.tilesets.push(tileset);
        }
        save.level = this.props.level;
        return save;
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
        if (this.props.level.layers.length === 0
             || this.props.currentLayer === undefined) {
            return;
        }
        switch (this.props.tool) {
            case TILESET_AREA.TOOL.PEN: {
                // place the tile
                const {tilesets, currentTileset, level, penArea, currentLayer} = this.props;

                const tileset = tilesets[currentTileset] ? tilesets[currentTileset] : undefined;
                if (tileset === undefined)
                    return;
                const imagetilew = Math.ceil(tileset.width / tileset.tileW);
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

    toggleParams() {
        this.props.dispatch(showLevelParams(!this.props.showLevelParams));
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
            console.log("fail to render!")
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
                            x: tileset.tileOffsetX + (tileset.tileW + tileset.tileSepX) * (xoff ),
                            y: tileset.tileOffsetY + (tileset.tileH + tileset.tileSepY) * (yoff ),
                            width: tileset.tileW,
                            height: tileset.tileH
                        }
                        tiles.push(
                            <Group
                                clip={clipArea}
                                x={ti * level.tileW - clipArea.x}
                                y={rowi * level.tileH - clipArea.y}
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
        const {penArea, level, tilesets, currentTileset} = this.props; 
        const image = tilesets[currentTileset] ? tilesets[currentTileset] : undefined;

        if ((penArea.tileWidth === 0) && (penArea.tileHeight === 0)) {
            return;
        }
        if (image === undefined) {
            return;
        }

        if (this.stageNode === undefined) {
            return;
        }
        if (level.layers.length === 0) {
            return;
        }
        const mouse = this.stageNode.getStage().getPointerPosition();

        let penTiles = [];
        let GROUP_INDEX = 0;
        const xstart = Math.floor(mouse.x / level.tileW); //* level.tileW - clipArea.x
        const ystart = Math.floor(mouse.y / level.tileH); //* level.tileH - clipArea.y
        // iterate over TILES in PEN
        for (let i = 0; i < penArea.tileWidth; i++) {
            for (let j = 0; j < penArea.tileHeight; j++) {
                // now render each tile on place
                /* 
                const clipArea = {
                            x: tileset.tileOffsetX + (tileset.tileW + tileset.tileSepX) * (xoff ),
                            y: tileset.tileOffsetY + (tileset.tileH + tileset.tileSepY) * (yoff ),
                            width: tileset.tileW,
                            height: tileset.tileH
                        }
                */
                let clipArea = {
                    x: image.tileOffsetX + (penArea.tileX + i) * (image.tileW + image.tileSepX),
                    y: image.tileOffsetY + (penArea.tileY + j) * (image.tileH + image.tileSepY),
                    width: image.tileW,
                    height: image.tileH
                }
                penTiles.push(
                    <Group
                        clip={clipArea}
                        x={(xstart + i) * level.tileW - clipArea.x}
                        y={(ystart + j) * level.tileH - clipArea.y}
                        key={GROUP_INDEX}
                    >
                        <Image
                            image={image.imageObject}
                            width={image.width}
                            height={image.height}
                        />
                    </Group>
                )
                GROUP_INDEX++;
            }
        }

        return (
            penTiles
        )
    }

    render() {
        const {height} = this.props;
        const {level, tool} = this.props;
        const levelRW = level.width * level.tileW;
        const levelRH = level.height * level.tileH;

        // BACK GRID
        const grid = renderGrid(
            levelRW, levelRH,
            level.tileW, level.tileH,
            0, 0, 0, 0
        );
        // CURRENT LEVEL AS-IS
        const levelRepresentation = this.state.renderedLevel;
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

        let toolRender = undefined;
        if (tool === TILESET_AREA.TOOL.PEN) {
            toolRender = (this.state.pen);
        }

        const HIDE = ((!this.props.showLevelParams) ? " hide" : "");
        return (
            <ResizableBox 
                className="tileset-area" 
                width={this.props.width}
                height={height}
                minConstraints={[window.innerWidth / 3, height]}
                maxConstraints={[window.innerWidth / 1.5, height]}
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
                        {toolRender}
                    </Layer>
                </Stage>


                <p 
                    className="collapse"
                    onClick={(ev) => this.toggleParams(ev)}
                >—
                </p>
                <div className={"level-params" + HIDE}>

                    <div className="zone-wrap">
                        <div className="zone">
                            <p className="input-name">Lvl W</p>
                            <input 
                                type="number" 
                                name="levelW"
                                onChange={(ev) => this.levelWidthChange(ev)}
                                ref={(me) => this.iLevelW = me}
                                defaultValue={3}
                            />
                        </div>
                        <div className="zone">
                            <p className="input-name">Lvl H</p>
                            <input 
                                type="number" 
                                name="levelH"
                                onChange={(ev) => this.levelHeightChange(ev)}
                                ref={(me) => this.iLevelH = me}
                                defaultValue={3}
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
                                defaultValue={64}
                            />
                        </div>
                        <div className="zone">
                            <p className="input-name">Tile H</p>
                            <input 
                                type="number" 
                                name="tileH"
                                onChange={(ev) => this.levelTileHeightChange(ev)}
                                ref={(me) => this.iTileH = me}
                                defaultValue={64}
                            />
                        </div>
                    </div>

                    <LayersList />

                </div>

                <Menu />
            </ResizableBox>
        );
    }
}