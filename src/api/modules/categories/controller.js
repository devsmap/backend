import { Http } from '@status/codes'

import * as categoriesService from './service'

export const findAllCategories = async (req, res, next) => {
  const allCategories= await categoriesService.findAllCategories()
  return res.json(allCategories)
}
