import React from "react"
import { connect } from "react-redux"
import {APP} from "constants.js"

import ModalShiftLayer from "./ModalShiftLayer"
import {setState} from "actions/appActions"

@connect((store) => {
    return {
        appState: store.app.appState,
        modals: store.modalWindows.modals,
        closing: store.modalWindows.closing
    }
})
export default class ModalWindows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closingTimer: undefined
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.closing && !this.props.closing) {
            this.setState({
                closingTimer: setTimeout(() => {
                    this.props.dispatch(setState(APP.STATE.EDIT));
                }, 1000 * 0)
            })
        }
    }
    renderModals() {
        let rm = [];
        const {modals} = this.props;
        for (let i = modals.length - 1; i >= 0; i--) {
            const modal = modals[i];
            const renderedModal = this.renderModal(modal, i);
            rm.push(
                renderedModal
            )   
        }
        
        return rm;
    }

    renderModal(modal, ind) {
        let r;
        switch (modal.type) {
            case APP.MENU.TOOLS.SHIFT_LAYER: {
                r = (
                    <ModalShiftLayer
                        index={ind}
                        key={ind}
                    />
                )
                break;
            }
            default:
                break;
         }
        return r;
    }

    render() {
        const CLASS_NAME = "modals-controller" +
            ((this.props.appState === APP.STATE.MODAL) ? " active" : " inactive") +
            ((this.props.closing) ? " closing" : "")
        const renderedModals = this.renderModals();
        return (
            <div
                className={CLASS_NAME}
            >
                {renderedModals}
            </div>
        )
    }
}