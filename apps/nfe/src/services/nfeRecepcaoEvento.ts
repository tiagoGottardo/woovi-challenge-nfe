const versaoEvento = "1.00";
const verAplic = "SVRS20230101";
const nfeServerUF = '41';
const ambiente = '1';

interface EventoInput {
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

interface EnvEventoInput {
  idLote: string;
  verEvento: string;
  evento: EventoInput[];
}

interface RetEventoOutput {
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

interface RetEnvEventoOutput {
  versao: string;
  tpAmb: '1' | '2';
  verAplic: string;
  cStat: string;
  xMotivo: string;
  cUF: string;
  retEvento?: RetEventoOutput[];
}

interface NFeRecepcaoEventoInput {
  nfeDadosMsg: EnvEventoInput;
}

const nfeRecepcaoEvento = (args: NFeRecepcaoEventoInput): RetEnvEventoOutput => {
  const result: RetEnvEventoOutput = {
    versao: versaoEvento,
    tpAmb: ambiente as '1' | '2',
    verAplic,
    cStat: "999",
    xMotivo: "Não inicializado",
    cUF: nfeServerUF,
  };

  if (!args?.nfeDadosMsg?.evento) {
    result.xMotivo = "Mensagem de entrada inválida ou sem eventos";
    return result;
  }

  const { nfeDadosMsg } = args;
  const eventos = Array.isArray(nfeDadosMsg.evento) ? nfeDadosMsg.evento : [nfeDadosMsg.evento];
  result.retEvento = [];

  for (const evento of eventos) {
    const retEvento: RetEventoOutput = {
      infEvento: {
        tpAmb: ambiente as '1' | '2',
        verAplic,
        cOrgao: nfeServerUF,
        cStat: "135",
        xMotivo: "Evento registrado e vinculado à NF-e",
        chNFe: evento.infEvento.chNFe,
        tpEvento: evento.infEvento.tpEvento,
        nSeqEvento: evento.infEvento.nSeqEvento,
        dhRegEvento: new Date().toISOString(),
      },
    };

    const validations = [
      {
        condition: evento.infEvento.tpAmb !== ambiente,
        code: '252',
        message: 'Ambiente informado diverge do Ambiente de recebimento'
      },
      {
        condition: evento.infEvento.cOrgao !== nfeServerUF,
        code: '289',
        message: 'Código da UF informada diverge da UF solicitada'
      },
      {
        condition: !evento.infEvento.chNFe || evento.infEvento.chNFe.length !== 44 || !/^\d{44}$/.test(evento.infEvento.chNFe),
        code: '216',
        message: 'Chave de Acesso da NF-e inválida (formato ou tamanho)'
      }
    ];

    let isValid = true;
    for (const validation of validations) {
      if (validation.condition) {
        retEvento.infEvento.cStat = validation.code;
        retEvento.infEvento.xMotivo = validation.message;
        isValid = false;
        break;
      }
    }

    if (isValid) {
      switch (evento.infEvento.tpEvento) {
        case '110111':
          if (evento.infEvento.nSeqEvento === '1') {
            retEvento.infEvento.nProt = `1${evento.infEvento.cOrgao}${evento.infEvento.chNFe.substring(2, 6)}C${Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0')}`;
          } else {
            retEvento.infEvento.cStat = '573';
            retEvento.infEvento.xMotivo = 'Já existe evento do tipo para NFe (duplicidade)';
          }
          break;
        case '110110':
          retEvento.infEvento.nProt = `1${evento.infEvento.cOrgao}${evento.infEvento.chNFe.substring(2, 6)}CC${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`;
          break;
        case '110140':
          retEvento.infEvento.nProt = `1${evento.infEvento.cOrgao}${evento.infEvento.chNFe.substring(2, 6)}EPEC${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`;
          break;
        default:
          retEvento.infEvento.cStat = '218';
          retEvento.infEvento.xMotivo = 'Tipo de evento não suportado ou erro na NF-e';
          break;
      }
    }
    result.retEvento.push(retEvento);
  }

  const allSuccess = result.retEvento.every(re => re.infEvento.cStat === '135');
  result.cStat = allSuccess ? '128' : '129';
  result.xMotivo = allSuccess ? 'Lote de Eventos Processado' : 'Lote de Eventos Processado com alguma inconsistência';

  return result;
};

const nfeRecepcaoEventoService = {
  NFeRecepcaoEventoService: {
    NFeRecepcaoEventoPort: {
      nfeRecepcaoEvento
    }
  }
};

export {
  nfeRecepcaoEventoService
};
