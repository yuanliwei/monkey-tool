module.exports = class Demo {
    constructor(app) {
        this.app = app
        this.loader = app.loader
        this.init(this)
    }

    async init({ app, loader }) {
        await loader.load('jquery', 'particles')

        const fs = require('fs')
        const style = document.createElement('style')
        style.innerHTML = fs.readFileSync(__dirname + '/style.css', 'utf-8')
        document.head.append(style)
        document.body.innerHTML = fs.readFileSync(__dirname + '/template.html', 'utf-8')

        // todo;
    }
}