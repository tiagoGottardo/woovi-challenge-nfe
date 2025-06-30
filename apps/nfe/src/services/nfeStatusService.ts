const nfeStatusServicoNF = (args: any) => {
  console.log('Received nfeStatusServicoNF request:');
  console.log('Arguments:', JSON.stringify(args, null, 2));

  const consStatServ = args.nfeDadosMsg;

  let cStat = '107';
  let xMotivo = 'Servico em Operacao';
  let dhRetorno = new Date().toISOString().slice(0, 19) + '-03:00';

  if (consStatServ) {
    console.log('tpAmb:', consStatServ.tpAmb);
    console.log('cUF:', consStatServ.cUF);
    console.log('xServ:', consStatServ.xServ);
    console.log('versao:', consStatServ.versao);

    if (consStatServ.tpAmb === '2') {
      cStat = '100';
      xMotivo = 'Autorizado o uso da NF-e';
    }
  }

  const result = {
    nfeResultMsg: {
      cStat: cStat,
      xMotivo: xMotivo,
      dhRetorno: dhRetorno
    }
  }

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
