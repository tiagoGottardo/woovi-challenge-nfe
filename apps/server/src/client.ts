import * as soap from 'soap';

import { soapOptions } from './config';

export const sendSoapRequest = async (url: string, args: any) => {
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

      return result
    });

  } catch (error: any) {
    console.error(error.cause);
  }
}
