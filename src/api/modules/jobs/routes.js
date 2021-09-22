import { Router } from 'express'

import {
  jobsByCategoryAndCity
} from './controller.js'

const jobsRouter = Router()

jobsRouter
  .route('/api/v1/jobs/:category_id/:city_id')
  .get(jobsByCategoryAndCity)
  
export { jobsRouter }
