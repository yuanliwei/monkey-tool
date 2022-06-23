module.exports = class Index {
    constructor(app) {
        this.app = app
        this.loader = app.loader
        this.init(this)
    }

    /**
     *
     * @param {*} param0
     */
    async init({ app, loader }) {
        // const fs = require('fs')
        // const style = document.createElement('style')
        // style.innerHTML = fs.readFileSync(__dirname + '/style.css', 'utf-8')
        // document.head.append(style)
        document.body.innerHTML = fs.readFileSync(__dirname + '/template.html', 'utf-8')
    }

}