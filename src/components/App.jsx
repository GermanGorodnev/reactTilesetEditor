import React from "react"
import { connect } from "react-redux"

import { appInit } from "../actions/appActions"

import TilesetArea from "./TilesetArea"
import Toolmap from "./Toolmap"


@connect((store) => {
    return {
        language: store.app.language,
        state: store.app.state
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
            </div>
        );
    }
}