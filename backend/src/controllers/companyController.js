/**
 * Контроллер компаний
 */
import companyRepository from '../repositories/companyRepository.js'
import ApiError from '../utils/ApiError.js'
import { success } from '../utils/response.js'

export default {
  list(req, res) {
    const companies = companyRepository.findAll()
    res.json(success(companies))
  },

  get(req, res) {
    const id = parseInt(req.params.id, 10)
    const company = companyRepository.findById(id)
    if (!company) throw new ApiError('Компания не найдена', 404)
    res.json(success(company))
  },

  create(req, res) {
    const company = companyRepository.create({ name: req.body.name, slug: req.body.slug })
    res.status(201).json(success(company, 'Компания создана'))
  },

  update(req, res) {
    const id = parseInt(req.params.id, 10)
    const company = companyRepository.update(id, req.body)
    res.json(success(company, 'Компания обновлена'))
  },

  delete(req, res) {
    const id = parseInt(req.params.id, 10)
    companyRepository.delete(id)
    res.json(success(null, 'Компания удалена'))
  },
}
