//@ts-check

import BaseView from "../common/BaseView"
import CodeMirrorUtil from "../common/CodeMirrorUtil";

export default class ViewCommand extends BaseView {
    constructor(app) {
        super(app)
    }

    async onCreateView(state) {
        const fs = require('fs')
        this.container.append(fs.readFileSync(__dirname + '/template.html', 'utf-8'))
        this.removeLoading()
        this.addButton("menu", () => {
            let cmd = `press menu`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        })
        this.addButton("home", () => {
            let cmd = `press home`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        })
        this.addButton("back", () => {
            let cmd = `press back`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        })
        this.addButton("playText", async () => {
            let text = await this.queryBy("getOutputSelectText");
            let sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))
            text = text.replace(/\./g, '.\n')
            text = text.replace(/\?/g, '?\n')
            text = text.replace(/!/g, '!\n')
            text = text.replace(/。/g, '。\n')
            text = text.replace(/？/g, '？\n')
            text = text.replace(/！/g, '！\n')
            let sentences = text.split('\n').filter(o => o.trim())
            for (const sentence of sentences) {
                console.log(sentence);
                let fetchResult = await fetch(`/playtext?text=${encodeURI(sentence)}`)
                let json = await fetchResult.json()
                let duration = json.duration
                await sleep(duration)
                await sleep(1000)
            }
        })
        this.addButton("startRefresh", () => {
            this.app.layout.eventHub.emit('startRefresh', {})
        })
        this.addButton("stopRefresh", () => {
            this.app.layout.eventHub.emit('stopRefresh', {})
        })
    }

    addButton(text, callback) {
        let button = $(`<button class="btn btn-primary m-3 p-3">${text}</button>`)
        button.click(callback)
        this.container.find(".button-group").append(button)
    }

}