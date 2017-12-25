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
        const {files} = this.fileInput;
        const {tilesets} = this.props; 
        let LASTGID = 1;
        for (let f of files) {
            if (!f.type.match("image.*")) {
                // TODO: disptach type error
                console.log("wrong extension");
            }
            let firstGridId = 0;
            if (tilesets.length === 0) {
                // 1st one
                firstGridId = LASTGID;
            } else {
                const lasttileset = tilesets[tilesets.length - 1];
                firstGridId = lasttileset.firstgridid +
                    (Math.floor(lasttileset.width / lasttileset.tileW) * 
                    Math.floor(lasttileset.height / lasttileset.tileH));
            }

            var reader = new FileReader();

            reader.onload = (event) => {
                console.log(firstGridId);
                let image = new Image();
                image.src = event.target.result;  
                const that = this;              
                image.onload = function() {
                    that.props.dispatch(loadTileset(
                        {
                            name: f.name, 
                            image: this, 
                            width: this.naturalWidth, 
                            height: this.naturalHeight,

                            tileWidth: Math.floor(this.naturalWidth / 64),
                            tileHeight: Math.floor(this.naturalHeight / 64),

                            tileW: 64,
                            tileH: 64,

                            tileOffsetX: 0,
                            tileOffsetY: 0,

                            tileSepX: 0,
                            tileSepY: 0,

                            firstgridid: LASTGID
                        }
                    ));
                    LASTGID += (Math.floor(this.naturalWidth / 64) * 
                        Math.floor(this.naturalHeight / 64));   
                        console.log("NEW ", LASTGID)             
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