/**
 * Репозиторий курсов
 */
import db from '../db/connection.js'

export default {
  findById(id) {
    return db.prepare(`
      SELECT c.*, cc.name as category_name, 
        (SELECT COUNT(*) FROM course_progress WHERE course_id = c.id AND status = 'completed') as completed_count,
        (SELECT id FROM tests WHERE course_id = c.id LIMIT 1) as test_id
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE c.id = ?
    `).get(id) || null
  },

  findByCompany(companyId) {
    return db.prepare(`
      SELECT c.*, cc.name as category_name
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE c.company_id = ?
      ORDER BY c.created_at DESC
    `).all(companyId)
  },

  findAll() {
    return db.prepare(`
      SELECT c.*, cc.name as category_name, comp.name as company_name
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN companies comp ON c.company_id = comp.id
      ORDER BY c.created_at DESC
    `).all()
  },

  create({ companyId, categoryId, title, description, durationMinutes, passingScore, createdBy }) {
    const result = db.prepare(`
      INSERT INTO courses (company_id, category_id, title, description, duration_minutes, passing_score, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(companyId, categoryId, title, description, durationMinutes || 60, passingScore || 70, createdBy)
    return this.findById(result.lastInsertRowid)
  },

  update(id, data) {
    const fields = []
    const values = []
    const map = { title: 'title', description: 'description', durationMinutes: 'duration_minutes', passingScore: 'passing_score', categoryId: 'category_id', isActive: 'is_active' }
    Object.entries(map).forEach(([k, col]) => {
      if (data[k] !== undefined) { fields.push(`${col} = ?`); values.push(data[k]) }
    })
    if (fields.length === 0) return this.findById(id)
    values.push(id)
    db.prepare(`UPDATE courses SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values)
    return this.findById(id)
  },

  delete(id) {
    db.prepare('DELETE FROM courses WHERE id = ?').run(id)
    return true
  },
}
