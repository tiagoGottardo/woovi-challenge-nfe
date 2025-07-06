import { sendSoapRequest } from './client';

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

interface RetConsCadOutput {
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

interface NFeConsultaCadastroInput {
  nfeDadosMsg: ConsCadInput;
}

const urlConsultaCadastro = 'https://localhost:3000/ws/nfeconsultacadastro?wsdl';

const consultaCadastroArgs: NFeConsultaCadastroInput = {
  nfeDadosMsg: {
    infCons: {
      xServ: 'CONSULTAR',
      UF: '41',
      CNPJ: '12345678000199',
      // IE: '1234567890', // Or specify IE
      // CPF: '12345678900' // Or specify CPF
    }
  }
};

export const consultarCadastroNFe = async () => {
  const client = await sendSoapRequest(urlConsultaCadastro);
  const [result] = await client.consultaCadastroAsync(consultaCadastroArgs) as [RetConsCadOutput];

  console.log(result);
}
