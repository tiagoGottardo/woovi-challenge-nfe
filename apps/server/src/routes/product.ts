import { ParameterizedContext } from "koa";
import Product from "../schemas/Product";
import { ProductZodSchema } from "../zod/productZodSchema";

const productRoute = async (ctx: ParameterizedContext) => {
  const requestBody = ctx.request.body;

  const parseResult = ProductZodSchema.safeParse(requestBody)

  if (parseResult.error) {
    ctx.status = 400;
    ctx.body = {
      message: 'Product could not be registered.',
      errors: parseResult.error.issues.map(i => i.message)
    }

    return
  }

  const product = await Product.findOne({ sku: requestBody.sku });
  if (product) {
    ctx.status = 400;
    ctx.body = {
      message: 'Product could not be registered.',
      errors: ["Already exists one product with this sku."]
    }

    return
  }

  (new Product(requestBody)).save()

  ctx.status = 201;
  ctx.body = {
    message: 'Product registered successfully',
    product: requestBody
  }
}

export { productRoute }
