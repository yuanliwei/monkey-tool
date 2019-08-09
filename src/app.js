require("regenerator-runtime/runtime");

const Loader = require('@yuanliwei/web-loader');
const Index = require('./index/index')
// const Generate = require('./gen/index')
// const Escape = require('./escape/index')
// const JsonTool = require('./json-tool/index')
// const RegExpDoc = require('./regexp-doc/index')
// const Chart = require('./chart/index')
// const GnuPlot = require('./gnuplot/index')

new class App {
    constructor() {
        Loader.config(require('./cfg/loaderConfig'))
        this.loader = new Loader()
        window.onhashchange = (ev) => {
            document.querySelectorAll('style').forEach(o => o.remove())
            switch (location.hash) {
                // case '#/gnuplot': return new GnuPlot(this)
                // case '#/chart': return new Chart(this)
                // case '#/regexp-doc': return new RegExpDoc(this)
                // case '#/json-tool': return new JsonTool(this)
                // case '#/escape': return new Escape(this)
                // case '#/generate': return new Generate(this)
                default: return new Index(this)
            }
        }
        window.onhashchange()
    }
}
