/**
 * Маршруты пользователей
 */
import { Router } from 'express'
import Joi from 'joi'
import { auth, requireCompanyAdmin } from '../middleware/auth.js'
import userController from '../controllers/userController.js'
import { validate } from '../middleware/validate.js'

const router = Router({ mergeParams: true })
router.use(auth)

const createSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().required(),
  company_id: Joi.number().optional(),
  role_id: Joi.number().optional(),
})

router.get('/me', (req, res, next) => userController.me(req, res).catch(next))
router.get('/', requireCompanyAdmin, (req, res, next) => userController.list(req, res).catch(next))
router.post('/', requireCompanyAdmin, validate(createSchema), (req, res, next) => userController.create(req, res).catch(next))
router.patch('/:id', requireCompanyAdmin, (req, res, next) => userController.update(req, res).catch(next))
router.delete('/:id', requireCompanyAdmin, (req, res, next) => userController.delete(req, res).catch(next))

export default router
