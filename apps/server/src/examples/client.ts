import * as soap from 'soap';
import { soapOptions } from '../config';

export const sendSoapRequest = async (url: string): Promise<any> => {
  try {
    return await soap.createClientAsync(url, soapOptions);

  } catch (error: any) {
    console.error('Erro ao enviar requisição SOAP:', error);
  }
}
