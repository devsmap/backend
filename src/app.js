import express from 'express'

import { applyMiddlewares } from './api/setup.js'
import { PORT } from './config/environment.js'

const app = express()

applyMiddlewares(app)

BigInt.prototype.toJSON = function() {       
  return this.toString()
}

app.listen(PORT, () => {
  console.log('Server running at port', PORT)
})