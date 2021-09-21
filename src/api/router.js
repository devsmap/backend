import { Router } from 'express'
import { Http } from '@status/codes'

import { categoriesRouter } from './modules/categories/routes'
import { pinsRouter } from './modules/pins/routes'

const router = Router()

router.use(categoriesRouter)
      .use(pinsRouter)

router.get('/', (req, res) =>
  res.status(Http.ImATeapot).json({
    healthy: true,
  }),
)

export { router }
