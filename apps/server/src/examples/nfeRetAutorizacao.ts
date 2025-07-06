import { sendSoapRequest } from './client'

interface ConsReciNFeInput {
  tpAmb: '1' | '2';
  nRec: string;
  cUF: string;
}

interface RetConsReciNFeOutput {
  versao: string;
  tpAmb: '1' | '2';
  verAplic: string;
  cStat: string;
  xMotivo: string;
  cUF: string;
  dhRecbto: string;
  protNFe?: Array<{
    infProt: {
      tpAmb: '1' | '2';
      verAplic: string;
      chNFe: string;
      dhRecbto: string;
      nProt: string;
      digVal: string;
      cStat: string;
      xMotivo: string;
    };
  }>;
}

interface NFeRetAutorizacaoInput {
  nfeDadosMsg: ConsReciNFeInput;
}

const urlRetAutorizacao = 'https://localhost:3000/ws/nferetautorizacao?wsdl'

const retAutorizacaoArgs: NFeRetAutorizacaoInput = {
  nfeDadosMsg: {
    tpAmb: '1',
    nRec: '411234567890123000001',
    cUF: '41',
  }
};

export const consultaReciboNFe = async () => {
  const client = await sendSoapRequest(urlRetAutorizacao);
  const [result] = await client.nfeRetAutorizacaoAsync(retAutorizacaoArgs) as [RetConsReciNFeOutput];

  console.log(result)
}

