/**
 * Middleware аудита действий пользователя
 */
import auditRepository from '../repositories/auditRepository.js'

export function createAudit(action, entityType = null) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res)
    res.json = function (body) {
      if (req.user && res.statusCode >= 200 && res.statusCode < 400) {
        try {
          auditRepository.create({
            userId: req.user.id,
            companyId: req.user.company_id,
            action,
            entityType,
            entityId: body?.data?.id || req.params?.id,
            detailsJson: JSON.stringify({ method: req.method, path: req.path }),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          })
        } catch (e) {
          console.error('Audit log error:', e)
        }
      }
      return originalJson(body)
    }
    next()
  }
}
