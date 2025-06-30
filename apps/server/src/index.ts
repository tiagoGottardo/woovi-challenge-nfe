import * as soap from 'soap';
import path from 'path';
import * as https from 'https';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import { readFileSync } from 'fs';

let agent: https.Agent;

const key = readFileSync(path.resolve(__dirname, '../certs/client.key'));
const cert = readFileSync(path.resolve(__dirname, '../certs/client.crt'));
const ca = readFileSync(path.resolve(__dirname, '../certs/ca.crt'));

try {
  agent = new https.Agent({
    key, cert, ca,
    rejectUnauthorized: false,
  });

} catch (error) {
  console.error('Failed to load client certificates or create HTTPS agent:', error);
  process.exit(1);
}

const args = {
  tpAmb: '1',
  cUF: '41',
  xServ: 'STATUS'
};

const soapOptions = {
  overrideRootElement: {
    namespace: 'nfe',
    xmlnsAttributes: [{
      name: 'xmlns',
      value: 'http://www.portalfiscal.inf.br/nfe'
    }],
  },
  ignoredNamespaces: {
    namespaces: ['nfe']
  },
  agent,
};

async function sendSoapRequest() {
  const url = 'https://localhost:3000/ws/nfestatusservico4?wsdl';

  try {
    const client = await soap.createClientAsync(url, soapOptions);

    // client.setSecurity(new soap.WSSecurityCert(
    //   key,
    //   cert,
    //   CLIENT_PFX_PASSWORD,
    // ));

    client.nfeStatusServicoNF(args, (err: any, result: any) => {
      if (err) {
        console.error('Erro ao chamar o método nfeStatusServicoNF:', err.message);
        if (err.response) {
          console.error('SOAP Response Status:', err.response.status);
        }
        if (err.cause) {
          console.error('Underlying Error Cause:', err.cause);
        }
        console.error('Raw Last Request XML (if available):', client.lastRequest);
        return;
      }

      console.log('NFeStatusServico response:', result);
    });

  } catch (error: any) {
    console.error(error.cause);
  }
}

sendSoapRequest();
