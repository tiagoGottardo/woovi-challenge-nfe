const versao = "4.00";
const verAplic = "SVRS20230101";
const nfeServerUF = '41';
const ambiente = '1';

interface EnviNFeInput {
  idLote: string;
  indSinc: '0' | '1';
  NFe: any[];
}

interface RetEnviNFeOutput {
  versao: string;
  tpAmb: '1' | '2';
  verAplic: string;
  cStat: string;
  xMotivo: string;
  cUF: string;
  dhRecbto: string;
  infRec?: {
    nRec: string;
    dhRecbto: string;
    tMed: string;
  };
  protNFe?: any[];
}

interface NFeAutorizacaoLoteInput {
  nfeDadosMsg: EnviNFeInput;
}

const nfeAutorizacaoLote = (args: NFeAutorizacaoLoteInput): RetEnviNFeOutput => {
  const result: RetEnviNFeOutput = {
    cStat: "999",
    xMotivo: "Não inicializado",
    versao,
    verAplic,
    tpAmb: ambiente as '1' | '2',
    cUF: nfeServerUF,
    dhRecbto: new Date().toISOString()
  };

  if (!args || !args.nfeDadosMsg) {
    result.xMotivo = "Mensagem de entrada inválida";
    return result;
  }

  const { nfeDadosMsg } = args;

  if (nfeDadosMsg.idLote === undefined || nfeDadosMsg.idLote === null || nfeDadosMsg.idLote === "") {
    result.cStat = '214';
    result.xMotivo = 'Lote não informado';
    return result;
  }

  if (nfeDadosMsg.idLote.length > 60) {
    result.cStat = '214';
    result.xMotivo = 'Tamanho do Lote inválido';
    return result;
  }

  result.cStat = '103';
  result.xMotivo = 'Lote recebido com sucesso';
  result.infRec = {
    nRec: `411234567890123${nfeDadosMsg.idLote.substring(0, 15)}`,
    dhRecbto: new Date().toISOString(),
    tMed: '1'
  };

  return result;
};

const nfeAutorizacaoService = {
  NFeAutorizacaoService: {
    NFeAutorizacaoPort: {
      nfeAutorizacaoLote
    }
  }
};

export {
  nfeAutorizacaoService
};
