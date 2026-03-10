/**
 * Контроллер категорий курсов
 */
import categoryRepository from '../repositories/categoryRepository.js'
import ApiError from '../utils/ApiError.js'
import { success } from '../utils/response.js'

export default {
  list(req, res) {
    const companyId = req.role === 'super_admin' ? req.query.company_id : req.companyId
    if (!companyId) return res.json(success([]))
    const categories = categoryRepository.findByCompany(companyId)
    res.json(success(categories))
  },

  create(req, res) {
    const companyId = req.body.company_id || req.companyId
    if (!companyId) throw new ApiError('company_id обязателен', 400)
    const category = categoryRepository.create(companyId, req.body.name)
    res.status(201).json(success(category, 'Категория создана'))
  },

  update(req, res) {
    const id = parseInt(req.params.id, 10)
    const category = categoryRepository.update(id, req.body.name)
    res.json(success(category, 'Категория обновлена'))
  },

  delete(req, res) {
    const id = parseInt(req.params.id, 10)
    categoryRepository.delete(id)
    res.json(success(null, 'Категория удалена'))
  },
}
