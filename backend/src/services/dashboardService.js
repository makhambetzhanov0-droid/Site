/**
 * Сервис дашборда
 */
import courseProgressRepository from '../repositories/courseProgressRepository.js'
import testResultRepository from '../repositories/testResultRepository.js'
import certificateRepository from '../repositories/certificateRepository.js'
import userRepository from '../repositories/userRepository.js'

export default {
  getUserDashboard(userId) {
    const stats = courseProgressRepository.getStatsByUser(userId)
    const certs = certificateRepository.findByUser(userId)
    const progress = courseProgressRepository.findByUser(userId)
    const results = testResultRepository.findByUser(userId)
    const avgScore = results.length
      ? Math.round(results.reduce((s, r) => s + (r.score * 100 / r.total_points), 0) / results.length)
      : 0
    const lastActivity = progress[0]?.started_at || results[0]?.created_at || null
    const total = stats.total || 1
    return {
      completionPercent: Math.round((stats.completed / total) * 100),
      coursesCount: stats.total,
      certificatesCount: certs.length,
      avgScore,
      lastActivity,
      progress: progress.slice(0, 5),
    }
  },

  getAdminDashboard(companyId, isSuperAdmin) {
    let employeesCount = 0
    let completionRate = 0
    let avgScore = 0
    let monthlyGrowth = []
    let activeUsers = 0
    const users = isSuperAdmin ? userRepository.findAll() : userRepository.findByCompany(companyId)
    employeesCount = users.filter((u) => u.role_name === 'employee').length
    const cpStats = companyId ? courseProgressRepository.getStatsByCompany(companyId) : { completionRate: 0, usersWithProgress: 0 }
    completionRate = cpStats.completionRate || 0
    activeUsers = cpStats.usersWithProgress || 0
    avgScore = companyId ? testResultRepository.getAvgScoreByCompany(companyId) : 0
    monthlyGrowth = companyId ? testResultRepository.getMonthlyGrowth(companyId, 6) : []
    return { employeesCount, completionRate, avgScore, monthlyGrowth, activeUsers }
  },
}
