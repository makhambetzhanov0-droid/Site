/**
 * Контроллер дашборда
 */
import dashboardService from '../services/dashboardService.js'
import { success } from '../utils/response.js'

export default {
  user(req, res) {
    const data = dashboardService.getUserDashboard(req.userId)
    res.json(success(data))
  },

  admin(req, res) {
    const isSuper = req.role === 'super_admin'
    const companyId = isSuper ? null : req.companyId
    const data = dashboardService.getAdminDashboard(companyId, isSuper)
    res.json(success(data))
  },
}
