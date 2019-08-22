
async function start() {
    const monkey = require('../src/tool/index')
    let i = 11
    while (i--) {
        monkey.run(`tap 540 1800`)
        // await monkey.sleep(`1800`)
        monkey.run(`sleep 5800`)

        monkey.run(`tap 540 1800`)
        monkey.run(`sleep 1000`)

        monkey.run(`tap 900 2230`)
        monkey.run(`sleep 800`)
    }
    `
    `.split('\n').map(o =>o.trim()).forEach((o)=>{
        monkey.run(o)
    })
    monkey.run(`quit`)
}



start()