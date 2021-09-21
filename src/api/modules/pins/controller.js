import { Http } from '@status/codes'

import * as pinsService from './service'

export const pinsByCategories = async (req, res, next) => {
  const allPins= await pinsService.allByCategories()
  return res.json(allPins)
}
