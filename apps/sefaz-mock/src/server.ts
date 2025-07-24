import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import * as https from 'https'
import * as soap from 'soap'

import { webServices } from "./services/"
import app from "./app"

const HOST = process.env.SEFAZ_HOST || 'localhost'
const PORT = parseInt(process.env.SEFAZ_PORT || '3000')

console.table({ HOST, PORT })

const httpsOptions: https.ServerOptions = {
  key: readFileSync(resolve(__dirname, '../certs/key.pem')),
  cert: readFileSync(resolve(__dirname, '../certs/cert.pem')),
  requestCert: true,
  rejectUnauthorized: false,
};

const httpsServer = https.createServer(httpsOptions, app.callback());

process.chdir(join(__dirname, '..', 'xsd'))

webServices.forEach(ws => {
  const xml = readFileSync(resolve(__dirname, `../wsdl/${ws.name}.wsdl`), 'utf8')

  soap.listen(httpsServer, `/ws/${ws.name}`, ws.service, xml, (err, _) => {
    if (err) return console.log(err)
  });
})

httpsServer.listen(PORT, HOST, () => console.log(`Server running on https://${HOST}:${PORT}`))

httpsServer.on('error', e => console.error(e))
