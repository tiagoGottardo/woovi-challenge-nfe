const versao = "4.00";
const verAplic = "SVRS20230101";
const nfeServerUF = '41';
const ambiente = '1';

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
  Signature: any;
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

const nfelnutilizacaoNF = (args: NFeInutilizacaoNFInput): RetInutNFeOutput => {
  const result: RetInutNFeOutput = {
    infInut: {
      tpAmb: ambiente as '1' | '2',
      verAplic,
      cStat: "999",
      xMotivo: "Não inicializado",
      cUF: nfeServerUF,
      dhRecbto: new Date().toISOString()
    },
    versao
  };

  if (!args || !args.nfeDadosMsg || !args.nfeDadosMsg.infInut) {
    result.infInut.xMotivo = "Mensagem de entrada inválida";
    return result;
  }

  const { infInut } = args.nfeDadosMsg;

  result.infInut.ano = infInut.ano;
  result.infInut.CNPJ = infInut.CNPJ;
  result.infInut.mod = infInut.mod;
  result.infInut.serie = infInut.serie;
  result.infInut.nNFIni = infInut.nNFIni;
  result.infInut.nNFFin = infInut.nNFFin;

  if (infInut.tpAmb !== ambiente) {
    result.infInut.cStat = '252';
    result.infInut.xMotivo = 'Ambiente informado diverge do Ambiente de recebimento';
    return result;
  }

  if (infInut.cUF !== nfeServerUF) {
    result.infInut.cStat = '289';
    result.infInut.xMotivo = 'Código da UF informada diverge da UF solicitada';
    return result;
  }

  if (!infInut.CNPJ || infInut.CNPJ.length !== 14) {
    result.infInut.cStat = '207';
    result.infInut.xMotivo = 'CNPJ do emitente inválido';
    return result;
  }

  if (!infInut.xJust || infInut.xJust.length < 15 || infInut.xJust.length > 255) {
    result.infInut.cStat = '214';
    result.infInut.xMotivo = 'Justificativa da inutilização deve ter entre 15 e 255 caracteres';
    return result;
  }

  const nNFIni = parseInt(infInut.nNFIni);
  const nNFFin = parseInt(infInut.nNFFin);

  if (isNaN(nNFIni) || isNaN(nNFFin) || nNFIni <= 0 || nNFFin <= 0 || nNFIni > nNFFin) {
    result.infInut.cStat = '214';
    result.infInut.xMotivo = 'Número inicial ou final da NF-e inválido';
    return result;
  }

  if (infInut.serie === '999' && nNFIni === 1 && nNFFin === 5) {
    result.infInut.cStat = '206';
    result.infInut.xMotivo = 'Faixa de numeração já utilizada';
    return result;
  }

  result.infInut.cStat = '102';
  result.infInut.xMotivo = 'Inutilização de número homologado';
  result.infInut.nProt = `1${infInut.cUF}${infInut.ano}${infInut.CNPJ.substring(0, 10)}000${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  result.infInut.dhRecbto = new Date().toISOString();

  return result;
};

const nfeInutilizacaoService = {
  NFeInutilizacaoService: {
    NFeInutilizacaoPort: {
      nfelnutilizacaoNF
    }
  }
};

export {
  nfeInutilizacaoService
};
