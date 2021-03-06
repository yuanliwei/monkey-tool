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
        await loader.load('jquery', 'popper')
        await loader.load('bootstrap')

        const fs = require('fs')
        const style = document.createElement('style')
        style.innerHTML = fs.readFileSync(__dirname + '/style.css', 'utf-8')
        document.head.append(style)
        document.body.innerHTML = fs.readFileSync(__dirname + '/template.html', 'utf-8')

        // views
        /** @type {HTMLElement} */
        this.screenImg = document.querySelector('#screen')
        this.canvas = document.querySelector('#screen_mask')
        this.left = document.querySelector('.left')
        this.refreshBtn = document.querySelector('.refresh')
        this.info = document.querySelector('.info')
        this.ctx = this.canvas.getContext('2d')

        /**
         * (image size) / (screen size)
         */
        this.ratioSize = 1
        this.screenSize = { width: 100, height: 100 }

        await this.initImage(this)
        this.initButtons()

        await this.refresh()

        let sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

        while (true) {
            try {
                await this.refresh()
            } catch (e) {
                console.error(e);
            }
            await sleep(1000)
        }
    }

    async loadScreenImage() {
        return new Promise(async (resolve, reject) => {
            this.screenImg.src = await (await fetch('/capture')).text()
            this.screenImg.onload = resolve
            this.screenImg.onerror = reject
        })
    }

    async refresh() {
        await this.loadScreenImage()
        await this.drawRect(this)
    }

    async initButtons() {
        this.refreshBtn.onclick = () => {
            this.refresh()
        }
        /**
         * @param {MouseEvent} ev
         */
        this.canvas.onclick = (ev) => {
            this.ctx.beginPath()
            this.ctx.arc(ev.offsetX, ev.offsetY, 10, 0, 360, false)
            this.ctx.stroke()
            this.findClickView(ev.offsetX, ev.offsetY, this.currentTree, this.ratioSize)
        }


        let mouseHasDown = false

        /** @type {HTMLElement} */
        let canvas = this.canvas
        canvas.onmousedown = (ev) => {
            if (ev.button != 0) return
            mouseHasDown = true
            let cmd = `touch down ${parseInt(ev.offsetX / this.ratioSize)} ${parseInt(ev.offsetY / this.ratioSize)}`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        }
        canvas.onmousemove = (ev) => {
            if (ev.button != 0) return
            if (!mouseHasDown) return
            let cmd = `touch move ${parseInt(ev.offsetX / this.ratioSize)} ${parseInt(ev.offsetY / this.ratioSize)}`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        }
        canvas.onmouseup = (ev) => {
            if (ev.button != 0) return
            if (!mouseHasDown) return
            mouseHasDown = false
            let cmd = `touch up ${parseInt(ev.offsetX / this.ratioSize)} ${parseInt(ev.offsetY / this.ratioSize)}`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        }
        canvas.onmouseout = canvas.onmouseup
        canvas.onmouseleave = canvas.onmouseup
    }

    /**
     *
     * @param {Object} param0
     * @param {HTMLElement} param0.canvas
     * @param {CanvasRenderingContext2D} param0.ctx
     */
    async drawRect({ canvas, ctx }) {
        let json = await (await fetch(`/jsontree`)).json()
        let tree = json
        this.currentTree = json
        let width = canvas.width
        let getRect = (bounds) => bounds.match(/\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]/).slice(1).map(o => parseInt(o))
        let [x, y, w, h] = [0, 0, 0, 0]
        try {
            [x, y, w, h] = getRect(tree.bounds)
        } catch (error) {
            console.log('========================================');
            console.log(tree.bounds);
            console.error(error);
        }
        const scale = width / w
        // console.log('scale', scale);

        console.log(x, y, w, h);
        let arr = []
        let loop = (node) => { arr.push(node); node.childrens && node.childrens.forEach(o => loop(o)) }
        loop(tree)
        ctx.clearRect(x, y, w, h)
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,0,0,0.1)'
        ctx.lineWidth = 1
        ctx.save()
        arr.forEach(o => {
            try {
                let [x1, y1, x2, y2] = getRect(o.bounds)
                let [w, h] = [x2 - x1, y2 - y1]
                ctx.strokeRect(x1 * scale, y1 * scale, w * scale, h * scale)
            } catch (error) {
                console.log('========================================');
                console.log(o.bounds);
                console.log(o);
                console.log(JSON.stringify(tree));
                console.error(error);
            }
        })
        ctx.closePath()
        ctx.restore()
    }

    /**
     * @typedef {Object} ViewTree
     * @property {number} deep deep 0
     * @property {number} index index 0
     * @property {string} resource_id -2147483650
     * @property {string} resource_id_name com.android.calculator2:id/mode
     * @property {string} bounds "[0,0][1080,2316]"
     * @property {string} class  "android.widget.FrameLayout"
     * @property {number} inputType  -1
     * @property {boolean} isEditable  false
     * @property {boolean} isClickable false
     * @property {boolean} isCheckable false
     * @property {boolean} isChecked false
     * @property {boolean} isVisibleToUser true
     * @property {boolean} isAccessibilityFocused false
     * @property {number} windowId windowId 39904
     * @property {number} viewId viewId 2147483646
     * @property {ViewTree[]} childrens childrens
     */

    /**
     *
     * @param number} x
     * @param number} y
     * @param {ViewTree} tree
     * @param {number} ratioSize
     */
    findClickView(x, y, tree, ratioSize) {
        x = x / ratioSize
        y = y / ratioSize
        let getRect = (bounds) => bounds.match(/\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]/).slice(1).map(o => parseInt(o))
        /** @type {ViewTree[]} */
        let arr = []
        let loop = (node) => { arr.push(node); node.childrens && node.childrens.forEach(o => loop(o)) }
        loop(tree)
        let findArr = []
        arr.forEach(o => {
            let [x1, y1, x2, y2] = getRect(o.bounds)
            console.log(ratioSize, x, y, x1, y1, x2, y2);
            if (x > x1 && x < x2 && y > y1 && y < y2) {
                findArr.push(`${' '.repeat(o.deep)} ${o.class} ${o.text && o.text.replace(/\n/g, ' ')} ${o.resource_id} ${o.resource_id_name}`)
            }
        })
        this.clearMessage()
        this.message(findArr.join('\n'))
        console.log(findArr.join('\n'))
    }

    /**
     *
     * @param {Object} param0
     * @param {HTMLElement} param0.left
     * @param {HTMLElement} param0.canvas
     * @param {HTMLElement} param0.screenImg
     * @param {CanvasRenderingContext2D} param0.ctx
     */
    async initImage({ left, canvas, screenImg, ctx }) {
        return new Promise(async (resolve, reject) => {
            this.screenImg.src = await (await fetch('/capture')).text()
            screenImg.onload = async (ev) => {
                let ratio = screenImg.width / screenImg.height
                screenImg.onload = null
                let width = left.clientWidth
                let height = left.clientHeight
                left.style.width = height * ratio + 'px'
                screenImg.style.width = '100%'
                canvas.width = height * ratio
                canvas.height = height
                this.screenSize = await (await fetch('/screensize')).json()
                this.ratioSize = height * ratio / this.screenSize.width
                resolve()
            }
        })
    }

    message(msg) {
        this.info.value += msg + '\n'
    }

    clearMessage() {
        this.info.value = ''
    }
}