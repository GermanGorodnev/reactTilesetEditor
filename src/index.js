import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"

import { Provider } from "react-redux"
import store from "store"

require("./less/style.less");

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,

    document.getElementById('react-root')
)