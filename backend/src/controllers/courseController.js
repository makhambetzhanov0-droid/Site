/**
 * Контроллер курсов
 */
import courseService from '../services/courseService.js'
import { success } from '../utils/response.js'

export default {
  list(req, res) {
    const courses = courseService.getCourses(req.companyId, req.role === 'super_admin')
    res.json(success(courses))
  },
  get(req, res) {
    const id = parseInt(req.params.id, 10)
    const course = courseService.getCourse(id, req.userId, req.companyId, req.role)
    res.json(success(course))
  },
  create(req, res) {
    const course = courseService.createCourse(req.body, req.userId, req.companyId)
    res.status(201).json(success(course, 'Курс создан'))
  },
  update(req, res) {
    const id = parseInt(req.params.id, 10)
    const course = courseService.updateCourse(id, req.body, req.companyId, req.role)
    res.json(success(course, 'Курс обновлён'))
  },
  delete(req, res) {
    const id = parseInt(req.params.id, 10)
    courseService.deleteCourse(id, req.companyId, req.role)
    res.json(success(null, 'Курс удалён'))
  },
  start(req, res) {
    const courseId = parseInt(req.params.id, 10)
    const progress = courseService.startCourse(courseId, req.userId, req.companyId, req.role)
    res.status(201).json(success(progress, 'Курс начат'))
  },
  updateProgress(req, res) {
    const progressId = req.params.progressId
    const progress = courseService.updateProgress(progressId, req.userId, req.body)
    res.json(success(progress, 'Прогресс обновлён'))
  },

  complete(req, res) {
  const courseId = parseInt(req.params.id, 10)
  const progress = courseService.completeCourse(
    courseId,
    req.userId,
    req.companyId,
    req.role
  )

  res.json(success(progress, 'Обучение завершено'))
},
}
