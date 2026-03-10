/**
 * Маршруты курсов
 */
import { Router } from 'express'
import Joi from 'joi'
import { auth, requireCompanyAdmin } from '../middleware/auth.js'
import courseController from '../controllers/courseController.js'
import { validate } from '../middleware/validate.js'

const router = Router()
router.use(auth)

const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  duration_minutes: Joi.number().optional(),
  passing_score: Joi.number().optional(),
  category_id: Joi.number().optional(),
  company_id: Joi.number().optional(),
})
const updateSchema = createSchema.keys({ title: Joi.string().optional() })
const progressSchema = Joi.object({
  progress_percent: Joi.number().min(0).max(100).required(),
  status: Joi.string().valid('in_progress', 'completed').required(),
  time_spent_minutes: Joi.number().optional(),
})

router.get('/', (req, res, next) => courseController.list(req, res).catch(next))
router.get('/:id', (req, res, next) => courseController.get(req, res).catch(next))
router.post('/', requireCompanyAdmin, validate(createSchema), (req, res, next) => courseController.create(req, res).catch(next))
router.patch('/:id', requireCompanyAdmin, validate(updateSchema), (req, res, next) => courseController.update(req, res).catch(next))
router.delete('/:id', requireCompanyAdmin, (req, res, next) => courseController.delete(req, res).catch(next))
router.patch('/progress/:progressId', validate(progressSchema), (req, res, next) => courseController.updateProgress(req, res).catch(next))
router.post('/:id/start', (req, res, next) => courseController.start(req, res).catch(next))
router.post('/:id/complete', auth, courseController.complete)

export default router
