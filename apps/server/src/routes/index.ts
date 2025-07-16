import Router from "@koa/router";
import { companyRoute } from "./company/company";
import { certificateRoute } from "./company/certificate";
import { productRoute } from "./product";
import { saleRoute } from "./sale";
import { pixWebhookRoute } from "./webhook";

const router = new Router();

router.post('/company', companyRoute)
router.post('/certificate/:id', certificateRoute)

router.post('/product', productRoute)
router.post('/sale', saleRoute)
router.post('/webhook', pixWebhookRoute)

router.get('/health', ctx => { ctx.body = 'It\'s ok here!' })

export default router
