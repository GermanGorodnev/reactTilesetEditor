import React from "react"
import {connect} from "react-redux"
import {
    levelLayerAdd,
    levelLayerSetVisible,
    setCurrentLayer,
    setLayerName,
    shiftLayer,
    deleteLayer,
} from "actions/tilesetAreaActions"

@connect((store) => {
    return {
        level: store.tilesetArea.level,
        currentLayer: store.tilesetArea.currentLayer,
    }
})
export default class LayersList extends React.Component {
    levelLayerAdd() {
        // get current level width
        const lw = this.props.level.width;
        const lh = this.props.level.height;
        this.props.dispatch(levelLayerAdd("Layer " + (this.props.level.layers.length + 1).toString(), lw, lh));
    }

    layerShiftUp() {
        this.props.dispatch(shiftLayer(this.props.currentLayer, -1));
        this.props.dispatch(setCurrentLayer(Math.max(0, this.props.currentLayer - 1)));
    }

    layerShiftDown() {
        this.props.dispatch(shiftLayer(this.props.currentLayer, 1));
        this.props.dispatch(setCurrentLayer(Math.min(this.props.currentLayer + 1, this.props.level.layers.length - 1)));
    }

    layerDelete() {
        this.props.dispatch(deleteLayer(this.props.currentLayer));
    }

    onLayerListItemInputChange(event) {
        const tg = event.target;
        const newval = tg.checked;
        this.props.dispatch(levelLayerSetVisible(Number(tg.parentNode.getAttribute("index")), newval));
        event.stopPropagation();
        //this.props.dispatch(levelRerenderNeed());
    }

    onLayerListItemClick(event) {
        let tg = event.target;
        if (tg.nodeName === "INPUT") {
            return;
        }
        if (!tg.hasAttribute("index"))
            tg = tg.parentNode;
        this.props.dispatch(setCurrentLayer(Number(tg.getAttribute("index"))));
    }

    onLayerListItemNameChange(event) {
        // set the name of current layer
        this.props.dispatch(setLayerName(this.props.currentLayer, event.target.value));
    }

    renderLayersList() {
        // render the top-right representiation with all custom fields
        let layers = [];
        const {level, currentLayer} = this.props;
        if (level.layers.length === 0)
            return;
        // TODO: DIV NOT P!
        level.layers.forEach((layer, index) => {
            const itsUs = (index === currentLayer);
            const classes = "layer-item" +
                (itsUs ? " current-layer" : "") ;      
                 
            layers.push(
                <div 
                    key={index}
                    className={classes}
                    index={index}
                    onClick={(ev) => this.onLayerListItemClick(ev)}
                >
                    <p 
                        className={"name" + (itsUs ? " invis" : "")}
                    >{layer.name}</p>
                    <input 
                        className={"name-input" + (itsUs ? " visible" : "")}
                        type="text" 
                        defaultValue={layer.name}
                        onChange={(ev) => this.onLayerListItemNameChange(ev)}
                    />
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
        const layersList = this.renderLayersList();
        return (
            <div className="layers-list">
                {/* Interface */}
                <div className="layers-controller">
                    <p className="input-name">Layers</p>
                    <p 
                        className="button-add-layer"
                        onClick={() => this.levelLayerAdd()}
                    >+</p>
                </div>

                {layersList}

                <div className="layers-tools">
                    <div className="updown">
                        <p 
                            className="arrow"
                            onClick={(ev) => this.layerShiftUp()}
                        >&uarr;</p>
                        <p 
                            className="arrow"
                            onClick={(ev) => this.layerShiftDown()}
                        >&darr;</p>
                    </div>
                    <p 
                        className="delete"
                        onClick={(ev) => this.layerDelete(ev)}
                    >&#x2717;</p>
                </div>
            </div>
        )
    }
}