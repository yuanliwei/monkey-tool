//@ts-check

import AppViewHandle from "./AppViewHandle"

let timer = null
let lastEmitStateChangedTime = 0

export default class AppGoldenLayout {
    constructor(app) {
        this.app = app
        this.componentMap = {}

        var config = {
            content: [{
                type: 'row',
                content: [{
                    type: 'component',
                    componentName: 'ViewScreen',
                    componentState: { label: 'A' }
                }, {
                    type: 'column',
                    content: [{
                        type: 'component',
                        componentName: 'ViewEditor',
                        componentState: { label: 'B' }
                    }, {
                        type: 'component',
                        componentName: 'ViewOutput',
                        componentState: { label: 'C' }
                    }, {
                        type: 'component',
                        componentName: 'ViewCommand',
                        componentState: { label: 'D' }
                    }]
                }]
            }]
        }

        try {
            config = JSON.parse(localStorage['app-goldenlayout-config'])
        } catch (e) { }

        const GoldenLayout = window.GoldenLayout || require('golden-layout')
        var layout = new GoldenLayout(config);
        this.layout = layout
        this.eventHub = layout.eventHub

        $(window).resize(() => layout.updateSize())

        new AppViewHandle(app).register(layout)

        layout.init();

        layout.on('stateChanged', (item) => {
            // if (!this.layout.isInitialised) { return }
            if (Date.now() - lastEmitStateChangedTime > 400) {
                this.emitOnStateChanged()
            } else {
                clearTimeout(timer)
                timer = setTimeout(() => { this.emitOnStateChanged() }, 800)
            }
        });

        layout.on('titleChanged', (item) => {
            if (item.type == 'component') {
                item.container.view.onTitleChanged(item)
            }
        })
        layout.on('activeContentItemChanged', (item) => {
            if (item.type == 'component') {
                item.container.view.onActiveContentItemChanged(item)
            }
        })
        layout.on('itemDestroyed', (item) => {
            if (item.type == 'component') {
                delete this.componentMap[item.container.uniqId]
                item.container.view.onItemDestroyed(item)
            }
        })
        layout.on('itemCreated', (item) => {
            if (item.type == 'component') {
                this.componentMap[item.container.uniqId] = item
                item.container.view.onItemCreated(item)
            }
        })
        layout.on('componentCreated', (item) => {
            if (item.type == 'component') {
                item.container.view.onComponentCreated(item)
            }
        })

        $(window).resize(function () {
            layout.updateSize()
        });
    }

    emitOnStateChanged() {
        try {
            var state = JSON.stringify(this.layout.toConfig());
            localStorage['app-goldenlayout-config'] = state
        } catch (e) { console.error(e); }

        lastEmitStateChangedTime = Date.now()

        for (var k in this.componentMap) {
            let v = this.componentMap[k]
            if (this.componentMap.hasOwnProperty(k)) {
                v.container.view.onStateChanged(v)
            }
        }
    }
}