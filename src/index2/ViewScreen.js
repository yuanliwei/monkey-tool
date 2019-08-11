//@ts-check

import BaseView from "../common/BaseView"
// const BaseView = require('../common/BaseView');

export default class ViewScreen extends BaseView {
    constructor(app) {
        super(app)
    }

    async onCreateView(state) {
        const fs = require('fs')
        let html = $(fs.readFileSync(__dirname + '/template.html', 'utf-8'))
        this.container.append(html)
        /** @type {HTMLImageElement} */
        // @ts-ignore
        this.image = this.container.find('.screenshot')[0]
        /** @type {HTMLCanvasElement} */
        // @ts-ignore
        this.canvas = this.container.find('.screenshot_mask')[0]
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext('2d')

        this.removeLoading()

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

    onStateChanged() {
        console.log('onStateChanged...');

        this.initImage(this)
    }

    async loadScreenImage() {
        return new Promise(async (resolve, reject) => {
            this.image.src = await (await fetch('/capture')).text()
            this.image.onload = resolve
            this.image.onerror = reject
        })
    }

    async refresh() {
        await this.loadScreenImage()
        await this.drawRect(this)
    }

    async initButtons() {
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
            let cmd = `touch down ${Math.round(ev.offsetX / this.ratioSize)} ${Math.round(ev.offsetY / this.ratioSize)}`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        }
        canvas.onmousemove = (ev) => {
            if (ev.button != 0) return
            if (!mouseHasDown) return
            let cmd = `touch move ${Math.round(ev.offsetX / this.ratioSize)} ${Math.round(ev.offsetY / this.ratioSize)}`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        }
        canvas.onmouseup = (ev) => {
            if (ev.button != 0) return
            if (!mouseHasDown) return
            mouseHasDown = false
            let cmd = `touch up ${Math.round(ev.offsetX / this.ratioSize)} ${Math.round(ev.offsetY / this.ratioSize)}`
            fetch(`/run?cmd=${encodeURI(cmd)}`)
        }
        canvas.onmouseout = canvas.onmouseup
        canvas.onmouseleave = canvas.onmouseup
    }

    /**
     *
     * @param {Object} param0
     * @param {HTMLCanvasElement} param0.canvas
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
     *
     * @param {number} x
     * @param {number} y
     * @param {import("../tool").ViewTree} tree
     * @param {number} ratioSize
     */
    findClickView(x, y, tree, ratioSize) {
        x = x / ratioSize
        y = y / ratioSize
        let getRect = (bounds) => bounds.match(/\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]/).slice(1).map(o => parseInt(o))
        /** @type {import("../tool").ViewTree[]} */
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
        console.log(findArr.join('\n'))
        //window A
        this.app.layout.eventHub.emit('onfindclicktree', { message: findArr.join('\n') });
    }

    /**
     *
     * @param {Object} param0
     * @param {HTMLCanvasElement} param0.canvas
     * @param {HTMLImageElement} param0.image
     */
    async initImage({ canvas, image }) {
        return new Promise(async (resolve) => {
            this.image.src = await (await fetch('/capture')).text()
            image.onload = async () => {
                image.onload = null
                canvas.width = image.clientWidth
                canvas.height = image.clientHeight
                this.screenSize = await (await fetch('/screensize')).json()
                this.ratioSize = image.width / this.screenSize.width
                resolve()
            }
        })
    }
}