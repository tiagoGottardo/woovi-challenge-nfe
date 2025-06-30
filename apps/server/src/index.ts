import { sendSoapRequest } from './client';

const args = {
  tpAmb: '1',
  cUF: '41',
  xServ: 'STATUS'
};

const url = 'https://localhost:3000/ws/nfestatusservico4?wsdl';

sendSoapRequest(url, args);
