import { ParameterizedContext } from "koa"
import Company from "../../models/Company"
import { CompanyZodSchema } from "../../zod/companyZodSchema"

const companyRoute = async (ctx: ParameterizedContext) => {
  const requestBody = ctx.request.body

  const parseResult = CompanyZodSchema.safeParse(requestBody)

  if (parseResult.error) {
    ctx.status = 400
    ctx.body = {
      message: 'Company could not be registered.',
      errors: parseResult.error.issues.map(i => i.message)
    }

    return
  }

  const oneUser = await Company.findOne({ cnpj: requestBody.cnpj })
  if (oneUser) {
    ctx.status = 400
    ctx.body = {
      message: 'Company could not be registered.',
      errors: ["Already exists one company with this cnpj."]
    }

    return
  }

  const company = new Company(requestBody)

  company.save()

  ctx.status = 201
  ctx.body = {
    message: 'Company registered successfully',
    data: company
  }
}

export { companyRoute }
