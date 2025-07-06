import { sendSoapRequest } from './client';

interface ConsSitNFeInput {
  tpAmb: '1' | '2';
  xServ: 'CONSULTAR';
  chNFe: string;
  cUF: string;
}

interface RetConsSitNFeOutput {
  versao: string;
  tpAmb: '1' | '2';
  verAplic: string;
  cStat: string;
  xMotivo: string;
  cUF: string;
  dhCons: string;
  protNFe?: {
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
  };
  procEventoNFe?: Array<{
    infEvento: {
      tpAmb: '1' | '2';
      verAplic: string;
      cOrgao: string;
      cStat: string;
      xMotivo: string;
      chNFe: string;
      tpEvento: string;
      nSeqEvento: string;
      dhRegEvento: string;
      nProt: string;
    };
  }>;
}

interface NFeConsultaNFInput {
  nfeDadosMsg: ConsSitNFeInput;
}

const urlConsultaProtocolo = 'https://localhost:3000/ws/nfeconsultaprotocolo?wsdl';

const consultaProtocoloArgs: NFeConsultaNFInput = {
  nfeDadosMsg: {
    tpAmb: '1',
    xServ: 'CONSULTAR',
    chNFe: '41250612345678901234550010000000010000000001',
    cUF: '41',
  }
};

export const consultarNFeProtocolo = async () => {
  const client = await sendSoapRequest(urlConsultaProtocolo);
  const [result] = await client.nfeConsultaNFAsync(consultaProtocoloArgs) as [RetConsSitNFeOutput];

  console.log(result);
};
