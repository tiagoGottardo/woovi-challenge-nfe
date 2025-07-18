import Koa from 'koa'
import { koaBody } from 'koa-body'
import router from './routes'
import path from 'path'

const app = new Koa()

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 50 * 1024 * 1024,
    uploadDir: path.join(__dirname, '..', 'uploads'),
    keepExtensions: true
  }
}))

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(router.routes())
app.use(router.allowedMethods())

export default app
