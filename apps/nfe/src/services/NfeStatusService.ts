import { parseStringPromise, Builder } from 'xml2js'
import fs from 'node:fs'
import path from 'path'
import libxmljs from 'libxmljs2'
import { ParameterizedContext } from 'koa'

const nfeStatusService = async (ctx: ParameterizedContext) => {
  const requestBody = ctx.request.body as string

  try {
    const xsdSchemasPath = path.join(__dirname, '..', '..', 'xsd');

    process.chdir(xsdSchemasPath)

    const xsdString = fs.readFileSync('consStatServ_v4.00.xsd', 'utf8')

    let xmlDoc = libxmljs.parseXmlString(requestBody)
    let xsdDoc = libxmljs.parseXmlString(xsdString)

    const validationResult = xmlDoc.validate(xsdDoc)

    const xmlObject = await parseStringPromise(requestBody)

    console.log(xmlObject['consStatServ']['tpAmb'][0])

    let responseBodyContent = {
      'tns:something': {
        'tns:success': true,
        'tns:message': `Success`
      }
    }

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

    const builder = new Builder({ headless: true })

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
}

export default nfeStatusService
