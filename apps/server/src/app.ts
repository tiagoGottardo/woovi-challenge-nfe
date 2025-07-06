import Koa from 'koa';
import { koaBody } from 'koa-body';
import router from './routes';

const app = new Koa();

app.use(koaBody());

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(router.routes())
app.use(router.allowedMethods())

export default app
