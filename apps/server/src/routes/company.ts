import { ParameterizedContext } from "koa"
import Company from "../models/Company"

export const companyRoute = async (ctx: ParameterizedContext) => {
  const requestBody = ctx.request.body

  const oneUser = await Company.findOne({ cnpj: requestBody.cnpj })
  if (oneUser) {
    ctx.status = 400
    ctx.body = {
      message: 'Company could not be registered.',
      errors: ["Already exists one company with this cnpj."]
    }

    return
  }

  const { _id: id } = await (new Company(requestBody)).save()

  ctx.status = 201
  ctx.body = {
    message: 'Company registered successfully',
    data: {
      id
    }
  }
}
