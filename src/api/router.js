import { Router } from 'express'
import { Http } from '@status/codes'

import { categoriesRouter } from '../api/modules/categories/routes.js'
// import { pinsRouter } from './src/api/modules/pins/routes'

const router = Router()

// router.use(categoriesRouter)
//       .use(pinsRouter)

// router.get('/', (req, res) =>
//   res.status(Http.ImATeapot).json({
//     healthy: true,
//   }),
// )

export { router }
