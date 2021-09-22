import { Router } from 'express'

import {
  findAllCategories
} from './controller.js'

const categoriesRouter = Router()

categoriesRouter
  .route('/api/v1/categories')
  .get(findAllCategories)
  
export { categoriesRouter }
