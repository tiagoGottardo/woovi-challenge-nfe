const versaoConsultaCad = "2.00";
const verAplic = "SVRS20230101";
const nfeServerUF = '41';
const ambiente = '1';

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

const consultaCadastro = (args: NFeConsultaCadastroInput): RetConsCadOutput => {
  const result: RetConsCadOutput = {
    versao: versaoConsultaCad,
    infCons: {
      tpAmb: ambiente as '1' | '2',
      verAplic,
      cStat: "999",
      xMotivo: "Não inicializado",
      UF: args?.nfeDadosMsg?.infCons?.UF || nfeServerUF,
      dhCons: new Date().toISOString(),
      cUF: args?.nfeDadosMsg?.infCons?.UF || nfeServerUF,
    },
  };

  if (!args?.nfeDadosMsg?.infCons) {
    result.infCons.xMotivo = "Mensagem de entrada inválida";
    return result;
  }

  const { infCons } = args.nfeDadosMsg;
  result.infCons.IE = infCons.IE;
  result.infCons.CNPJ = infCons.CNPJ;
  result.infCons.CPF = infCons.CPF;

  if (infCons.UF !== nfeServerUF) {
    result.infCons.cStat = '289';
    result.infCons.xMotivo = 'Código da UF informada diverge da UF solicitada';
    return result;
  }

  const hasIdentifier = infCons.IE || infCons.CNPJ || infCons.CPF;
  if (!hasIdentifier) {
    result.infCons.cStat = '203';
    result.infCons.xMotivo = 'CNPJ, CPF ou IE do contribuinte não informado';
    return result;
  }

  if (infCons.CNPJ === '12345678000199') {
    result.infCons.cStat = '111';
    result.infCons.xMotivo = 'Consulta Cadastro com sucesso';
    result.infCons.IE = '1234567890';

    result.infCad = [{
      CNPJ: infCons.CNPJ,
      IE: '1234567890',
      xNome: 'EMPRESA EXEMPLO LTDA',
      xFant: 'EXEMPLO BRASIL',
      xLgr: 'RUA FICTICIA',
      nro: '1234',
      xBairro: 'CENTRO',
      cMun: '4106902',
      xMun: 'CURITIBA',
      UF: nfeServerUF,
      CEP: '80000000',
      CRT: '1',
      IEAtu: '1234567890'
    }];
  } else if (infCons.IE === '9999999999') {
    result.infCons.cStat = '112';
    result.infCons.xMotivo = 'Contribuinte não identificado';
  } else if (infCons.CNPJ === '11111111000100') {
    result.infCons.cStat = '111';
    result.infCons.xMotivo = 'Consulta Cadastro com sucesso';
    result.infCons.IE = '9876543210';
    result.infCad = [{
      CNPJ: infCons.CNPJ,
      IE: '9876543210',
      xNome: 'EMPRESA INATIVA S.A.',
      UF: nfeServerUF,
    }];
  } else {
    result.infCons.cStat = '112';
    result.infCons.xMotivo = 'Contribuinte não identificado';
  }

  return result;
};

const nfeConsultaCadastroService = {
  NFeConsultaCadastroService: {
    NFeConsultaCadastroPort: {
      consultaCadastro
    }
  }
};

export {
  nfeConsultaCadastroService
};
