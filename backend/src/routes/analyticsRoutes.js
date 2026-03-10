/**
 * Маршруты аналитики
 */
import { Router } from 'express'
import { auth, requireCompanyAdmin } from '../middleware/auth.js'
import analyticsController from '../controllers/analyticsController.js'

const router = Router()
router.use(auth)
router.use(requireCompanyAdmin)

router.get('/', (req, res, next) => analyticsController.get(req, res).catch(next))

export default router
