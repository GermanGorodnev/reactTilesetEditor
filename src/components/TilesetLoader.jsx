import React from "react"
import { connect } from "react-redux"
import {ResizableBox} from "react-resizable"
import {TRANSLATE} from "translate.js"
import { loadTileset } from "../actions/tilesetLoaderActions";

import TilesetItem from "components/TilesetItem"

@connect((store) => {
    return {
        tilesets: store.tilesetLoader.tilesets,
        currentTileset: store.tilesetLoader.currentTileset,
        language: store.app.language,
    }
})
export default class TilesetLoader extends React.Component {
    renderLoadedTilesets() {
        const {tilesets, currentTileset} = this.props; 

        let rendered = [];
        tilesets.forEach((tileset, i) => {
            rendered.push(
                <TilesetItem index={i} key={i} />
            );
        });
        return rendered;
    }

    loadTileset() {
        const files = this.fileInput.files;
        for (let f of files) {
            if (!f.type.match("image.*")) {
                // TODO: disptach type error
                console.log("wrong extension");
            }

            var reader = new FileReader();

            reader.onload = (event) => {
                let image = new Image();
                var w; 
                var h;
                image.src = event.target.result;  
                const that = this;              
                image.onload = function() {
                    w = this.naturalWidth;
                    h = this.naturalHeight;
                    that.props.dispatch(loadTileset(f.name, this, w, h));                
                }

            }

            reader.readAsDataURL(f);
        }
        this.fileInput.value = "";
    }

    render() {
        const loadedTilesets = this.renderLoadedTilesets();
        const Translate = TRANSLATE[this.props.language];
        return (
            <div 
                className="tileset-loader" 
            >
                <div className="loaded-tilesets">
                    <div className="tbl">
                        {loadedTilesets}
                    </div>
                </div>
                <div className="load-inteface">
                    <input 
                        className="file-input" 
                        type="file" 
                        name="files[]"
                        ref={(input) => {this.fileInput = input;}}
                        multiple
                    />
                    <div onClick={() => this.loadTileset()} className="button button-load-tileset">{Translate.LOAD_TILESET}</div>
                </div>
            </div>

        )
    }
}