
/**
 * @param {connectModule} connect
 * @param {ConnectAppOptions} options
 */
module.exports = (connect, options) => {
    return [
        ['/jsontree', handleJsonTree],
        ['/capture', handleCapture],
        ['/screensize', handleScreenSize],
    ]
}

const { exec, execSync } = require('child_process');
const monkey = require('./src/tool/index')

/**
 * handle
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
async function handleJsonTree(req, res) {
    let tree = await monkey.getVisibleTree()
    res.writeHead(200, { 'Content-Type': mine['json'] });
    res.write(JSON.stringify(tree))
    res.end();
}

/**
 * handle
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
async function handleCapture(req, res) {
    let screenshot = await monkey.query('takescreenshot scale 0.4')
    screenshot = screenshot.replace(/[\r|\n]/g, '')
    res.writeHead(200, { 'Content-Type': mine['jpg'] });
    res.write(`data:image/jpeg;base64,${screenshot}`);
    res.end();
}

/**
 * handleScreenSize
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
async function handleScreenSize(req, res) {
    // getvar display.width
    // getvar display.height
    let width = await monkey.query('getvar display.width')
    let height = await monkey.query('getvar display.height')
    res.writeHead(200, { 'Content-Type': mine['json'] });
    res.write(JSON.stringify({ width: parseInt(width), height: parseInt(height) }));
    res.end();
}

var mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}