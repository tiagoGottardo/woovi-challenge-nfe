import { ParameterizedContext } from "koa";
import Sale from "../schemas/Sale";
import { saleZodSchema } from "../zod/saleZodSchema";
import Product from "../schemas/Product";

const saleRoute = async (ctx: ParameterizedContext) => {
  const parseResult = saleZodSchema.safeParse(ctx.request.body)

  if (parseResult.error) {
    ctx.status = 400;
    ctx.body = {
      message: 'Product could not be registered.',
      errors: parseResult.error.issues.map(i => i.message)
    }

    return
  }

  const { companyId, ...rest } = ctx.request.body

  try {
    rest.items = await Promise.all(rest.items.map(async (item: any) => {
      const product = await Product.findOne(({ _id: item.productId }))

      if (!product) throw new Error(`Product not found.`)

      item.unitPrice = product.price
      item.totalPrice = product.price * item.quantity

      return item
    }))
  } catch ({ message }: any) {
    ctx.status = 400;
    ctx.body = { message }
    return
  }

  const totalAmount = rest.items.reduce((acc: any, item: any) => acc + item.totalPrice, 0)

  const sale = new Sale({
    companyId,
    items: rest.items,
    totalAmount
  })

  sale.save()

  ctx.status = 201
  ctx.body = { message: 'Sale registered successfully', sale }
}

export { saleRoute }
