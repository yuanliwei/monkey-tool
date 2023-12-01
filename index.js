import { start } from "./src/server.js"

let port = await start()

console.info(`service start at ${port}`)
