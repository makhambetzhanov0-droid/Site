/**
 * Контроллер пользователей
 */
import userRepository from '../repositories/userRepository.js'
import authService from '../services/authService.js'
import ApiError from '../utils/ApiError.js'
import { success } from '../utils/response.js'

export default {
  me(req, res) {
    const { password_hash, ...user } = req.user
    res.json(success(user))
  },

  list(req, res) {
    const users = req.role === 'super_admin'
      ? userRepository.findAll()
      : userRepository.findByCompany(req.companyId)
    res.json(success(users))
  },

  async create(req, res) {
    const user = await authService.register({
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.full_name,
      companyId: req.body.company_id || req.companyId,
      roleId: req.body.role_id || 3,
    })
    res.status(201).json(success(user, 'Пользователь создан'))
  },

  update(req, res) {
    const id = parseInt(req.params.id, 10)
    const target = userRepository.findById(id)
    if (!target) throw new ApiError('Пользователь не найден', 404)
    if (req.role !== 'super_admin' && target.company_id !== req.companyId) throw new ApiError('Доступ запрещён', 403)
    const user = userRepository.update(id, req.body)
    res.json(success(user, 'Пользователь обновлён'))
  },

  delete(req, res) {
    const id = parseInt(req.params.id, 10)
    const target = userRepository.findById(id)
    if (!target) throw new ApiError('Пользователь не найден', 404)
    if (req.role !== 'super_admin' && target.company_id !== req.companyId) throw new ApiError('Доступ запрещён', 403)
    userRepository.delete(id)
    res.json(success(null, 'Пользователь удалён'))
  },
}
