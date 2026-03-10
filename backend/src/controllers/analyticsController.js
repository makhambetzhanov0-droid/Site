/**
 * Контроллер аналитики
 */
import courseProgressRepository from '../repositories/courseProgressRepository.js'
import testResultRepository from '../repositories/testResultRepository.js'
import db from '../db/connection.js'
import { success } from '../utils/response.js'

export default {
  get(req, res) {
    const companyId = req.role === 'super_admin' ? req.query.company_id : req.companyId
    if (!companyId) return res.json(success({ completionRate: 0, avgScore: 0, activeUsers: 0, coursePopularity: [], monthlyGrowth: [] }))
    const cpStats = courseProgressRepository.getStatsByCompany(companyId)
    const avgScore = testResultRepository.getAvgScoreByCompany(companyId)
    const monthlyGrowth = testResultRepository.getMonthlyGrowth(companyId, 6)
    const coursePopularity = db.prepare(`
      SELECT c.id, c.title, COUNT(cp.id) as completions
      FROM courses c
      LEFT JOIN course_progress cp ON cp.course_id = c.id AND cp.status = 'completed'
      WHERE c.company_id = ?
      GROUP BY c.id ORDER BY completions DESC LIMIT 10
    `).all(companyId)
    res.json(success({
      completionRate: cpStats.completionRate,
      avgScore,
      activeUsers: cpStats.usersWithProgress,
      coursePopularity,
      monthlyGrowth,
    }))
  },
}
