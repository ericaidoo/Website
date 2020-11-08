
import Router from 'koa-router'

import publicRouter from './public.js'
import svRouter from'./sv.js'

const mainRouter = new Router()

const nestedRoutes = [publicRouter, svRouter]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

export default mainRouter
