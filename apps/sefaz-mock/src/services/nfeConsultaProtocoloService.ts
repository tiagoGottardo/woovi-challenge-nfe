const versao = "4.00";
const verAplic = "SVRS20230101";
const nfeServerUF = '41';
const ambiente = '1';

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
  cSitNFe?: string;
}

interface NFeConsultaNFInput {
  nfeDadosMsg: ConsSitNFeInput;
}

const nfeConsultaNF = (args: NFeConsultaNFInput): RetConsSitNFeOutput => {
  const result: RetConsSitNFeOutput = {
    versao,
    tpAmb: ambiente as '1' | '2',
    verAplic,
    cStat: "999",
    xMotivo: "Não inicializado",
    cUF: nfeServerUF,
    dhCons: new Date().toISOString()
  };

  if (!args || !args.nfeDadosMsg) {
    result.xMotivo = "Mensagem de entrada inválida";
    return result;
  }

  const { nfeDadosMsg } = args;

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

  if (!nfeDadosMsg.chNFe || nfeDadosMsg.chNFe.length !== 44 || !/^\d{44}$/.test(nfeDadosMsg.chNFe)) {
    result.cStat = '216'; // Rejeição: Chave de Acesso inválida (formato ou tamanho)
    result.xMotivo = 'Chave de Acesso inválida (formato ou tamanho)';
    return result;
  }

  if (nfeDadosMsg.chNFe.endsWith('000000000001')) {
    result.cStat = '100';
    result.xMotivo = 'Autorizado o uso da NF-e';
    result.protNFe = {
      infProt: {
        tpAmb: ambiente as '1' | '2',
        verAplic,
        chNFe: nfeDadosMsg.chNFe,
        dhRecbto: new Date().toISOString(),
        nProt: `1${nfeDadosMsg.cUF}${nfeDadosMsg.chNFe.substring(2, 6)}${Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0')}`,
        digVal: 'ABCDEF1234567890',
        cStat: '100',
        xMotivo: 'Autorizado o uso da NF-e'
      }
    };
    return result;
  }

  if (nfeDadosMsg.chNFe.endsWith('000000000002')) {
    result.cStat = '101';
    result.xMotivo = 'Cancelamento de NF-e homologado';
    result.protNFe = {
      infProt: {
        tpAmb: ambiente as '1' | '2',
        verAplic,
        chNFe: nfeDadosMsg.chNFe,
        dhRecbto: new Date().toISOString(),
        nProt: `1${nfeDadosMsg.cUF}${nfeDadosMsg.chNFe.substring(2, 6)}${Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0')}`,
        digVal: 'ABCDEF1234567890',
        cStat: '101',
        xMotivo: 'Cancelamento de NF-e homologado'
      }
    };
    result.procEventoNFe = [{
      infEvento: {
        tpAmb: ambiente as '1' | '2',
        verAplic,
        cOrgao: nfeServerUF,
        cStat: '135',
        xMotivo: 'Evento registrado e vinculado à NF-e',
        chNFe: nfeDadosMsg.chNFe,
        tpEvento: '110111',
        nSeqEvento: '1',
        dhRegEvento: new Date().toISOString(),
        nProt: `1${nfeDadosMsg.cUF}${nfeDadosMsg.chNFe.substring(2, 6)}C${Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0')}` // Event Protocol
      }
    }];
    return result;
  }

  if (nfeDadosMsg.chNFe.endsWith('000000000003')) {
    result.cStat = '301';
    result.xMotivo = 'Uso Denegado: Irregularidade fiscal do emitente';
    return result;
  }

  if (nfeDadosMsg.chNFe.endsWith('000000000004')) {
    result.cStat = '151';
    result.xMotivo = 'Lote de Inutilização Processado';
    return result;
  }

  result.cStat = '217';
  result.xMotivo = 'NF-e nao consta na base de dados da SEFAZ';
  return result;
};

const nfeConsultaProtocoloService = {
  NFeConsultaProtocoloService: {
    NFeConsultaProtocoloPort: {
      nfeConsultaNF
    }
  }
};

export {
  nfeConsultaProtocoloService
};
