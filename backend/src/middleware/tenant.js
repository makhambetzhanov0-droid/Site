/**
 * Middleware Multi-tenant: проверка доступа к данным компании
 */
import ApiError from '../utils/ApiError.js'

export function requireCompanyAccess(req, res, next) {
  // Super Admin имеет доступ ко всем компаниям
  if (req.role === 'super_admin') {
    return next()
  }
  const targetCompanyId = parseInt(req.params.companyId || req.body.company_id || req.query.company_id, 10)
  if (!targetCompanyId) return next()
  if (req.companyId !== targetCompanyId) {
    throw new ApiError('Доступ к данным другой компании запрещён', 403)
  }
  next()
}
