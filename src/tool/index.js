const { exec, execSync } = require('child_process');

let devicesStr = execSync(`adb devices`).toString()
let devices = devicesStr.split('\n').map(o => o.trim()).filter(o => o)
devices = devices.map(o => o.split(/\s+/)).filter(o => o.length == 2).map(o => o[0])
console.log(devices);

if (!devices.length) throw Error('没有链接的手机')
let device = devices.shift()

let shell = exec(`adb -s ${device} shell "export CLASSPATH=/data/local/tmp/monkey_repl.jar && exec app_process /system/bin com.android.commands.monkey.Monkey"`)
shell.stderr.on('data', (chunk) => { console.log(chunk) })
/**
 * return UUID
 */
let uuid = () => Math.random().toString().repeat(3)

/**
 * 
 * @param {string} command run command
 */
let run = (command) => shell.stdin.write(`${command}\n`)

/**
 * @param {number} timeout sleep timeout millisecond
 */
let sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

/**
 * wait command run over
 */
let wait = () => new Promise((resolve) => { let unique = uuid(), chunks = []; shell.stdout.removeAllListeners('data'); shell.stdout.on('data', (chunk) => { chunks.push(chunk); if (chunk.includes(unique)) resolve(chunks.join('').replace(unique, '')) }); run(`echo ${unique}`) })

/**
 * run command and return result
 * 
 * @param {string} command run command
 */
let query = (command) => new Promise(async (resolve) => { await wait(); run(command); resolve((await wait()).replace(/OK:/g, '').trim()) })

/**
 * get rect from bounds string
 * 
 * @param {string} bounds arrar number string
 * @returns {[number, number, number,number]} rect result
 */
let getRect = (bounds) => bounds.match(/\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]/).slice(1).map(o => parseInt(o))

/**
 * @typedef {Object} ViewTree
 * @property {number} deep deep 0
 * @property {number} index index 0
 * @property {string} resource_id -2147483650
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
 */
let filterVisible = (tree) => { let loop = (o, w, h, gap) => o.childrens = o.childrens.filter(n => { loop(n, w, h, gap); let r = getRect(n.bounds); return n.childrens.length > 0 || (r[0] < w - gap && r[1] < h - gap && r[2] > gap && r[3] > gap && r[2] - r[0] > gap && r[3] - r[1] > 5) }); let rect = getRect(tree.bounds); loop(tree, rect[2], rect[3], 5); return tree }

/**
 * get center point in rect
 *
 * @param {number[]} rect rect
 * @returns {number[]}
 */
let getCenter = (rect) => [rect[0] + rect[2], rect[1] + rect[3]].map(o => parseInt(o / 2))

/**
 * click at point
 * 
 * @param {number[]} center 
 */
let clickCenter = (center) => run(`tap ${center.join(' ')}`)

/**
 * click rect center
 * 
 * @param {number[]} rect 
 */
let clickRect = (rect) => clickCenter(getCenter(rect))

/**
 * wait a change on mobile screen
 */
let waitChange = () => new Promise(async (resolve) => { while ((await query('getisviewchange')) == 'false') sleep(10); resolve() })

/**
 * get json tree only visible
 */
let getVisibleTree = async () => filterVisible(JSON.parse(await query('queryview gettree json')))

/**
 * wait until screen includes the string
 * 
 * @param {string} string string
 */
let waitTreeFor = (string) => new Promise(async (resolve) => { while (true) { let tree = await getVisibleTree(); if (JSON.stringify(tree).includes(string)) { resolve(tree); break } await waitChange() } })

/**
 * @callback matchCallback
 * @param {string} string 
 * @returns {boolean}
 */

/**
 * find view in viewtree with match
 * 
 * @param {ViewTree} tree 
 * @param {matchCallback} match 
 */
let findInTree = (tree, match) => { let obj; let loop = (child) => { if (!obj && match(child)) obj = child; else child.childrens.forEach(loop) }; loop(tree); return obj }

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
module.exports.wait = wait
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