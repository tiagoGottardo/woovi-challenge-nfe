import { ParameterizedContext } from "koa"
import Product from "../models/Product"
import { ProductZodSchema } from "../zod/productZodSchema"
import Company from "../models/Company"
import { getIbptTax } from "../utils/nfe"

const productRoute = async (ctx: ParameterizedContext) => {
  const reqBody = ctx.request.body
  const { error } = ProductZodSchema.safeParse(reqBody)
  if (error) {
    ctx.status = 400
    ctx.body = {
      message: 'Product could not be registered.',
      errors: error.issues.map(i => i.message)
    }

    return
  }

  const company = await Company.findOne({ _id: reqBody.companyId })
  if (!company) {
    ctx.status = 400
    ctx.body = {
      message: 'Product could not be registered.',
      errors: ["Company not found!"]
    }

    return
  }

  reqBody.ibptTax = await getIbptTax(reqBody.ncm, company.address.uf)
  if (!reqBody.ibptTax) {
    ctx.status = 400
    ctx.body = { message: "Product NCM not valid!" }
    return
  }

  (new Product(reqBody)).save()

  ctx.status = 201
  ctx.body = {
    message: 'Product registered successfully',
    product: reqBody
  }
}


export { productRoute }
