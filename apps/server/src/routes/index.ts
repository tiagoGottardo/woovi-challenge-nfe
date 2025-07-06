import Router from "@koa/router";
import { companyRoute } from "./company";
import { productRoute } from "./product";

const router = new Router();

router.post('/company', companyRoute)
router.post('/product', productRoute)

router.get('/health', ctx => { ctx.body = 'It\'s ok here!' })

// router.post('/nfe', ctx => {
//   const { citySignId, rps, } = ctx.request.body

// })

export default router
