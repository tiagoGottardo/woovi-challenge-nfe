import Koa from 'koa'
import { koaBody } from 'koa-body'
import router from './routes'

const app = new Koa()

// const wsdlPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../wsdl/')
// app.use(serve(wsdlPath))

app.use(koaBody({
  text: true,
  json: false,
  urlencoded: false,
  multipart: false,
}))

app.use(router.routes()).use(router.allowedMethods())


export default app
