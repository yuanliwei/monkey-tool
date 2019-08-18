// https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURI(sentence)}&spd=5

async function start() {
    const path = require('path')
    let sentence = "hello"
    // let result = await r.request(`https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURI(sentence)}&spd=5`)
    let url = `https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURI(sentence)}&spd=5`
    let mp3path = path.join(__dirname, 'test.mp3')

    await downloadFile(url, mp3path)
    console.log('over!');

}

async function downloadFile(url, destPath) {
    const fs = require('fs')
    let stream = fs.createWriteStream(destPath)
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
            res.pipe(stream)
            res.on('end', () => { resolve() })
        })
        req.on('error', (e) => { reject(e) })
        req.end()
    })
}

start()