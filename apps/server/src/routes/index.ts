import Router from "@koa/router";
import { companyRoute } from "./company";
import { productRoute } from "./product";
import { saleRoute, pixWebhookRoute } from "./sale";

const router = new Router();

router.post('/company', companyRoute)
router.post('/product', productRoute)
router.post('/sale', saleRoute)
router.post('/pix', pixWebhookRoute)

router.get('/health', ctx => { ctx.body = 'It\'s ok here!' })

// router.post('/nfe', ctx => {
//   const { citySignId, rps, } = ctx.request.body

// })

export default router
