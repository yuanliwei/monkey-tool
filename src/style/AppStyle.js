module.exports = class AppStyle {
    static default() {
        document.querySelectorAll('style').forEach(o => o.remove())
        const fs = require('fs')
        let style = document.createElement('style')
        style.innerHTML = fs.readFileSync(__dirname + '/style.css', 'utf-8')
        document.head.append(style)
        style = document.createElement('style')
        style.innerHTML = fs.readFileSync(__dirname + '/codemirror.css', 'utf-8')
        document.head.append(style)
    }
}