import Router from '@koa/router'

import nfeStatusServico from '../services/NfeStatusServico'

const router = new Router()

router.post('/soap', nfeStatusServico)

export default router
