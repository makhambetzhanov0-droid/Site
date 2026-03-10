/**
 * Контроллер тестов
 */
import testService from '../services/testService.js'
import certificateService from '../services/certificateService.js'
import courseProgressRepository from '../repositories/courseProgressRepository.js'
import { success } from '../utils/response.js'

export default {
  get(req, res) {
    const id = parseInt(req.params.id, 10)
    const test = testService.getTest(id, req.companyId, req.role)
    res.json(success(test))
  },

  getQuestions(req, res) {
    const id = parseInt(req.params.id, 10)
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null
    const random = req.query.random === 'true'
    const questions = testService.getQuestions(id, limit, random, req.companyId, req.role)
    res.json(success(questions))
  },

  submit(req, res) {
    const testId = parseInt(req.params.id, 10)
    const alreadyPassed = testService.hasAlreadyPassed(req.userId, testId)
    if (alreadyPassed) return res.status(400).json({ success: false, message: 'Тест уже пройден' })
    const result = testService.submitTest(
      testId,
      req.userId,
      req.body.answers || [],
      req.body.time_spent_seconds || 0
    )
    if (result.passed) {
      const test = testService.getTest(testId, req.companyId, req.role)
      const cert = certificateService.issue(req.userId, test.course_id, result.id)
      const progress = courseProgressRepository.findByUserAndCourse(req.userId, test.course_id)
      if (progress) courseProgressRepository.updateProgress(progress.id, 100, 'completed', progress.time_spent_minutes)
    }
    res.json(success(result, result.passed ? 'Тест пройден' : 'Тест не пройден'))
  },

  create(req, res) {
    const test = testService.createTest(req.body, req.companyId, req.role)
    res.status(201).json(success(test, 'Тест создан'))
  },

  addQuestion(req, res) {
    const testId = parseInt(req.params.id, 10)
    testService.createQuestion(testId, req.body, req.companyId, req.role)
    res.status(201).json(success(null, 'Вопрос добавлен'))
  },
}
