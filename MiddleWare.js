
/**
 * @param {connectModule} connect
 * @param {ConnectAppOptions} options
 */
// eslint-disable-next-line no-unused-vars
module.exports = (connect, options) => {
    return [
        ['/jsontree', handleJsonTree],
        ['/capture', handleCapture],
        ['/screensize', handleScreenSize],
        ['/run', handleRun],
        ['/playtext', handlePlayText],
    ]
}

const monkey = require('./src/tool/index')

/**
 * handle
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function handleJsonTree(req, res) {
    let tree = await monkey.query(`queryview gettree json`)
    res.writeHead(200, { 'Content-Type': mine['json'] });
    res.write(tree)
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

/**
 * handleRun
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function handleRun(req, res) {
    const url = require('url');
    const querystring = require('querystring');
    let cmd = querystring.parse(url.parse(req.url).query).cmd
    monkey.run(cmd)
    res.writeHead(200, { 'Content-Type': mine['json'] });
    res.write(JSON.stringify({}));
    res.end();
}

/**
 * handlePlayText
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function handlePlayText(req, res) {
    const querystring = require('querystring');
    let text = querystring.parse(require('url').parse(req.url).query).text
    let url = `https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURI(text)}&spd=5`

    const os = require('os')
    const fs = require('fs')
    const path = require('path')

    let md5 = (s) => require('crypto').createHash("md5").update(s).digest('hex')
    let mp3Name = `monkey-tool_${md5(url)}.mp3`
    let mp3path = path.join(os.tmpdir(), mp3Name)
    let sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))
    if (!fs.existsSync(mp3path)) {
        let count = 2
        while (count--) {
            try {
                await downloadFile(url, mp3path)
                break
            } catch (e) {
                console.error(e);
                await sleep(500)
            }
        }
    }
    const { execSync } = require('child_process')
    let destPath = `/mnt/sdcard/monkey-tool-mp3/${mp3Name}`
    execSync(`adb push ${mp3path} /mnt/sdcard/monkey-tool-mp3/${mp3Name}`)
    let duration = await monkey.query(`play ${destPath}`)
    res.writeHead(200, { 'Content-Type': mine['json'] });
    res.write(JSON.stringify({ duration: parseInt(duration) }));
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

async function downloadFile(url, destPath) {
    const fs = require('fs')
    return new Promise((resolve, reject) => {
        let options = require('url').parse(url)
        options.method = 'GET'
        options.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }
        let req = require(url.split(':')[0]).request(options, (res) => {
            console.log('STATUS:' + res.statusCode);
            if (res.statusCode == 200) {
                let stream = fs.createWriteStream(destPath)
                stream.on('close', () => resolve())
                res.pipe(stream)
            } else {
                reject(res.statusCode)
            }
        })
        req.on('error', (e) => { reject(e) })
        req.end()
    })
}