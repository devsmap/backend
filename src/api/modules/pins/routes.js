import { Router } from 'express'

import {
  pinsByCategories
} from './controller'

const categoriesRouter = Router()

categoriesRouter
  .route('/api/v1/pins/:category_id/default')
  .get(pinsByCategories)
  
export { categoriesRouter }
