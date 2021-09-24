import cors from 'cors'
import { config } from 'dotenv'
config({ path: '.env' })

import express from 'express'

import { applyMiddlewares } from './api/setup.js'
import { PORT } from './config/environment.js'

const app = express()

applyMiddlewares(app)

app.use(cors())

BigInt.prototype.toJSON = function() {       
  return this.toString()
}

app.listen(PORT, () => {
  console.log('Server running at port', PORT)
})