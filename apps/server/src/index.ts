import * as soap from 'soap';

const args = {
  tpAmb: '1',
  cUF: '41',
  xServ: 'STATUS'
};

const options = {
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
};

async function sendSoapRequest() {
  const url = 'http://localhost:3000/ws/nfestatusservico4?wsdl';

  const client = await soap.createClientAsync(url, options)

  client.nfeStatusServicoNF(args, (err: any, result: any) => {
    if (err) {
      console.error('Erro ao chamar o método nfeStatusServicoNF', err.response.status);
      return;
    }

    console.log('NFeStatusServico response:', result);
  });

}

sendSoapRequest();
