/**
 * Маршруты дашборда
 */
import { Router } from 'express'
import { auth, requireCompanyAdmin } from '../middleware/auth.js'
import dashboardController from '../controllers/dashboardController.js'

const router = Router()
router.use(auth)
router.get('/user', (req, res, next) => dashboardController.user(req, res).catch(next))
router.get('/admin', requireCompanyAdmin, (req, res, next) => dashboardController.admin(req, res).catch(next))
export default router
