/**
 * Middleware аутентификации JWT
 */
import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js'
import config from '../config/index.js'
import userRepository from '../repositories/userRepository.js'

export function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new ApiError('Требуется авторизация', 401)
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt.secret)
    const user = userRepository.findById(decoded.sub)
    if (!user) throw new ApiError('Пользователь не найден', 401)
    req.user = user
    req.userId = user.id
    req.companyId = user.company_id
    req.role = user.role_name
    next()
  } catch (e) {
    if (e instanceof ApiError) next(e)
    else if (e.name === 'TokenExpiredError') next(new ApiError('Токен истёк', 401))
    else next(new ApiError('Недействительный токен', 401))
  }
}

/**
 * Проверка роли: Super Admin
 */
export function requireSuperAdmin(req, res, next) {
  if (req.role !== 'super_admin') {
    throw new ApiError('Доступ запрещён. Требуется роль Super Admin', 403)
  }
  next()
}

/**
 * Проверка роли: Company Admin или Super Admin
 */
export function requireCompanyAdmin(req, res, next) {
  if (req.role !== 'company_admin' && req.role !== 'super_admin') {
    throw new ApiError('Доступ запрещён. Требуется роль администратора', 403)
  }
  next()
}
