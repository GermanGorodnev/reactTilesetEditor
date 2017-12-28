import React from "react"
import {connect} from "react-redux"
import { appInit } from "../actions/appActions"

import TilesetArea from "./TilesetArea"
import Toolmap from "./Toolmap"
import ModalWindows from "./ModalWindows"


@connect((store) => {
    return {
        language: store.app.language,
        appState: store.app.appState,
        modalWindowActive: store.app.modalWindowActive
    }
})
export default class App extends React.Component {
    componentWillMount() {
        this.props.dispatch(appInit());
    }

    render() {
        return (
            <div className="app">
                <TilesetArea />
                <Toolmap />
                <ModalWindows 
                    
                />
            </div>
        );
    }
}