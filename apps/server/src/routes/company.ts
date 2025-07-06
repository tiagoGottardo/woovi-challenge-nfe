import { ParameterizedContext } from "koa";
import Company from "../schemas/Company";

const companyRoute = (ctx: ParameterizedContext) => {
  const { name, cnpj, address, city, state, zipCode } = ctx.request.body;

  if (!name || !cnpj || !address || !city || !state || !zipCode) {
    ctx.status = 400;
    ctx.body = { message: 'All fields are required: name, cnpj, address, city, state, zipCode' }
    return;
  }

  const newCompany = new Company({ name, cnpj, address, city, state, zipCode })
  newCompany.save()

  console.log('Registering company:', { name, cnpj, address, city, state, zipCode })

  ctx.status = 201;
  ctx.body = { message: 'Company registered successfully', company: { name, cnpj } }
}

export { companyRoute }
