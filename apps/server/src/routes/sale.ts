import { ParameterizedContext } from "koa"
import Sale from "../models/Sale"
import Product from "../models/Product"
import Company from "../models/Company"
import { generateQrCode } from "../utils/nfe"

const saleRoute = async (ctx: ParameterizedContext) => {
  const { companyId, freightCost, buyerUF, pixKey, ...rest } = ctx.request.body

  const company = await Company.findOne({ _id: companyId })
  if (!company) {
    ctx.status = 400
    ctx.body = { message: 'Sale could not be registered.' }

    return
  }

  try {
    rest.items = await Promise.all(rest.items.map(async (item: any) => {
      const product = await Product.findOne(({ _id: item.productId }))

      if (!product) throw new Error(`Product not found.`)

      item.unitPrice = product.price
      item.totalPrice = product.price * item.quantity

      return item
    }))
  } catch ({ message }: any) {
    ctx.status = 400
    ctx.body = { message }
    return
  }

  const totalAmount = rest.items.reduce((acc: any, item: any) => acc + item.totalPrice, 0)

  const { _id: id } = await (new Sale({
    companyId,
    buyerUF,
    freightCost,
    items: rest.items,
    totalAmount,
    pixKey
  })).save()

  const pixRequest = await generateQrCode(pixKey, totalAmount, company.address.city, company.name)

  ctx.status = 200
  ctx.body = {
    message: 'Sale registered successfully',
    data: {
      sale: { id },
      pixRequest
    }
  }
}

export { saleRoute }
