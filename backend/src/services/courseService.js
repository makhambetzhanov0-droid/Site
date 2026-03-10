/**
 * Сервис курсов
 */
import courseRepository from '../repositories/courseRepository.js'
import courseProgressRepository from '../repositories/courseProgressRepository.js'
import ApiError from '../utils/ApiError.js'

export default {
  getCourses(companyId, isSuperAdmin) {
    return isSuperAdmin ? courseRepository.findAll() : courseRepository.findByCompany(companyId)
  },

  getCourse(id, userId, companyId, role) {
    const course = courseRepository.findById(id)
    if (!course) throw new ApiError('Курс не найден', 404)
    if (role !== 'super_admin' && course.company_id !== companyId) throw new ApiError('Доступ запрещён', 403)
    let progress = null
    if (userId) progress = courseProgressRepository.findByUserAndCourse(userId, id)
    return { ...course, progress }
  },

  createCourse(data, userId, companyId) {
    const cid = data.company_id || companyId
    if (!cid) throw new ApiError('company_id обязателен', 400)
    return courseRepository.create({
      companyId: cid,
      categoryId: data.category_id,
      title: data.title,
      description: data.description,
      durationMinutes: data.duration_minutes,
      passingScore: data.passing_score,
      createdBy: userId,
    })
  },

  updateCourse(id, data, companyId, role) {
    const course = courseRepository.findById(id)
    if (!course) throw new ApiError('Курс не найден', 404)
    if (role !== 'super_admin' && course.company_id !== companyId) throw new ApiError('Доступ запрещён', 403)
    return courseRepository.update(id, {
      title: data.title,
      description: data.description,
      durationMinutes: data.duration_minutes,
      passingScore: data.passing_score,
      categoryId: data.category_id,
      isActive: data.is_active,
    })
  },

  deleteCourse(id, companyId, role) {
    const course = courseRepository.findById(id)
    if (!course) throw new ApiError('Курс не найден', 404)
    if (role !== 'super_admin' && course.company_id !== companyId) throw new ApiError('Доступ запрещён', 403)
    courseRepository.delete(id)
    return true
  },

  startCourse(courseId, userId, companyId, role) {
    const course = courseRepository.findById(courseId)
    if (!course) throw new ApiError('Курс не найден', 404)
    if (role !== 'super_admin' && course.company_id !== companyId) throw new ApiError('Доступ запрещён', 403)
    let progress = courseProgressRepository.findByUserAndCourse(userId, courseId)
    if (!progress) progress = courseProgressRepository.create(userId, courseId)
    return progress
  },

  updateProgress(progressId, userId, data) {
    const list = courseProgressRepository.findByUser(userId)
    const progress = list.find((p) => p.id === parseInt(progressId, 10))
    if (!progress) throw new ApiError('Прогресс не найден', 404)
    return courseProgressRepository.updateProgress(progress.id, data.progress_percent, data.status, data.time_spent_minutes || progress.time_spent_minutes)
  },

  completeCourse(courseId, userId, companyId, role) {
  const progress = courseProgressRepository.findByUserAndCourse(userId, courseId)

  if (progress) {
    return courseProgressRepository.update(progress.id, {
      progress_percent: 100,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
  }

  return courseProgressRepository.create({
    user_id: userId,
    course_id: courseId,
    progress_percent: 100,
    status: 'completed',
    completed_at: new Date().toISOString()
  })
}
}
