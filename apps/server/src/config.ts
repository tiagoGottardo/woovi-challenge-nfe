import path from 'path';
import * as https from 'https';
import { readFileSync } from 'fs';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const key = readFileSync(path.resolve(__dirname, '../certs/client.key'));
const cert = readFileSync(path.resolve(__dirname, '../certs/client.crt'));
const ca = readFileSync(path.resolve(__dirname, '../certs/ca.crt'));

const agent = new https.Agent({
  key, cert, ca,
  rejectUnauthorized: false,
});

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

export {
  soapOptions
}
