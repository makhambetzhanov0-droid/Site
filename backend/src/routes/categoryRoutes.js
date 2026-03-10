/**
 * Маршруты категорий курсов
 */
import { Router } from 'express'
import Joi from 'joi'
import { auth, requireCompanyAdmin } from '../middleware/auth.js'
import categoryController from '../controllers/categoryController.js'
import { validate } from '../middleware/validate.js'

const router = Router()
router.use(auth)
router.use(requireCompanyAdmin)

const createSchema = Joi.object({ name: Joi.string().required(), company_id: Joi.number().optional() })

router.get('/', (req, res, next) => categoryController.list(req, res).catch(next))
router.post('/', validate(createSchema), (req, res, next) => categoryController.create(req, res).catch(next))
router.patch('/:id', (req, res, next) => categoryController.update(req, res).catch(next))
router.delete('/:id', (req, res, next) => categoryController.delete(req, res).catch(next))

export default router
