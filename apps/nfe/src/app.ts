import Koa from 'koa'
import { koaBody } from 'koa-body'
import mount from 'koa-mount'
import router from './routes'

import { parseStringPromise, Builder } from 'xml2js'
import serve from 'koa-static'
import path from 'path'

const app = new Koa()

app.use(koaBody({
  text: true,
  json: false,
  urlencoded: false,
  multipart: false,
}))

app.use(async (ctx, next) => {
  if (ctx.method === 'POST') {
    const soapReq = ctx.request.body as string
    console.log(soapReq)

    const parsedSoap = await parseStringPromise(soapReq, { explicitArray: false })

    if (!parsedSoap['soap:Envelope']['soap:Body']) {
      ctx.status = 400
      ctx.body = "Invalid SOAP request."
      return
    }

    const builder = new Builder({ headless: true })

    ctx.request.body = builder.buildObject(parsedSoap['soap:Envelope']['soap:Body'])
  }
  await next()
});

app.use(mount('/xsd', serve(path.join(__dirname, '..', 'xsd'))))

app.use(router.routes()).use(router.allowedMethods())

export default app
