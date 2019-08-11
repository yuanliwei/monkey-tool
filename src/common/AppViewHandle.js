//@ts-check

import ViewDemo from "../demo/ViewDemo"
import ViewScreen from "../index2/ViewScreen"
import ViewOutput from "../output/ViewOutput"
import ViewEditor from "../editor/ViewEditor"
import ViewCommand from "../command/ViewCommand"

let uniqId = 0

export default class AppViewHandle {
    constructor(app) {
        this.app = app
    }

    register(layout) {
        let { app } = this
        layout.registerComponent('ViewDemo', function (container, state) {
            let view = new ViewDemo(app);
            view.onCreateView(state)
            container.view = view
            container.uniqId = uniqId++
            container.getElement().append(view.getView())
        })
        layout.registerComponent('ViewEditor', function (container, state) {
            let view = new ViewEditor(app);
            view.onCreateView(state)
            container.view = view
            container.uniqId = uniqId++
            container.getElement().append(view.getView())
        })
        layout.registerComponent('ViewOutput', function (container, state) {
            let view = new ViewOutput(app);
            view.onCreateView(state)
            container.view = view
            container.uniqId = uniqId++
            container.getElement().append(view.getView())
        })
        layout.registerComponent('ViewScreen', function (container, state) {
            let view = new ViewScreen(app);
            view.onCreateView(state)
            container.view = view
            container.uniqId = uniqId++
            container.getElement().append(view.getView())
        })
        layout.registerComponent('ViewCommand', function (container, state) {
            let view = new ViewCommand(app);
            view.onCreateView(state)
            container.view = view
            container.uniqId = uniqId++
            container.getElement().append(view.getView())
        })
    }
}