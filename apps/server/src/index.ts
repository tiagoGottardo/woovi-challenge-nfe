import { sendSoapRequest } from './client';
// import { nfe } from './autorizacao';
// import { consultaReciboNFe } from './nfeRetAutorizacao';
// import { inutilizarNFe } from './nfeInutilizacao';
// import { consultarNFeProtocolo } from './nfeConsultaProtocolo';
// import { receberEventoNFe } from './nfeRecepcaoEvento';
// import { consultarCadastroNFe } from './nfeConsultaCadastro';
// import { consultarDistDFe, distDFeArgsChNFe } from './nfeDistDFeInteresseService';

const args = {
  tpAmb: '1',
  cUF: '41',
  xServ: 'STATUS'
};

const url = 'https://localhost:3000/ws/nfestatusservico4?wsdl';

interface NFeStatusServicoOutput {
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

interface NFeStatusServicoInput {
  cUF: string;
  tpAmb: '1' | '2';
  xServ: 'STATUS';
}

const statusServ = async () => {
  const client = await sendSoapRequest(url);
  const [result] = await client.nfeStatusServicoNFAsync(args as NFeStatusServicoInput) as [NFeStatusServicoOutput];

  console.log(result)
}

// statusServ()
// nfe()
// consultaReciboNFe()
// inutilizarNFe()
// consultarNFeProtocolo()
// receberEventoNFe()
// consultarCadastroNFe()

// consultarDistDFe(distDFeArgsChNFe);
// consultarDistDFe(distDFeArgsNSU);
// consultarDistDFe(distDFeArgsUltNSU);
