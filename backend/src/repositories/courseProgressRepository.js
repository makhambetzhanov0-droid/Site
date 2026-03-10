/**
 * Репозиторий прогресса курсов
 */
import db from '../db/connection.js'

export default {
  findByUser(userId) {
    return db.prepare(`
      SELECT cp.*, c.title as course_title, c.duration_minutes, c.passing_score
      FROM course_progress cp JOIN courses c ON cp.course_id = c.id
      WHERE cp.user_id = ? ORDER BY cp.started_at DESC
    `).all(userId)
  },
  findByUserAndCourse(userId, courseId) {
    return db.prepare('SELECT * FROM course_progress WHERE user_id = ? AND course_id = ?').get(userId, courseId) || null
  },
  create(userId, courseId) {
    const r = db.prepare('INSERT INTO course_progress (user_id, course_id) VALUES (?, ?)').run(userId, courseId)
    return db.prepare('SELECT * FROM course_progress WHERE id = ?').get(r.lastInsertRowid)
  },
  updateProgress(id, progressPercent, status, timeSpentMinutes) {
    const u = ['progress_percent = ?', 'status = ?', 'time_spent_minutes = ?']
    const v = [progressPercent, status, timeSpentMinutes]
    if (status === 'completed') u.push('completed_at = CURRENT_TIMESTAMP')
    v.push(id)
    db.prepare('UPDATE course_progress SET ' + u.join(', ') + ' WHERE id = ?').run(...v)
    return db.prepare('SELECT * FROM course_progress WHERE id = ?').get(id)
  },
  getStatsByUser(userId) {
    const t = db.prepare('SELECT COUNT(*) as c FROM course_progress cp JOIN courses c ON cp.course_id = c.id WHERE cp.user_id = ?').get(userId)
    const c = db.prepare('SELECT COUNT(*) as c FROM course_progress WHERE user_id = ? AND status = ?').get(userId, 'completed')
    const a = db.prepare('SELECT AVG(progress_percent) as a FROM course_progress WHERE user_id = ?').get(userId)
    return { total: t?.c || 0, completed: c?.c || 0, avgProgress: Math.round(a?.a || 0) }
  },
  getStatsByCompany(companyId) {
    const t = db.prepare('SELECT COUNT(*) as c FROM course_progress cp JOIN courses c ON cp.course_id = c.id WHERE c.company_id = ?').get(companyId)
    const done = db.prepare('SELECT COUNT(*) as c FROM course_progress cp JOIN courses c ON cp.course_id = c.id WHERE c.company_id = ? AND cp.status = ?').get(companyId, 'completed')
    const u = db.prepare('SELECT COUNT(DISTINCT cp.user_id) as c FROM course_progress cp JOIN courses c ON cp.course_id = c.id WHERE c.company_id = ?').get(companyId)
    const tot = t?.c || 0, compl = done?.c || 0
    return { total: tot, completed: compl, completionRate: tot ? Math.round(compl / tot * 100) : 0, usersWithProgress: u?.c || 0 }
  },
}
