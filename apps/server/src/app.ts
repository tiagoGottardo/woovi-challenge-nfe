import Koa from 'koa'
import { koaBody } from 'koa-body'
import router from './routes'
import path from 'path'
import { CompanyZodSchema } from './zod/companyZodSchema'
import { ProductZodSchema } from './zod/productZodSchema'
import { SaleZodSchema } from './zod/saleZodSchema'
import z from 'zod'

const app = new Koa()

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 50 * 1024 * 1024,
    uploadDir: path.join(__dirname, '..', 'uploads'),
    keepExtensions: true
  }
}))


app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(async (ctx, next) => {
  const zodSchemas: { [key: string]: z.ZodType } = {
    '/company': CompanyZodSchema,
    '/product': ProductZodSchema,
    '/sale': SaleZodSchema
  }

  if (zodSchemas[ctx.path]) {
    const parseResult = zodSchemas[ctx.path].safeParse(ctx.request.body)

    if (parseResult.error) {
      ctx.status = 400
      ctx.body = {
        message: `Wrong request for ${ctx.path}.`,
        errors: parseResult.error.issues.map(i => i.message)
      }

      return
    }
  }

  await next();
});

app.use(router.routes())
app.use(router.allowedMethods())

export default app
