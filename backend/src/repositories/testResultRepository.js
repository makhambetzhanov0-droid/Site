/**
 * Репозиторий результатов тестов
 */
import db from '../db/connection.js'

export default {
  findByUser(userId) {
    return db.prepare(`
      SELECT tr.*, t.title as test_title, c.title as course_title
      FROM test_results tr
      JOIN tests t ON tr.test_id = t.id
      JOIN courses c ON t.course_id = c.id
      WHERE tr.user_id = ?
      ORDER BY tr.created_at DESC
    `).all(userId)
  },

  findByUserAndTest(userId, testId) {
    return db.prepare('SELECT * FROM test_results WHERE user_id = ? AND test_id = ?').get(userId, testId) || null
  },

  create({ userId, testId, score, totalPoints, passed, timeSpentSeconds, answersJson }) {
    db.prepare(`
      INSERT OR REPLACE INTO test_results (user_id, test_id, score, total_points, passed, time_spent_seconds, answers_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, testId, score, totalPoints, passed ? 1 : 0, timeSpentSeconds, answersJson)
    return db.prepare('SELECT * FROM test_results WHERE user_id = ? AND test_id = ?').get(userId, testId)
  },

  getAvgScoreByCompany(companyId) {
    const row = db.prepare(`
      SELECT AVG(tr.score * 100.0 / tr.total_points) as avg_score
      FROM test_results tr
      JOIN tests t ON tr.test_id = t.id
      JOIN courses c ON t.course_id = c.id
      WHERE c.company_id = ?
    `).get(companyId)
    return Math.round(row?.avg_score || 0)
  },

  getMonthlyGrowth(companyId, months = 6) {
    return db.prepare(`
      SELECT strftime('%Y-%m', tr.created_at) as month, COUNT(*) as count
      FROM test_results tr
      JOIN tests t ON tr.test_id = t.id
      JOIN courses c ON t.course_id = c.id
      WHERE c.company_id = ? AND tr.created_at >= date('now', '-' || ? || ' months')
      GROUP BY month
      ORDER BY month
    `).all(companyId, months)
  },
}
