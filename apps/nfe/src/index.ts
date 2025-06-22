import Koa from 'koa'
import Router from '@koa/router'
import { koaBody } from 'koa-body'
import { parseStringPromise, Builder } from 'xml2js'
import serve from 'koa-static'
import path from 'path'

import validator from 'xsd-schema-validator'
import { fileURLToPath } from 'url'

const PORT = 3000

const app = new Koa()
const router = new Router()

const wsdlPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../wsdl/')
app.use(serve(wsdlPath))

app.use(koaBody({
  text: true,
  json: false,
  urlencoded: false,
  multipart: false,
}))

router.post('/soap', async (ctx) => {
  const requestBody = ctx.request.body

  if (!requestBody || typeof requestBody !== 'string' || requestBody.trim().length === 0) {
    console.warn('Received an empty or non-string request body:', requestBody)
    ctx.status = 400
    ctx.body = 'Request body invalid.'
    return
  }

  try {
    const mainXsdPath = path.join(wsdlPath, 's.wsdl')

    console.log(`Attempting to validate XML against: ${mainXsdPath}`)
    let result = await validator.validateXML(requestBody, mainXsdPath)
    console.log(result)
    console.log('XML Validated successfully against schema.')

    const xmlObject = await parseStringPromise(requestBody)
    console.log('Req parsed:', JSON.stringify(xmlObject, null, 2))

    let responseBodyContent = {
      'tns:something': {
        'tns:success': true,
        'tns:message': `Success`
      }
    }

    const builder = new Builder({ headless: true })
    const soapResponseEnvelope = {
      'soap:Envelope': {
        '$': {
          'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:tns': 'http://example.com/myservice',
          'xmlns:types': 'http://example.com/myservice/types'
        },
        'soap:Body': responseBodyContent
      }
    }

    const xmlResponse = builder.buildObject(soapResponseEnvelope)

    ctx.set('Content-Type', 'text/xml')
    ctx.body = xmlResponse

  } catch (error: any) {
    console.error('Error on process SOAP req:', error)
    ctx.status = 500
    ctx.set('Content-Type', 'text/xml')

    ctx.body = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <soap:Fault>
            <faultcode>soap:Server</faultcode>
            <faultstring>${error.message || 'Internal error on process SOAP request.'}</faultstring>
            ${error.message ? `<detail>${error.message}</detail>` : ''}
          </soap:Fault>
        </soap:Body>
      </soap:Envelope>
    `
  }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`) })
