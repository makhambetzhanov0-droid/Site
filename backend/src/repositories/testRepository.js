/**
 * Репозиторий тестов и вопросов
 */
import db from '../db/connection.js'

export default {
  findById(id) {
    return db.prepare(`
      SELECT t.*, c.title as course_title, c.company_id
      FROM tests t
      JOIN courses c ON t.course_id = c.id
      WHERE t.id = ?
    `).get(id) || null
  },

  findByCourse(courseId) {
    return db.prepare('SELECT * FROM tests WHERE course_id = ? AND is_active = 1').all(courseId)
  },

  getQuestions(testId, limit = null, random = false) {
    let sql = 'SELECT * FROM questions WHERE test_id = ?'
    if (random) sql += ' ORDER BY RANDOM()'
    if (limit) sql += ' LIMIT ' + parseInt(limit, 10)
    return db.prepare(sql).all(testId)
  },

  createTest({ courseId, title, timeLimitMinutes, passingScore, questionCount }) {
    const result = db.prepare(`
      INSERT INTO tests (course_id, title, time_limit_minutes, passing_score, question_count)
      VALUES (?, ?, ?, ?, ?)
    `).run(courseId, title, timeLimitMinutes || 30, passingScore || 70, questionCount || 10)
    return this.findById(result.lastInsertRowid)
  },

  createQuestion({ testId, questionText, optionsJson, correctAnswerIndex, points }) {
    db.prepare(`
      INSERT INTO questions (test_id, question_text, options_json, correct_answer_index, points)
      VALUES (?, ?, ?, ?, ?)
    `).run(testId, questionText, optionsJson, correctAnswerIndex, points || 1)
    return true
  },

  updateTest(id, data) {
    const fields = []
    const values = []
    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title) }
    if (data.timeLimitMinutes !== undefined) { fields.push('time_limit_minutes = ?'); values.push(data.timeLimitMinutes) }
    if (data.passingScore !== undefined) { fields.push('passing_score = ?'); values.push(data.passingScore) }
    if (data.questionCount !== undefined) { fields.push('question_count = ?'); values.push(data.questionCount) }
    if (data.isActive !== undefined) { fields.push('is_active = ?'); values.push(data.isActive) }
    if (fields.length > 0) {
      values.push(id)
      db.prepare(`UPDATE tests SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    }
    return this.findById(id)
  },

  deleteQuestion(id) {
    db.prepare('DELETE FROM questions WHERE id = ?').run(id)
    return true
  },

  deleteTest(id) {
    db.prepare('DELETE FROM tests WHERE id = ?').run(id)
    return true
  },
}
