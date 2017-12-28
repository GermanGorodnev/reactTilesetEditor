import React from "react"
import { connect } from "react-redux"
import FileSaver from "file-saver"

import { setTool } from "actions/tilesetAreaActions"
import { addModal } from "actions/modalWindowsActions"
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

    onMenuButtonClick(event) {
        let t = event.target;
        const action = t.getAttribute("action");
        switch (action) {
            case APP.MENU.FILE.NEW: {
                // clear all
                break;
            }
            case APP.MENU.FILE.SAVE: {
                // save 
                var myjson= JSON.stringify({
                    a: 3,
                    b: 5
                });
                var blob = new Blob([myjson], {type: "application/json"});
                FileSaver.saveAs(blob, "my_outfile.json");
                break;
            }
            
            case APP.MENU.FILE.LOAD: {
                break;
            }

            default: {
                break;
            }
        }
    }

    onToolClick(event) {
        let t = event.target;
        if (t.nodeName === "IMG") {
            t = t.parentNode;
        }
        const toolName = t.getAttribute("toolName");
        this.props.dispatch(setTool(toolName));
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
                                onClick={(ev) => this.onMenuButtonClick(ev)}
                                action={APP.MENU.FILE.NEW}
                            >New</p>
                            <p 
                                className="menu-content-item"
                                onClick={(ev) => this.onMenuButtonClick(ev)}
                                action={APP.MENU.FILE.SAVE}
                            >Save</p>
                            <p
                                className="menu-content-item" 
                                onClick={(ev) => this.onMenuButtonClick(ev)}
                                action={APP.MENU.FILE.LOAD}
                            >Load</p>
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
                            >Shift Layer</p>
                        </div>
                    </div>
                </div>

                
                <div 
                    className="tools"
                >
                    <div 
                        className={"tool" + ((this.props.tool === TILESET_AREA.TOOL.PEN) ? " current" : "")} 
                        toolName={TILESET_AREA.TOOL.PEN}
                        onClick={(ev) => this.onToolClick(ev)}
                    >
                        <img src={require("images/icons/pen.png")} alt="Pen"/>
                    </div>
                    <div 
                        className={"tool" + ((this.props.tool === TILESET_AREA.TOOL.ERASE) ? " current" : "")} 
                        toolName={TILESET_AREA.TOOL.ERASE}
                        onClick={(ev) => this.onToolClick(ev)}
                    >
                        <img src={require("images/icons/erase.png")} alt="Eraser"/>
                    </div>
                </div>
            </div>
        )
    }
}