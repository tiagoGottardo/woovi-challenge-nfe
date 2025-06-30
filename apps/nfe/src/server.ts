import path from "path"
import fs from 'fs'
import * as http from 'http'
import * as soap from 'soap'

import { webServices } from "./services/"

import app from "./app"

const PORT = 3000

const httpServer = http.createServer(app.callback());

process.chdir(path.join(__dirname, '..', 'xsd'))

webServices.forEach(ws => {
  const xml = fs.readFileSync(path.resolve(__dirname, `../wsdl/${ws.name}.wsdl`), 'utf8');

  soap.listen(httpServer, `/ws/${ws.name}`, ws.service, xml, (err, _) => {
    if (err) return console.log(err)
  });
})

httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
