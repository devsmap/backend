import { Router } from 'express'
import { Http } from '@status/codes'

import { categoriesRouter } from './modules/categories/routes'

const router = Router()

router.use(categoriesRouter)

router.get('/', (req, res) =>
  res.status(Http.ImATeapot).json({
    healthy: true,
  }),
)

export { router }
