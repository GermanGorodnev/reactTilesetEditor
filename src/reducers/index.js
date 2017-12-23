import { combineReducers } from "redux"

// import all reducers
import app from "./appReducer"
import tilesetArea from "./tilesetAreaReducer"
import tilesetLoader from "./tilesetLoaderReducer"
import tilesetSettings from "./tilesetSettingsReducer"

export default combineReducers({
    app,
    tilesetArea,
    tilesetLoader,
    tilesetSettings
});