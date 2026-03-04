'use strict'

import { Router } from 'express'
import { register, login, getMyProfile } from './auth.controller.js'
import { validateJwt } from '../../middlewares/validate-jwt.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', validateJwt, getMyProfile)

export default router