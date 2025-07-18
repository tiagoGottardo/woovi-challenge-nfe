import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import * as https from 'https'
import * as soap from 'soap'

import { webServices } from "./services/"
import app from "./app"

const PORT = process.env.SEFAZ_PORT || 3000

const httpsOptions: https.ServerOptions = {
  requestCert: true,
  rejectUnauthorized: false,
};

const httpServer = https.createServer(httpsOptions, app.callback());

process.chdir(join(__dirname, '..', 'xsd'))

webServices.forEach(ws => {
  const xml = readFileSync(resolve(__dirname, `../wsdl/${ws.name}.wsdl`), 'utf8')

  soap.listen(httpServer, `/ws/${ws.name}`, ws.service, xml, (err, _) => {
    if (err) return console.log(err)
  });
})

httpServer.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`))
