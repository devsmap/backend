import { Http } from '@status/codes'

import * as pinsService from './service'

export const pinsByCategories = async (req, res, next) => {
  const allCategories= await pinsService.findAllCategories()
  return res.json(allCategories)
}
