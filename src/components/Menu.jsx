import React from "react"
import { connect } from "react-redux"

import {
    setTool,
    triggerSave, 
    triggerLoad, 
    loadLevel,
    updateLevelInputs,
    clearLevel
} from "actions/tilesetAreaActions"
import { addModal } from "actions/modalWindowsActions"
import { appNew } from "actions/appActions"
import { loadTileset, clearTilesetsList } from "actions/tilesetLoaderActions"
import { getChar } from "util.js"
import { APP, TILESET_AREA } from "constants.js"


@connect((store) => {
    return {
        tool: store.tilesetArea.tool
    }
})
export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            currentMenu: "none"
        }
    }

    componentDidMount() {
        const li = this.loadInput;
        this.loadInput.addEventListener("change", (ev) => this.onFileChoose.call(this, ev, li));
    }   

    componentWillMount() {
        document.addEventListener("mousedown", (ev) => this.onMouseClick(ev));
        document.addEventListener("keydown", (ev) => this.onKeyboardUp(ev));
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", (ev) => this.onMouseClick(ev));
        document.removeEventListener("keydown", (ev) => this.onKeyboardUp(ev));
    }

    onKeyboardUp(event) {
        const w = event.which;
        if (event.ctrlKey || event.metaKey) {
            if (w === 66) {
                this.onButtonNewClick(undefined);
                event.preventDefault();
                return false;
            }
            if (w === 83) {
                // save
                this.onButtonSaveClick(undefined);
                event.preventDefault();
                return false;
            } else if (w === 79) {
                // load
                this.onButtonLoadClick(undefined);
                event.preventDefault();
                return false;
            }
            //////// tools /////////
            else if (w === 49) {
                // pen
                this.onPenClick();
                event.preventDefault();
                return false;
            } else if (w === 50) {
                this.onEraseClick();
                event.preventDefault();
                return false;
            }
            //////// TOOLS ////////
            else if (w === 81) {
                this.onShiftLayerClick();
                event.preventDefault();
                return false;
            }
        }
    }

    onMouseClick(event) {
        if (this.state.currentMenu !== "none") {
            if (!this.menu.contains(event.target)) {
                // clicked outside, disable current menu
                this.setState({
                    ...this.state,
                    currentMenu: "none"
                })
            } else {
                
            }
        }
    }

    onItemClick(event) {
        let t = event.target;
        if (t.nodeName === "P") {
            t = t.parentNode;
        } 
        let newMenu = t.getAttribute("menu");
        if (this.state.currentMenu === newMenu) {
            newMenu = "none";
        }
        this.setState({
            ...this.state,
            currentMenu: newMenu
        });
    }

    onButtonNewClick(event) {
        window.location.reload();
    }

    onButtonSaveClick(event) {
        this.props.dispatch(triggerSave(true));
    }

    onButtonLoadClick(event) {
        if (this.loadInput) {
            this.loadInput.click();
        }
    }

    onFileChoose(event, inputLoad) {
        const files = inputLoad.files;
        for (let file of files) {
            if (!file.name.match(".json")) {
                // TODO: Pretty error
                console.log("wrong format:", file);
                continue;
            }
            var reader = new FileReader();

            reader.onload = (event) => {
                const res = event.target.result;    
                // now get the js object
                const obj = JSON.parse(res); 
                inputLoad.value = "";
                // clear the app
                // clear tilesets
                this.props.dispatch(clearTilesetsList());
                // clear level
                this.props.dispatch(clearLevel());

                // load tilesets
                for (let tileset of obj.tilesets) {
                    tileset.image = tileset.image.replace(/(\r\n|\n|\r)/gm,"");
                    let IMG = new Image();
                    IMG.src = tileset.image;                      
                    IMG.onload = () => {
                        this.props.dispatch(loadTileset(
                            {
                                ...tileset,
                                image: IMG
                            }
                        ));
                    }
                }
                // load level
                setTimeout(() => {
                    this.props.dispatch(loadLevel(obj.level));
                }, 1);
            }
            
            reader.readAsText(file);
        }
    }

    onPenClick() {
        this.props.dispatch(setTool(TILESET_AREA.TOOL.PEN));
    }
    onEraseClick() {
        this.props.dispatch(setTool(TILESET_AREA.TOOL.ERASE));
    }

    onShiftLayerClick() {
        this.setState({
            ...this.state,
            currentMenu: "none"
        });
        this.props.dispatch(addModal(APP.MENU.TOOLS.SHIFT_LAYER));
    }



    render() {
        const HIDE = (!this.state.visible) ? " hide" : "";
        return (
            <div 
                className={"menu" + HIDE}
            >
                <div className="menu-wrap" ref={(me) => this.menu = me}>
                    <div 
                        className={"menu-item file" + ((this.state.currentMenu === "file") ? " curr" : "")}
                        onClick={(ev) => this.onItemClick(ev)}
                        menu="file"
                    >
                        <p className="name">File</p>
                        <div 
                            className={"content" + ((this.state.currentMenu !== "file") ? " hide" : "")}
                        >
                            <p 
                                className="menu-content-item"
                                onClick={(ev) => this.onButtonNewClick(ev)}
                                action={APP.MENU.FILE.NEW}
                            >{"New (" + APP.SHORTCUTS.NEW + ")"}</p>
                            <p 
                                className="menu-content-item"
                                onClick={(ev) => this.onButtonSaveClick(ev)}
                                action={APP.MENU.FILE.SAVE}
                            >{"Save (" + APP.SHORTCUTS.SAVE + ")"}</p>
                            <div>
                                <input 
                                    type="file" 
                                    className="input-file-invis" 
                                    accept=".json" 
                                    ref={(me) => this.loadInput = me}
                                />
                                <p
                                    className="menu-content-item" 
                                    onClick={(ev) => this.onButtonLoadClick(ev)}
                                    action={APP.MENU.FILE.LOAD}
                                >{"Load (" + APP.SHORTCUTS.LOAD + ")"}</p>
                            </div>
                        </div>
                    </div>

                    <div 
                        className={"menu-item tools" + ((this.state.currentMenu === "tools") ? " curr" : "")}
                        onClick={(ev) => this.onItemClick(ev)}
                        menu="tools"
                    >
                        <p className="name">Tools</p>
                        <div 
                            className={"content" + ((this.state.currentMenu !== "tools") ? " hide" : "")}
                        >
                            <p 
                                className="menu-content-item"
                                onClick={(ev) => this.onShiftLayerClick(ev)}
                                action={APP.MENU.TOOLS.SHIFT_LAYER}
                            >{"Shift layer(s) (" + APP.SHORTCUTS.SHIFT_LAYER + ")"}</p>
                        </div>
                    </div>
                </div>

                
                <div 
                    className="tools"
                >
                    <div 
                        className={"tool" + ((this.props.tool === TILESET_AREA.TOOL.PEN) ? " current" : "")} 
                        onClick={(ev) => this.onPenClick(ev)}
                    >
                        <img src={require("images/icons/pen.png")} alt="Pen" title={"Pen (" + APP.SHORTCUTS.PEN + ")"}/>
                    </div>
                    <div 
                        className={"tool" + ((this.props.tool === TILESET_AREA.TOOL.ERASE) ? " current" : "")} 
                        onClick={(ev) => this.onEraseClick(ev)}
                    >
                        <img src={require("images/icons/erase.png")} alt="Eraser" title={"Eraser (" + APP.SHORTCUTS.ERASE + ")"}/>
                    </div>
                </div>
            </div>
        )
    }
}