
async function start() {
    const monkey = require('../src/tool/index')
    let i = 30
    // i = 1
    while (i--) {
        await monkey.sleep(`300`)
        // monkey.run(`tap 550 880`)
        // await monkey.sleep(`700`)
        // monkey.run(`type sleep`)
        // monkey.run(`copy base64 VW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbldhcm5pbmc6IFR5cGVFcnJvcjogQ2Fubm90IHJlYWQgcHJvcGVydHkgJ2JvdW5kcycgb2YgdW5kZWZpbmVkDQogICAgICAgIGF0IGNsaWNrQW55IChkOlxub2RlXG1vbmtleS10b29sXHNyY1x0b29sXGluZGV4LmpzOjIzMzo4MCkNCiAgICAgICAgYXQgT2JqZWN0LmNsaWNrVGV4dCAoZDpcbm9kZVxtb25rZXktdG9vbFxzcmNcdG9vbFxpbmRleC5qczoyNDE6MzkpDQogICAgICAgIGF0IHN0YXJ0IChkOlxub2RlXG1vbmtleS10b29sXHRlc3RcdGVzdC5qczoxNzoyNikNCiAgICAgICAgYXQgcHJvY2Vzc1RpY2tzQW5kUmVqZWN0aW9ucyAoaW50ZXJuYWwvcHJvY2Vzcy90YXNrX3F1ZXVlcy5qczo4OTo1KQ0KICAgIChub2RlOjIxOTQ0KSBVbmhhbmRsZWRQcm9taXNlUmVqZWN0aW9uV2FybmluZzogVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uLiBUaGlzIGVycm9yIG9yaWdpbmF0ZWQgZWl0aGVyIGJ5IHRocm93aW5nIGluc2lkZSBvZiANCiAgICBhbiBhc3luYyBmdW5jdGlvbiB3aXRob3V0IGEgY2F0Y2ggYmxvY2ssIG9yIGJ5IHJlamVjdGluZyBhIHByb21pc2Ugd2hpY2ggd2FzIG5vdCBoYW5kbGVkIHdpdGggLmNhdGNoKCkuIChyZWplY3Rpb24gaWQ6IDIpICAgICAgDQogICAgKG5vZGU6MjE5NDQpIFtERVAwMDE4XSBEZXByZWNhdGlvbldhcm5pbmc6IFVuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbnMgYXJlIGRlcHJlY2F0ZWQuIEluIHRoZSBmdXR1cmUsIHByb21pc2UgcmVqZWN0aW9ucyB0aGF0IA0KICAgIGFyZSBub3QgaGFuZGxlZCB3aWxsIHRlcm1pbmF0ZSB0aGUgTm9kZS5qcyBwcm9jZXNzIHdpdGggYSBub24temVybyBleGl0IGNvZGUu`)
        // await monkey.query(`press KEYCODE_PASTE`)
        let tree = await monkey.getVisibleTree()
        // 单选
        // if (Math.random() > 0.75) {
        //     await monkey.clickText(tree, 'A.')
        // } else if (Math.random() > 0.5) {
        //     await monkey.clickText(tree, 'B.')
        // } else if (Math.random() > 0.25) {
        //     await monkey.clickText(tree, 'C.')
        // } else {
        //     await monkey.clickText(tree, 'B.')
        // }
        // 判断
        if (Math.random() > 0.5) {
            await monkey.clickText(tree, 'True')
        } else {
            await monkey.clickText(tree, 'False')
        }
        // 填空
        // await monkey.run('tap 500 1194')
        // await monkey.clickAny(tree, (str) => str && str['class'].includes('android.widget.EditText'))
        // await monkey.sleep(300)
        // monkey.run(`type sleep`)

        await monkey.sleep(`500`)
        monkey.run(`slide 600 1188 300 1188 20 16`)

        // monkey.run(`tap 540 1800`)
        // monkey.run(`sleep 1000`)

        // monkey.run(`tap 900 2230`)
        // monkey.run(`sleep 800`)
    }

    monkey.run(`quit`)
}



start()