/**
 * Маршруты компаний
 */
import { Router } from 'express'
import Joi from 'joi'
import { auth, requireSuperAdmin } from '../middleware/auth.js'
import companyController from '../controllers/companyController.js'
import { validate } from '../middleware/validate.js'

const router = Router()
router.use(auth)
router.use(requireSuperAdmin)

const createSchema = Joi.object({ name: Joi.string().required(), slug: Joi.string().required() })

router.get('/', (req, res, next) => companyController.list(req, res).catch(next))
router.get('/:id', (req, res, next) => companyController.get(req, res).catch(next))
router.post('/', validate(createSchema), (req, res, next) => companyController.create(req, res).catch(next))
router.patch('/:id', (req, res, next) => companyController.update(req, res).catch(next))
router.delete('/:id', (req, res, next) => companyController.delete(req, res).catch(next))

export default router
