import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import 'express-async-errors'
import { errors } from 'celebrate'

import { router } from './router.js'

export const applyMiddlewares = app => {
  app.use(express.json())
  app.use(cookieParser())
  app.use(morgan('tiny'))
  app.use(router)
  app.use(errors())
}
