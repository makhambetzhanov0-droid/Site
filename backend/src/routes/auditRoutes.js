/**
 * Маршруты аудит логов
 */
import { Router } from 'express'
import { auth, requireCompanyAdmin } from '../middleware/auth.js'
import auditController from '../controllers/auditController.js'

const router = Router()
router.use(auth)
router.use(requireCompanyAdmin)

router.get('/', (req, res, next) => auditController.list(req, res).catch(next))

export default router
