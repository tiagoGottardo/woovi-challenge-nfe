import { ParameterizedContext } from "koa"
import Product from "../models/Product"
import Company from "../models/Company"
import { getIbptTax } from "../utils/nfe"

const productRoute = async (ctx: ParameterizedContext) => {
  const requestBody = ctx.request.body

  const company = await Company.findOne({ _id: requestBody.companyId })
  if (!company) {
    ctx.status = 400
    ctx.body = {
      message: 'Product could not be registered.',
      errors: ["Company not found!"]
    }

    return
  }

  requestBody.ibptTax = await getIbptTax(requestBody.ncm, company.address.uf)
  if (!requestBody.ibptTax) {
    ctx.status = 400
    ctx.body = { message: "Product NCM not valid!" }
    return
  }

  const { _id: id } = await (new Product(requestBody)).save()

  ctx.status = 201
  ctx.body = {
    message: 'Product registered successfully',
    data: {
      id
    }
  }
}


export { productRoute }
