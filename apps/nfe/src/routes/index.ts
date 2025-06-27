import Router from '@koa/router'
import nfeStatusService from '../services/NfeStatusService'
import send from 'koa-send'
import path from 'path'
import { ParameterizedContext } from 'koa'

const router = new Router()

const createWsdlFileService = (filename: string) => {
  const wsdlBaseDir = path.join(__dirname, '..', '..', 'wsdl');

  return async (ctx: ParameterizedContext) => {
    if (ctx.request.query.wsdl !== undefined) {
      try {
        await send(ctx, `${filename}.wsdl`, { root: wsdlBaseDir });
        console.log('WSDL file served successfully.');
      } catch (err: any) {
        console.error('Error serving WSDL file:', err);
        ctx.status = 500;
        ctx.body = 'Error loading WSDL file.';
      }
    }
  }
}

interface WebService {
  name: string
  service: (ctx: ParameterizedContext) => Promise<void>
}

const webServices: WebService[] = [
  { name: 'nfestatusservico4', service: nfeStatusService }
]

webServices.forEach(ws => {
  router.get(`/ws/${ws.name}`, createWsdlFileService(ws.name));
  router.post(`/ws/${ws.name}`, ws.service)
});

export default router
