import { parseStringPromise, Builder } from 'xml2js'
import fs from 'node:fs'
import path from 'path'
import libxmljs from 'libxmljs2'
import { ParameterizedContext } from 'koa'

const nfeStatusServico = async (ctx: ParameterizedContext) => {
  const initialSoapXmlString = ctx.request.body as string
  let fullSoapXmlString = initialSoapXmlString.trimStart();

  if (!fullSoapXmlString) {
    ctx.status = 500
    ctx.body = 'Corpo da requisição XML vazio.'
    return
  }

  try {
    const parsedSoapObject = await parseStringPromise(fullSoapXmlString, { explicitArray: false });

    if (!parsedSoapObject['soap:Envelope']['soap:Body']['consStatServ']) {
      console.warn("Could not find 'consStatServ' element in SOAP body.");
      ctx.status = 400
      ctx.body = "Formato da requisição SOAP inválido: elemento consStatServ não encontrado."
      return
    }

    const consStatServObject = parsedSoapObject['soap:Envelope']['soap:Body']['consStatServ'];
    const builder = new Builder({ headless: true });
    const consStatServXmlString = builder.buildObject({ 'consStatServ': consStatServObject });

    const xsdSchemasPath = path.join(__dirname, '..', '..', 'xsd');


    process.chdir(xsdSchemasPath)

    const xsdString = fs.readFileSync('consStatServ_v4.00.xsd', 'utf8')

    console.log(consStatServXmlString)

    let xmlDoc = libxmljs.parseXmlString(consStatServXmlString)
    let xsdDoc = libxmljs.parseXmlString(xsdString)

    xmlDoc.validate(xsdDoc)

    // const xmlObject = await parseStringPromise(consStatServXmlString)

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

export default nfeStatusServico
