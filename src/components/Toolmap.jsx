import React from "react"
import { connect } from "react-redux"

import TilesetLoader from "./TilesetLoader"
import TilesetSettings from "./TilesetSettings"

import {ResizableBox} from "react-resizable"

@connect((store) => {
    return {
        area: store.tilesetArea
    }
})
export default class Toolmap extends React.Component {
    render() {
        const toolmapStyle = {
            width: window.innerWidth - this.props.area.width
        }
        return (
            <div 
                className="toolmap" 
                style={toolmapStyle}
            >     
                <TilesetLoader />
                <TilesetSettings />
            </div>
        );
    }
}