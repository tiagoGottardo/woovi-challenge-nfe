import Router from '@koa/router'
import Koa from 'koa'
import { koaBody } from 'koa-body'
import mount from 'koa-mount'

import serve from 'koa-static'
import path from 'path'

const router = new Router()
const app = new Koa()

app.use(koaBody({
  text: true,
  json: false,
  urlencoded: false,
  multipart: false,
}))

app.use(mount('/xsd', serve(path.join(__dirname, '..', 'xsd'))))

app
  .use(router.routes())
  .use(router.allowedMethods())

export default app
