import { Router } from 'express'
import Joi from 'joi'
import { auth, requireCompanyAdmin } from '../middleware/auth.js'
import testController from '../controllers/testController.js'
import { validate } from '../middleware/validate.js'

const router = Router()
router.use(auth)
const submitSchema = Joi.object({ answers: Joi.array().items(Joi.number()).required(), time_spent_seconds: Joi.number().required() })
const createTestSchema = Joi.object({ course_id: Joi.number().required(), title: Joi.string().required() })
const createQuestionSchema = Joi.object({ question_text: Joi.string().required(), options: Joi.array().items(Joi.string()).required(), correct_answer_index: Joi.number().required() })

router.get('/:id', (req, res, next) => testController.get(req, res).catch(next))
router.get('/:id/questions', (req, res, next) => testController.getQuestions(req, res).catch(next))
router.post('/:id/submit', validate(submitSchema), (req, res, next) => testController.submit(req, res).catch(next))
router.post('/', requireCompanyAdmin, validate(createTestSchema), (req, res, next) => testController.create(req, res).catch(next))
router.post('/:id/questions', requireCompanyAdmin, validate(createQuestionSchema), (req, res, next) => testController.addQuestion(req, res).catch(next))
export default router
