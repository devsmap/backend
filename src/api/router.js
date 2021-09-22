import { Router } from 'express'
import { Http } from '@status/codes'

import { categoriesRouter } from './modules/categories/routes.js'
// import { pinsRouter } from './modules/pins/routes.js'

const router = Router()

router.use(categoriesRouter)
//       .use(pinsRouter)

router.get('/', (req, res) =>
  res.status(Http.ImATeapot).json({
    healthy: true,
  }),
)

export { router }
