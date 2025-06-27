import Koa from 'koa'
import { koaBody } from 'koa-body'
import router from './routes'

const app = new Koa()

app.use(koaBody({
  text: true,
  json: false,
  urlencoded: false,
  multipart: false,
}))

app.use(router.routes()).use(router.allowedMethods())

export default app
