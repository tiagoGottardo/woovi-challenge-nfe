const versao = "4.00";
const verAplic = "SVRS20230101";
const nfeServerUF = '41';
const ambiente = '1';

interface NFeStatusServicoOutput {
  versao: string;
  tpAmb: '1' | '2';
  verAplic: string;
  cStat: '107' | '108' | '999' | string;
  xMotivo: string;
  cUF: string;
  dhRecbto: string;
  tMed?: string;
  xObs?: string;
}

interface NFeStatusServicoInput {
  cUF: string;
  tpAmb: '1' | '2';
  xServ: 'STATUS';
}

const nfeStatusServicoNF = (args: NFeStatusServicoInput): NFeStatusServicoOutput => {
  const result: NFeStatusServicoOutput = {
    cStat: "999",
    xMotivo: "Não inicializado",
    versao,
    verAplic,
    tpAmb: args.tpAmb,
    cUF: args.cUF,
    dhRecbto: new Date().toISOString()
  }

  if (!args) return result


  if (args.tpAmb !== ambiente) {
    result.cStat = '252';
    result.xMotivo = 'Ambiente informado diverge do Ambiente  de recebimento';
    return result
  }

  if (args.cUF !== nfeServerUF) {
    result.cStat = '289';
    result.xMotivo = 'Código da UF informada diverge da UF  solicitada';
    return result
  }

  result.cStat = '107';
  result.xMotivo = 'Servico em Operacao';

  return result
}

const nfeStatusService = {
  NFeStatusServicoService: {
    NFeStatusServicoPort: {
      nfeStatusServicoNF
    }
  }
};

export {
  nfeStatusService
}
