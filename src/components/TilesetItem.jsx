import React from "react"
import { connect } from "react-redux"

import {setCurrent} from "actions/tilesetLoaderActions"

@connect((store) => {
    return {
        tilesets: store.tilesetLoader.tilesets,
        currentTileset: store.tilesetLoader.currentTileset,
        language: store.app.language,
    }
})
export default class TilesetItem extends React.Component {
    select() {
        this.props.dispatch(setCurrent(this.props.index));
    }

    render() {
        const {tilesets} = this.props;
        const ind = this.props.index;
        const me = tilesets[ind];
        let cname = "loaded-tileset" + ((ind === this.props.currentTileset) ? " loaded-tileset-curr" : "");
        return (
            <div onClick={() => this.select()} className={cname} >
                <img src={me.image} alt={me.name}/>
                <p className="tileset-name">{me.name}</p>
            </div>
        )
    }
}