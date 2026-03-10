/**
 * Маршруты аутентификации
 */
import { Router } from 'express'
import Joi from 'joi'
import authController from '../controllers/authController.js'
import { validate } from '../middleware/validate.js'

const router = Router()
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  company_id: Joi.number().optional(),
})
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().required(),
  company_id: Joi.number().optional(),
  role_id: Joi.number().optional(),
})
const refreshSchema = Joi.object({ refresh_token: Joi.string().required() })

router.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res).catch(next))
router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res).catch(next))
router.post('/refresh', validate(refreshSchema), (req, res, next) => authController.refresh(req, res).catch(next))
router.post('/logout', validate(refreshSchema), (req, res, next) => authController.logout(req, res).catch(next))

export default router
