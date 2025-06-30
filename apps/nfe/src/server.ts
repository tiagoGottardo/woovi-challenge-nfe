import path from "path"
import fs, { readFileSync } from 'fs'
import * as https from 'https'
import * as soap from 'soap'

import { webServices } from "./services/"
import app from "./app"

const PORT = 3000

const key = readFileSync(path.resolve(__dirname, '../certs/server.key'));
const cert = readFileSync(path.resolve(__dirname, '../certs/server.crt'));
const ca = readFileSync(path.resolve(__dirname, '../certs/ca.crt'));

const httpsOptions: https.ServerOptions = {
  key, cert, ca,
  requestCert: true,
  rejectUnauthorized: false,
};

const httpServer = https.createServer(httpsOptions, app.callback());

process.chdir(path.join(__dirname, '..', 'xsd'))

webServices.forEach(ws => {
  const xml = fs.readFileSync(path.resolve(__dirname, `../wsdl/${ws.name}.wsdl`), 'utf8');

  soap.listen(httpServer, `/ws/${ws.name}`, ws.service, xml, (err, _) => {
    if (err) return console.log(err)
  });
})

httpServer.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`))
