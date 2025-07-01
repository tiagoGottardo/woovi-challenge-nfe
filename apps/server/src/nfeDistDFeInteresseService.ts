import { sendSoapRequest } from './client';

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

const urlDistDFe = 'https://localhost:3000/ws/nfedistdfeinteresse?wsdl';

// Example 1: Consult by Chave de Acesso
export const distDFeArgsChNFe: NFeDistDFeInteresseInput = {
  nfeDadosMsg: {
    tpAmb: '1',
    cUF: '41',
    CNPJ: '12345678000199', // Your CNPJ
    distDFeInt: {
      consProdDFe: {
        tpAmb: '1',
        chNFe: '41250612345678901234550010000000010000000001', // Example NF-e key
      },
    },
  },
};

// Example 2: Consult by specific NSU
export const distDFeArgsNSU: NFeDistDFeInteresseInput = {
  nfeDadosMsg: {
    tpAmb: '1',
    cUF: '41',
    CNPJ: '12345678000199',
    distDFeInt: {
      consNSU: {
        tpAmb: '1',
        nSU: '100', // Example NSU
      },
    },
  },
};

// Example 3: Consult from last known NSU (usually to get all new documents)
export const distDFeArgsUltNSU: NFeDistDFeInteresseInput = {
  nfeDadosMsg: {
    tpAmb: '1',
    cUF: '41',
    CNPJ: '12345678000199',
    distDFeInt: {
      consUltNSU: {
        tpAmb: '1',
        nSU: '12300', // Last NSU you processed
      },
    },
  },
};


export const consultarDistDFe = async (args: NFeDistDFeInteresseInput) => {
  const client = await sendSoapRequest(urlDistDFe);
  const [result] = await client.nfeDistDFeInteresseAsync(args) as [RetDistDFeIntOutput];

  console.log(result);
};

// consultarDistDFe(distDFeArgsChNFe);
// consultarDistDFe(distDFeArgsNSU);
// consultarDistDFe(distDFeArgsUltNSU);
