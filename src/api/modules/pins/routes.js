import { Router } from 'express'

import {
  pinsByCategories
} from './controller.js'

const pinsRouter = Router()

pinsRouter
  .route('/api/v1/pins/:category_id/default')
  .get(pinsByCategories)
  
export { pinsRouter }
