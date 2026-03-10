/**
 * Контроллер аутентификации
 */
import authService from '../services/authService.js'
import auditRepository from '../repositories/auditRepository.js'
import { success } from '../utils/response.js'

export default {
  async register(req, res) {
    const user = await authService.register({
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.full_name,
      companyId: req.body.company_id || null,
      roleId: req.body.role_id || 3,
    })
    auditRepository.create({
      userId: user.id,
      companyId: user.company_id,
      action: 'register',
      detailsJson: JSON.stringify({ email: user.email }),
    })
    res.status(201).json(success(user, 'Регистрация успешна'))
  },

  async login(req, res) {
    const result = await authService.login(req.body.email, req.body.password, req.body.company_id || null)
    auditRepository.create({
      userId: result.user.id,
      companyId: result.user.company_id,
      action: 'login',
      detailsJson: JSON.stringify({ email: result.user.email }),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })
    res.json(success(result, 'Вход выполнен'))
  },

  async refresh(req, res) {
    const result = await authService.refresh(req.body.refresh_token)
    res.json(success(result, 'Токен обновлён'))
  },

  async logout(req, res) {
    await authService.logout(req.body.refresh_token)
    res.json(success(null, 'Выход выполнен'))
  },
}

// auditRepository.create({
//   userId: result.user.id,
//   companyId: result.user.company_id,
//   action: 'login',
//   detailsJson: JSON.stringify({ email: result.user.email }),
//   ipAddress: req.ip,
//   userAgent: req.headers['user-agent'],
// })