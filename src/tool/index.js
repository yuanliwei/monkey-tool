const { spawn, execSync } = require('child_process');

let devicesStr = execSync(`adb devices`).toString()
let devices = devicesStr.split('\n').map(o => o.trim()).filter(o => o)
devices = devices.map(o => o.split(/\s+/)).filter(o => o.length == 2).map(o => o[0])
console.log(devices);

if (!devices.length) throw Error('没有链接的手机')
let device = devices.shift()

let shell = spawn(`adb`, [`-s`, `${device}`, `shell`])
shell.stderr.setEncoding('utf-8')
shell.stdout.setEncoding('utf-8')
shell.stderr.on('data', (chunk) => { console.log('err', chunk) })
shell.stdin.on('error', (chunk) => { console.error('error', chunk) })
shell.stdout.on('error', (chunk) => { console.error('error', chunk) })
shell.stderr.on('error', (chunk) => { console.error('error', chunk) })
shell.stdin.on('close', (chunk) => { console.error('close', chunk) })
shell.stdout.on('close', (chunk) => { console.error('close', chunk) })
shell.stderr.on('close', (chunk) => { console.error('close', chunk) })

shell.stdin.write(`export CLASSPATH=/data/local/tmp/monkey_repl.jar\n`)
shell.stdin.write(`exec app_process /system/bin com.android.commands.monkey.Monkey\n`)

let queryCallbackMap = {}
let queryCallbackUniques = []
let queryCallbackChunks = ''
shell.stdout.on('data', (chunk) => {
    queryCallbackChunks += chunk
    let unique = queryCallbackUniques[0]
    let index = queryCallbackChunks.indexOf(`OK:${unique}`)
    while (unique && index != -1) {
        let result = queryCallbackChunks.substr(0, index)
        queryCallbackChunks = queryCallbackChunks.substr(index + unique.length + 5)
        queryCallbackMap[unique](result)
        queryCallbackUniques.shift()
        delete queryCallbackMap[unique]
        unique = queryCallbackUniques[0]
        index = queryCallbackChunks.indexOf(`OK:${unique}`)
    }
})

let AUTOINCREMENT = 0

/**
 * return UUID
 *
 * @returns {string}
 */
let uuid = () => AUTOINCREMENT++ + Math.random().toString().repeat(3)

/**
 *
 * @param {string} command run command
 */
let run = (command) => {
    shell.stdin.write(`${command}\n`)
}

/**
 * @param {number} timeout sleep timeout millisecond
 */
let sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

/**
 * run command and return result
 *
 * @param {string} command run command
 *
 * @returns {Promise<string>}
 */
let query = (command) => new Promise((resolve) => {
    let unique = uuid()
    queryCallbackUniques.push(unique)
    queryCallbackMap[unique] = () => { }
    run(`echo ${unique}`)
    run(command)
    unique = uuid()
    queryCallbackUniques.push(unique)
    queryCallbackMap[unique] = (data) => resolve(data.replace(/^[^;]*OK:/, '').trim())
    run(`echo ${unique}`)
})

/**
 * get rect from bounds string
 *
 * @param {string} bounds arrar number string
 * @returns {[number, number, number,number]} rect [left, top, right, bottom]
 */
let getRect = (bounds) => bounds.match(/\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]/).slice(1).map(o => parseInt(o))

/**
 * @typedef {Object} ViewTree
 * @property {number} deep deep 0
 * @property {number} index index 0
 * @property {string} resource_id -2147483650
 * @property {string} resource_id_name com.android.calculator2:id/mode
 * @property {string} text text
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
 * delete invisible tree nodes
 *
 * @param {ViewTree} tree a json view tree
 * @returns {ViewTree}
 */
let filterVisible = (tree) => {
    let loop = (o, w, h, gap) => o.childrens = o.childrens.filter(n => {
        loop(n, w, h, gap)
        let r = getRect(n.bounds)
        return n.childrens.length > 0
            || (r[0] < w - gap
                && r[1] < h - gap
                && r[2] > gap
                && r[3] > gap
                && r[2] - r[0] > gap
                && r[3] - r[1] > 5)
    })
    let rect = getRect(tree.bounds)
    loop(tree, rect[2], rect[3], 5)
    return tree
}

/**
 * get center point in rect
 *
 * @param {number[]} rect rect [left, top, right, bottom]
 * @returns {number[]} [x, y]
 */
let getCenter = (rect) => [rect[0] + rect[2], rect[1] + rect[3]].map(o => Math.round(o / 2))

/**
 * click at point
 *
 * @param {number[]} center [x, y]
 */
let clickCenter = (center) => run(`tap ${center.join(' ')}`)

/**
 * click rect center
 *
 * @param {number[]} rect [left, top, right, bottom]
 */
let clickRect = (rect) => clickCenter(getCenter(rect))

/**
 * wait a change on mobile screen
 */
let waitChange = () => async () => {
    while ((await query('getisviewchange')) == 'false') sleep(10)
    return
}

/**
 * get json tree only visible
 *
 * @returns {Promise<ViewTree|?>}
 */
let getVisibleTree = async () => {
    let json = await query('queryview gettree json')
    if (json.startsWith('ERROR:')) {
        json = await query('queryview gettree json')
    }
    if (json.startsWith('ERROR:')) {
        console.error(json);
        return {}
    }
    try {
        let tree = JSON.parse(json)
        return filterVisible(tree)
    } catch (e) {
        console.log('json', json, '|||');
        throw new Error(json)
    }
}

/**
 * wait until screen includes the string
 *
 * @param {string} string string
 */
let waitTreeFor = async (string) => {
    while (true) {
        let tree = await getVisibleTree();
        if (JSON.stringify(tree).includes(string)) {
            return tree
        }
        await waitChange()
    }
}

/**
 * @callback matchCallback
 * @param {ViewTree} ViewTree
 * @returns {boolean}
 */

/**
 * find view in viewtree with match
 *
 * @param {ViewTree} tree
 * @param {matchCallback} match
 * 
 * @returns {ViewTree}
 */
let findInTree = (tree, match) => {
    let obj;
    let loop = (child) => {
        if (!obj && match(child)) obj = child;
        else child.childrens.forEach(loop)
    };
    loop(tree);
    return obj
}

/**
 * click view that match matchCallback
 *
 * @param {ViewTree} tree
 * @param {matchCallback} match
 */
let clickAny = async (tree, match) => clickRect(getRect(findInTree(tree, match).bounds))

/**
 * click view that view text includes text
 *
 * @param {ViewTree} tree
 * @param {string} text
 */
let clickText = async (tree, text) => clickAny(tree, o => o.text && o.text.includes(text))

/**
 * click view that view resourceId is resourceId
 *
 * @param {ViewTree} tree
 * @param {string} resourceId
 */
let clickId = async (tree, resourceId) => clickAny(tree, o => o.resource_id_name == resourceId)

module.exports.uuid = uuid
module.exports.run = run
module.exports.sleep = sleep
module.exports.query = query
module.exports.getRect = getRect
module.exports.filterVisible = filterVisible
module.exports.getCenter = getCenter
module.exports.clickCenter = clickCenter
module.exports.clickRect = clickRect
module.exports.waitChange = waitChange
module.exports.getVisibleTree = getVisibleTree
module.exports.waitTreeFor = waitTreeFor
module.exports.findInTree = findInTree
module.exports.clickAny = clickAny
module.exports.clickText = clickText
module.exports.clickId = clickId