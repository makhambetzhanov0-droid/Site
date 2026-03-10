/**
 * Сервис тестов
 */
import testRepository from '../repositories/testRepository.js'
import courseRepository from '../repositories/courseRepository.js'
import testResultRepository from '../repositories/testResultRepository.js'
import ApiError from '../utils/ApiError.js'

export default {
  getTest(id, companyId, role) {
    const test = testRepository.findById(id)
    if (!test) throw new ApiError('Тест не найден', 404)
    if (role !== 'super_admin' && test.company_id !== companyId) throw new ApiError('Доступ запрещён', 403)
    return test
  },

  getQuestions(testId, limit, random, companyId, role) {
    const test = testRepository.findById(testId)
    if (!test) throw new ApiError('Тест не найден', 404)
    if (role !== 'super_admin' && test.company_id !== companyId) throw new ApiError('Доступ запрещён', 403)
    const q = testRepository.getQuestions(testId, limit || test.question_count, random)
    return q.map(({ options_json, correct_answer_index, ...rest }) => ({
      ...rest,
      options: JSON.parse(options_json || '[]'),
    }))
  },

  submitTest(testId, userId, answers, timeSpentSeconds) {
    const test = testRepository.findById(testId)
    if (!test) throw new ApiError('Тест не найден', 404)
    const questions = testRepository.getQuestions(testId)
    if (!questions.length) throw new ApiError('Нет вопросов в тесте', 400)
    let score = 0
    answers.forEach((ansIdx, qIdx) => {
      const q = questions[qIdx]
      if (q && parseInt(ansIdx, 10) === q.correct_answer_index) score += q.points || 1
    })
    const totalPoints = questions.reduce((s, q) => s + (q.points || 1), 0)
    const passed = (score * 100 / totalPoints) >= test.passing_score
    return testResultRepository.create({
      userId,
      testId,
      score,
      totalPoints,
      passed,
      timeSpentSeconds,
      answersJson: JSON.stringify(answers),
    })
  },

  hasAlreadyPassed(userId, testId) {
    const result = testResultRepository.findByUserAndTest(userId, testId)
    return result ? result.passed === 1 : false
  },

  createTest(data, companyId, role) {
    const course = courseRepository.findById(data.course_id)
    if (!course) throw new ApiError('Курс не найден', 404)
    if (role !== 'super_admin' && course.company_id !== companyId) throw new ApiError('Доступ запрещён', 403)
    return testRepository.createTest({
      courseId: data.course_id,
      title: data.title,
      timeLimitMinutes: data.time_limit_minutes,
      passingScore: data.passing_score,
      questionCount: data.question_count,
    })
  },

  createQuestion(testId, data, companyId, role) {
    const test = testRepository.findById(testId)
    if (!test) throw new ApiError('Тест не найден', 404)
    if (role !== 'super_admin' && test.company_id !== companyId) throw new ApiError('Доступ запрещён', 403)
    testRepository.createQuestion({
      testId,
      questionText: data.question_text,
      optionsJson: JSON.stringify(data.options || []),
      correctAnswerIndex: data.correct_answer_index,
      points: data.points,
    })
    return true
  },
}
