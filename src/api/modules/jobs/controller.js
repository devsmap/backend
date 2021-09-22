import { Http } from '@status/codes'

import * as jobsService from './service.js'

export const jobsByCategoryAndCity = async (req, res, next) => {
  const allJobs= await jobsService.allByCategoryAndCity(req.params.category_id, req.params.city_id)
  return res.json(allJobs)
}
