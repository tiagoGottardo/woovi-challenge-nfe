interface EnviNFeInput {
  idLote: string;
  indSinc: '0' | '1';
  NFe: any[];
}

export interface RetEnviNFeOutput {
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

export interface NFeAutorizacaoLoteInput {
  nfeDadosMsg: EnviNFeInput;
}

interface ConsCadInput {
  infCons: {
    xServ: 'CONSULTAR';
    UF: string;
    IE?: string;
    CNPJ?: string;
    CPF?: string;
  };
}

interface CadEmiOutput {
  IE?: string;
  CNPJ?: string;
  CPF?: string;
  xNome: string;
  xFant?: string;
  xLgr?: string;
  nro?: string;
  xCpl?: string;
  xBairro?: string;
  cMun?: string;
  xMun?: string;
  UF: string;
  CEP?: string;
  cPais?: string;
  xPais?: string;
  fone?: string;
  IEAtu?: string;
  CNAE?: string;
  CRT?: string;
}

export interface RetConsCadOutput {
  versao: string;
  infCons: {
    tpAmb: '1' | '2';
    verAplic: string;
    cStat: string;
    xMotivo: string;
    UF: string;
    IE?: string;
    CNPJ?: string;
    CPF?: string;
    dhCons: string;
    cUF?: string;
  };
  infCad?: CadEmiOutput[];
}

export interface NFeConsultaCadastroInput {
  nfeDadosMsg: ConsCadInput;
}

export interface ConsSitNFeInput {
  tpAmb: '1' | '2';
  xServ: 'CONSULTAR';
  chNFe: string;
  cUF: string;
}

export interface RetConsSitNFeOutput {
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

export interface NFeConsultaNFInput {
  nfeDadosMsg: ConsSitNFeInput;
}

export interface ConsProdDFe {
  tpAmb: '1' | '2';
  chNFe: string;
}

export interface ConsNSU {
  tpAmb: '1' | '2';
  nSU: string;
}

export interface ConsUltNSU {
  tpAmb: '1' | '2';
  nSU: string;
}

export interface DistDFeIntInput {
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

export interface RetDistDFeIntOutput {
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

export interface NFeDistDFeInteresseInput {
  nfeDadosMsg: DistDFeIntInput;
}

export interface InutNFeInput {
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

export interface RetInutNFeOutput {
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

export interface NFeInutilizacaoNFInput {
  nfeDadosMsg: InutNFeInput;
}

export interface EventoInput {
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

export interface EnvEventoInput {
  idLote: string;
  verEvento: string;
  evento: EventoInput[];
}

export interface RetEventoOutput {
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

export interface RetEnvEventoOutput {
  versao: string;
  tpAmb: '1' | '2';
  verAplic: string;
  cStat: string;
  xMotivo: string;
  cUF: string;
  retEvento?: RetEventoOutput[];
}

export interface NFeRecepcaoEventoInput {
  nfeDadosMsg: EnvEventoInput;
}

export interface ConsReciNFeInput {
  tpAmb: '1' | '2';
  nRec: string;
  cUF: string;
}

export interface RetConsReciNFeOutput {
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

export interface NFeRetAutorizacaoInput {
  nfeDadosMsg: ConsReciNFeInput;
}

export interface NFeStatusServicoOutput {
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

export interface NFeStatusServicoInput {
  cUF: string;
  tpAmb: '1' | '2';
  xServ: 'STATUS';
}
