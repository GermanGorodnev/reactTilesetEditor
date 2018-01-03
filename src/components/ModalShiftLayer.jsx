import React from "react"
import { connect } from "react-redux"
import {APP} from "constants.js"
import { shiftLayersByTile } from "actions/tilesetAreaActions"
import {closeModal} from "actions/modalWindowsActions"

@connect((store) => {
    return {
        currentLayer: store.tilesetArea.currentLayer
    }   
})
export default class ModalShiftLayer extends React.Component {
    onApply(event) {
        const {currentLayer} = this.props;
        // gather params
        const xoff = Number(this.tsx.value);
        const yoff = Number(this.tsy.value);
        const toAll = this.toAllLayers.checked;
        if (!toAll && currentLayer === undefined) {
            this.close();
            return;
        }
        this.props.dispatch(shiftLayersByTile((toAll) ? -1 : this.props.currentLayer, xoff, yoff));
        event.stopPropagation();
        this.close();
    }

    close() {
        this.props.dispatch(closeModal(this.props.index));
    }

    onModalAreaClick(event) {
        const tg = event.target;
        if (tg.classList.contains("modal-window")) {
            // close w/o action
            console.log("close w/o action");
            this.close();
        }
    }

    render() {
        return (
            <div
                className="modal-window shift-layer"
                onClick={(ev) => this.onModalAreaClick(ev)}
            >
                <div
                    className="modal-content"
                >
                    <div className="zone-wrap">
                        <div className="zone">
                            <p className="name">Tile Shift X</p>
                            <input
                                type="number" 
                                defaultValue={0}
                                ref={(me) => this.tsx = me}
                            />
                        </div>
                        <div className="zone">
                            <p className="name">Tile Shift Y</p>
                            <input
                                type="number" 
                                defaultValue={0}
                                ref={(me) => this.tsy = me}
                            />
                        </div>
                    </div>
                    <label>
                        <input 
                            type="checkbox"
                            ref={(me) => this.toAllLayers = me}
                            defaultChecked={true}
                        />
                        Apply to all layers
                    </label>
                    <p 
                        className="button-apply"
                        onClick={(ev) => this.onApply(ev)}
                    >Apply</p>
                </div>
            </div>
        )
    }
}