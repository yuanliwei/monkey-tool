import Koa from "koa"
import Router from 'koa-router'
import dayjs from 'dayjs'
import http from 'http'
import koaStatic from 'koa-static'
import { existsSync } from "fs"

const dirPublic = (() => {
    let publicDir = decodeURI(new URL('./dest/', import.meta.url).pathname)
    if (!existsSync(publicDir)) {
        publicDir = publicDir.substring('1')
    }
    return publicDir
})()

const router = new Router()

async function start() {

    const app = new Koa()
    app.use(async (ctx, next) => {
        const ip = ctx.req.socket.remoteAddress
        console.log(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'), ip, ctx.method, ctx.originalUrl)
        try {
            await next()
        } catch (err) {
            console.error(err)
            ctx.response.status = err.statusCode || err.status || 500
            ctx.response.body = err.stack
        }
    })

    app.use(router.routes())
    app.use(router.allowedMethods())

    console.log('dirPublic', dirPublic)
    app.use(koaStatic(dirPublic))

    let port = process.env.PORT || 54346

    http.createServer(app.callback()).listen(port)

    console.info(`service start at ${port}`)

}

/**
 * @param {Koa.ParameterizedContext} ctx 
 * @returns {Promise<String>}
 */
async function getRequestBody(ctx) {
    return (await getRequestBodyBuffer(ctx)).toString('utf-8')
}
/**
 * @param {Koa.ParameterizedContext} ctx 
 * @returns {Promise<Buffer>}
 */
async function getRequestBodyBuffer(ctx) {
    return new Promise((resolve, reject) => {
        let buffer = []
        ctx.req.on('data', (chunk) => buffer.push(chunk))
        ctx.req.on('end', async () => {
            resolve(Buffer.concat(buffer))
        })
        ctx.req.on('error', reject)
    })
}

router.get('/status', async (ctx) => {
    ctx.body = { code: 0 }
})

start()