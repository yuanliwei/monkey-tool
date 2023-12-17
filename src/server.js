import Koa from "koa"
import Router from 'koa-router'
import dayjs from 'dayjs'
import http from 'http'
import koaStatic from 'koa-static'
import { fileURLToPath } from "url"
import Controller from "android-controller-wrapper"

const dirPublic = fileURLToPath(new URL('../dist/', import.meta.url))

const router = new Router()
const controller = new Controller({
    type: 'repl',
    command_type: 'text',
    name: 'monkey-repl',
    port: 5678,
    ip_address: '',
    allow_ip_address: '192.168.*',
    query_view: true,
    activity_controller: true,
})

export async function start() {

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

    let port = process.env.PORT || 3000

    http.createServer(app.callback()).listen(port)
    await controller.connect()
    return port

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
        if (ctx.req.closed || ctx.req.errored) {
            reject(ctx.req.errored)
        }
    })
}

router.get('/status', async (ctx) => {
    ctx.body = { code: 0 }
})

router.post('/api/command', async (ctx) => {
    let body = await getRequestBody(ctx)
    let { type, cmd } = JSON.parse(body)
    console.log(body)
    if (type == 'press') {
        await controller.press(cmd)
        ctx.body = { code: 0 }
    } else {
        ctx.body = { code: 1, msg: 'not support command type :' + type }
    }
})