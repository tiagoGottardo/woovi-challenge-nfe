import { sendSoapRequest } from './client';

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

export interface NFeAutorizacaoLoteInput {
  nfeDadosMsg: EnviNFeInput;
}

const url = 'https://localhost:3000/ws/nfeautorizacao?wsdl';

const args: NFeAutorizacaoLoteInput = {
  nfeDadosMsg: {
    idLote: '000000000000001',
    indSinc: '1',
    NFe: [
      {
        infNFe: {
          ide: { cUF: '41', cNF: '12345678', natOp: 'VENDA', mod: '55', serie: '1', nNF: '1', dhEmi: '2025-06-30T10:00:00-03:00', tpNF: '1', idDest: '1', cMunFG: '4106902', tpImp: '1', tpEmis: '1', cDV: '0', tpAmb: '1', finNFe: '1', indFinal: '1', indPres: '1', procEmi: '0', verProc: 'SVRS20230101' },
          emit: { CNPJ: '99999999999999', xNome: 'SUA EMPRESA LTDA', xFant: 'SUA EMPRESA', enderEmit: { xLgr: 'RUA EXEMPLO', nro: '123', xBairro: 'CENTRO', cMun: '4106902', xMun: 'CURITIBA', UF: 'PR', CEP: '80000000', cPais: '1058', xPais: 'BRASIL', fone: '4133333333' }, IE: '9999999999', CRT: '1' },
          dest: { CNPJ: '88888888888888', xNome: 'CLIENTE LTDA', enderDest: { xLgr: 'AV EXEMPLO', nro: '456', xBairro: 'OUTRO BAIRRO', cMun: '4106902', xMun: 'CURITIBA', UF: 'PR', CEP: '80000000', cPais: '1058', xPais: 'BRASIL' }, indIEDest: '1', IE: '8888888888' },
          det: [{ nItem: '1', prod: { cProd: 'PROD001', cEAN: 'SEM GTIN', xProd: 'PRODUTO TESTE', NCM: '00000000', CFOP: '5102', uCom: 'UN', qCom: '1.0000', vUnCom: '10.00', vProd: '10.00', cEANTrib: 'SEM GTIN', uTrib: 'UN', qTrib: '1.0000', vUnTrib: '10.00', indTot: '1' }, imposto: { ICMS: { ICMS00: { orig: '0', CST: '00', modBC: '0', vBC: '10.00', pICMS: '18.00', vICMS: '1.80' } }, PIS: { PISNT: { CST: '07' } }, COFINS: { COFINSNT: { CST: '07' } } } }],
          total: { ICMSTot: { vBC: '10.00', vICMS: '1.80', vICMSDeson: '0.00', vFCP: '0.00', vBCST: '0.00', vST: '0.00', vFCPST: '0.00', vFCPSTRet: '0.00', vProd: '10.00', vFrete: '0.00', vSeg: '0.00', vDesc: '0.00', vII: '0.00', vIPI: '0.00', vIPIDevol: '0.00', vPIS: '0.00', vCOFINS: '0.00', vOutro: '0.00', vNF: '10.00', vTotTrib: '0.00' } },
          transp: { modFrete: '9' },
          pag: { detPag: [{ indPag: '0', tPag: '01', vPag: '10.00' }] },
          infAdic: { infCpl: 'Documento emitido por sistema de testes.' }
        },
        Signature: {}
      }
    ]
  }
};

export const nfe = async (url: string, args: NFeAutorizacaoLoteInput) => {
  const client = await sendSoapRequest(url);
  const [result] = await client.nfeAutorizacaoLoteAsync(args) as [RetEnviNFeOutput];

  return result
}
