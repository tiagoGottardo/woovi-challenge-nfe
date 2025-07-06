import { sendSoapRequest } from './client'

interface InutNFeInput {
  infInut: {
    Id: string;
    tpAmb: '1' | '2';
    cUF: string;
    ano: string;
    CNPJ: string;
    mod: string;
    serie: string;
    nNFIni: string;
    nNFFin: string;
    xJust: string;
  };
}

interface RetInutNFeOutput {
  versao: string;
  infInut: {
    tpAmb: '1' | '2';
    verAplic: string;
    cStat: string;
    xMotivo: string;
    cUF: string;
    dhRecbto: string;
    nProt?: string;
    ano?: string;
    CNPJ?: string;
    mod?: string;
    serie?: string;
    nNFIni?: string;
    nNFFin?: string;
  };
}

interface NFeInutilizacaoNFInput {
  nfeDadosMsg: InutNFeInput;
}

const urlInutilizacao = 'https://localhost:3000/ws/nfeinutilizacao?wsdl';

const inutilizacaoArgs: NFeInutilizacaoNFInput = {
  nfeDadosMsg: {
    infInut: {
      Id: `ID41${new Date().getFullYear()}1234567890123455001000000001000000005`,
      tpAmb: '1',
      cUF: '41',
      ano: new Date().getFullYear().toString(),
      CNPJ: '12345678901234',
      mod: '55',
      serie: '1',
      nNFIni: '1',
      nNFFin: '5',
      xJust: 'Numeracao inutilizada por erro de digitacao na emissao'
    }
  }
};

export const inutilizarNFe = async () => {
  const client = await sendSoapRequest(urlInutilizacao);
  const [result] = await client.nfelnutilizacaoNFAsync(inutilizacaoArgs) as [RetInutNFeOutput];

  console.log(result);
}
