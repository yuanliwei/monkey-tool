//@ts-check

require("regenerator-runtime/runtime");

import Loader from "@yuanliwei/web-loader"
import AppGoldenLayout from "./common/AppGoldenLayout"
import AppStyle from "./style/AppStyle"

class App {
    constructor() {
        AppStyle.default()
        Loader.config(require('./cfg/loaderConfig'))
        this.loader = new Loader()
        this.layout = new AppGoldenLayout(this)
    }
}

export default App

new App