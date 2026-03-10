import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import certificateController from '../controllers/certificateController.js'

const router = Router()
router.get('/verify/:uniqueId', (req, res, next) => certificateController.verify(req, res).catch(next))
router.use(auth)
router.get('/my', (req, res, next) => certificateController.my(req, res).catch(next))
export default router
