import React from "react"
import { connect } from "react-redux"

import { setTool, triggerSave, triggerLoad, loadLevel } from "actions/tilesetAreaActions"
import { addModal } from "actions/modalWindowsActions"
import { appNew } from "actions/appActions"
import { loadTileset } from "actions/tilesetLoaderActions"

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
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", (ev) => this.onMouseClick(ev));
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

    }

    onButtonSaveClick(event) {
        this.props.dispatch(triggerSave(true));
    }

    onButtonLoadClick(event) {
        if (this.loadInput) {
            this.loadInput.click();
        }
        event.preventDefault();
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
                this.props.dispatch(appNew);
                console.log(obj);
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
                this.props.dispatch(loadLevel(
                    obj.level
                ));
            }
            
            reader.readAsText(file);
        }
    }


    onToolClick(event) {
        let t = event.target;
        if (t.nodeName === "IMG") {
            t = t.parentNode;
        }
        const toolname = t.getAttribute("toolname");
        this.props.dispatch(setTool(toolname));
    }

    onShiftLayerClick(event) {
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
                            >New</p>
                            <p 
                                className="menu-content-item"
                                onClick={(ev) => this.onButtonSaveClick(ev)}
                                action={APP.MENU.FILE.SAVE}
                            >Save</p>
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
                                >Load</p>
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
                            >Shift Layer(s)</p>
                        </div>
                    </div>
                </div>

                
                <div 
                    className="tools"
                >
                    <div 
                        className={"tool" + ((this.props.tool === TILESET_AREA.TOOL.PEN) ? " current" : "")} 
                        toolname={TILESET_AREA.TOOL.PEN}
                        onClick={(ev) => this.onToolClick(ev)}
                    >
                        <img src={require("images/icons/pen.png")} alt="Pen"/>
                    </div>
                    <div 
                        className={"tool" + ((this.props.tool === TILESET_AREA.TOOL.ERASE) ? " current" : "")} 
                        toolname={TILESET_AREA.TOOL.ERASE}
                        onClick={(ev) => this.onToolClick(ev)}
                    >
                        <img src={require("images/icons/erase.png")} alt="Eraser"/>
                    </div>
                </div>
            </div>
        )
    }
}