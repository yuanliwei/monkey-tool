
async function start() {
    console.log('jklkjhghjk');
    const monkey = require('../src/tool/index')
   
    setInterval(() => {
        monkey.run(`play /mnt/sdcard/1/1welcome.mp3`)
    }, 63000);

    monkey.run(`play /mnt/sdcard/1/1welcome.mp3`)

    // monkey.run(`quit`)
}



start()