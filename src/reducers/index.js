import { combineReducers } from "redux"

// import all reducers
import app from "./appReducer"
import tilesetArea from "./tilesetAreaReducer"
import tilesetLoader from "./tilesetLoaderReducer"
import tilesetSettings from "./tilesetSettingsReducer"
import modalWindows from "./modalWindowsReducer"

export default combineReducers({
    app,
    tilesetArea,
    tilesetLoader,
    tilesetSettings,
    modalWindows
});