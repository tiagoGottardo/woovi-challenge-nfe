import { sendSoapRequest } from './client';

interface EventoInput {
  infEvento: {
    Id: string;
    cOrgao: string;
    tpAmb: '1' | '2';
    CNPJ?: string;
    CPF?: string;
    chNFe: string;
    dhEvento: string;
    tpEvento: string;
    nSeqEvento: string;
    verEvento: string;
    detEvento: any;
  };
  Signature: any;
}

interface EnvEventoInput {
  idLote: string;
  verEvento: string;
  evento: EventoInput[];
}

interface RetEventoOutput {
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
    nProt?: string;
  };
}

interface RetEnvEventoOutput {
  versao: string;
  tpAmb: '1' | '2';
  verAplic: string;
  cStat: string;
  xMotivo: string;
  cUF: string;
  retEvento?: RetEventoOutput[];
}

interface NFeRecepcaoEventoInput {
  nfeDadosMsg: EnvEventoInput;
}

const urlRecepcaoEvento = 'https://localhost:3000/ws/nferecepcaoevento?wsdl';

const recepcaoEventoArgs: NFeRecepcaoEventoInput = {
  nfeDadosMsg: {
    idLote: '000000000000001',
    verEvento: '12342',
    evento: [
      {
        infEvento: {
          Id: `ID${'110111'}${new Date().getFullYear()}4125061234567890123455001000000001000000000101`,
          cOrgao: '41',
          tpAmb: '1',
          chNFe: '41250612345678901234550010000000010000000001',
          dhEvento: new Date().toISOString(),
          tpEvento: '110111',
          nSeqEvento: '1',
          verEvento: '12342',
          detEvento: {
            descEvento: "Cancelamento",
            nProt: "1412025123456789012345678901",
            xJust: "NFe emitida incorretamente, motivo cancelamento"
          }
        },
        Signature: {}
      },
    ],
  },
};

export const receberEventoNFe = async () => {
  const client = await sendSoapRequest(urlRecepcaoEvento);
  const [result] = await client.nfeRecepcaoEventoAsync(recepcaoEventoArgs) as [RetEnvEventoOutput];

  console.log(result);
};
