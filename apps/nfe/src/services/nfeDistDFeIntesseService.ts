const versaoDistDFe = "1.01";
const verAplic = "SVRS20230101";
const nfeServerUF = '41';
const ambiente = '1';

interface ConsProdDFe {
  tpAmb: '1' | '2';
  chNFe: string;
}

interface ConsNSU {
  tpAmb: '1' | '2';
  nSU: string;
}

interface ConsUltNSU {
  tpAmb: '1' | '2';
  nSU: string;
}

interface DistDFeIntInput {
  tpAmb: '1' | '2';
  cUF: string;
  CNPJ?: string;
  CPF?: string;
  distDFeInt?: {
    consProdDFe?: ConsProdDFe;
    consNSU?: ConsNSU;
    consUltNSU?: ConsUltNSU;
  };
}

interface RetDistDFeIntOutput {
  versao: string;
  tpAmb: '1' | '2';
  verAplic: string;
  cStat: string;
  xMotivo: string;
  cUF: string;
  dhResp: string;
  ultNSU?: string;
  maxNSU?: string;
  loteDistDFeInt?: {
    indDFe: string;
    docZip?: Array<{
      schema: string;
      value: string;
      NSU: string;
      chNFe?: string;
    }>;
  };
}

interface NFeDistDFeInteresseInput {
  nfeDadosMsg: DistDFeIntInput;
}

const nfeDistDFeInteresse = (args: NFeDistDFeInteresseInput): RetDistDFeIntOutput => {
  const result: RetDistDFeIntOutput = {
    versao: versaoDistDFe,
    tpAmb: ambiente as '1' | '2',
    verAplic,
    cStat: "999",
    xMotivo: "Não inicializado",
    cUF: nfeServerUF,
    dhResp: new Date().toISOString(),
  };

  if (!args?.nfeDadosMsg) {
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

  const { distDFeInt } = nfeDadosMsg;

  if (distDFeInt?.consProdDFe) {
    const { consProdDFe } = distDFeInt;
    if (!consProdDFe.chNFe || consProdDFe.chNFe.length !== 44) {
      result.cStat = '216';
      result.xMotivo = 'Chave de Acesso inválida';
      return result;
    }
    if (consProdDFe.chNFe.endsWith('000000000001')) {
      result.cStat = '138';
      result.xMotivo = 'Documento localizado para a chave informada';
      result.ultNSU = '100000000001';
      result.maxNSU = '100000000001';
      result.loteDistDFeInt = {
        indDFe: '1',
        docZip: [{
          schema: 'resNFe_v1.01.xsd',
          NSU: '100000000001',
          chNFe: consProdDFe.chNFe,
          value: Buffer.from('<resNFe>...</resNFe>').toString('base64'),
        }],
      };
    } else {
      result.cStat = '137';
      result.xMotivo = 'Nenhum documento localizado para a chave informada';
    }
  } else if (distDFeInt?.consNSU) {
    const { consNSU } = distDFeInt;
    if (!consNSU.nSU || !/^\d+$/.test(consNSU.nSU)) {
      result.cStat = '215';
      result.xMotivo = 'NSU inválido';
      return result;
    }

    if (consNSU.nSU === '100') {
      result.cStat = '138';
      result.xMotivo = 'Documentos localizados';
      result.ultNSU = '100';
      result.maxNSU = '105';
      result.loteDistDFeInt = {
        indDFe: '0',
        docZip: [
          { schema: 'resNFe_v1.01.xsd', NSU: '100', chNFe: '412506...', value: Buffer.from('<resNFe>...</resNFe>').toString('base64') },
          { schema: 'resEvento_v1.01.xsd', NSU: '101', chNFe: '412506...', value: Buffer.from('<resEvento>...</resEvento>').toString('base64') },
        ],
      };
    } else {
      result.cStat = '137';
      result.xMotivo = 'Nenhum documento localizado para o NSU informado';
    }
  } else if (distDFeInt?.consUltNSU) {
    // const { consUltNSU } = distDFeInt;
    result.cStat = '138';
    result.xMotivo = 'Consulta dos últimos documentos para o NSU informado';
    result.ultNSU = '12345';
    result.maxNSU = '54321';
    result.loteDistDFeInt = {
      indDFe: '1',
      docZip: [
        { schema: 'resNFe_v1.01.xsd', NSU: '12344', chNFe: '412506...', value: Buffer.from('<resNFe>...</resNFe>').toString('base64') },
        { schema: 'resNFe_v1.01.xsd', NSU: '12345', chNFe: '412506...', value: Buffer.from('<resNFe>...</resNFe>').toString('base64') },
      ],
    };
  } else {
    result.cStat = '214';
    result.xMotivo = 'Tipo de consulta DFe não especificado ou inválido';
  }

  return result;
};

const nfeDistribuicaoDFeService = {
  NFeDistribuicaoDFeService: {
    NFeDistribuicaoDFePort: {
      nfeDistDFeInteresse
    }
  }
};

export {
  nfeDistribuicaoDFeService
};
