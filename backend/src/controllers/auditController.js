/**
 * Контроллер аудит логов
 */
import auditRepository from '../repositories/auditRepository.js'
import { success } from '../utils/response.js'

export default {
  list(req, res) {
    const limit = parseInt(req.query.limit, 10) || 100
    if (req.role === 'super_admin') {
      const logs = auditRepository.findAll(limit)
      return res.json(success(logs))
    }
    const logs = auditRepository.findByCompany(req.companyId, limit)
    res.json(success(logs))
  },
}
