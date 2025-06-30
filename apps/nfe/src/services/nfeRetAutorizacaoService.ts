const versao = "4.00";
const verAplic = "SVRS20230101";
const nfeServerUF = '41';
const ambiente = '1';

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

const nfeRetAutorizacao = (args: NFeRetAutorizacaoInput): RetConsReciNFeOutput => {
  const result: RetConsReciNFeOutput = {
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

  if (!nfeDadosMsg.nRec) {
    result.cStat = '215';
    result.xMotivo = 'Número do recibo não informado';
    return result;
  }

  if (nfeDadosMsg.tpAmb !== ambiente) {
    result.cStat = '252';
    result.xMotivo = 'Ambiente informado diverge do Ambiente de recebimento';
    return result;
  }

  if (nfeDadosMsg.cUF !== nfeServerUF) {
    result.cStat = '289';
    result.xMotivo = 'Código da UF informada diverge da UF solicitada';
    return result;
  }


  if (nfeDadosMsg.nRec.endsWith('001')) {
    result.cStat = '105';
    result.xMotivo = 'Lote em processamento';
    result.dhRecbto = new Date().toISOString();
    return result;
  }

  if (nfeDadosMsg.nRec.endsWith('002')) {
    result.cStat = '104';
    result.xMotivo = 'Lote processado';
    result.dhRecbto = new Date().toISOString();
    result.protNFe = [
      {
        infProt: {
          tpAmb: ambiente as '1' | '2',
          verAplic,
          chNFe: `4125061234567890123455001000000001123456789${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          dhRecbto: new Date().toISOString(),
          nProt: `141${new Date().getFullYear()}12345678901`,
          digVal: 'ABCDEF1234567890',
          cStat: '100',
          xMotivo: 'Autorizado o uso da NF-e'
        }
      },
    ];
    return result;
  }

  result.cStat = '216';
  result.xMotivo = 'Recibo inexistente ou inválido';
  return result;
};

const nfeRetAutorizacaoService = {
  NFeRetAutorizacaoService: {
    NFeRetAutorizacaoPort: {
      nfeRetAutorizacao
    }
  }
};

export {
  nfeRetAutorizacaoService
};
