import MainApplication from './svelte/MainApplication.svelte'

class App {
    constructor() {
        console.log('start app')
        new MainApplication({ target: document.body, props: { app: this } })
    }
}

export default App

new App