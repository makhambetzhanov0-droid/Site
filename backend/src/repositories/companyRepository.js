/**
 * Репозиторий компаний
 */
import db from '../db/connection.js'

export default {
  findById(id) {
    return db.prepare('SELECT * FROM companies WHERE id = ?').get(id) || null
  },
  findBySlug(slug) {
    return db.prepare('SELECT * FROM companies WHERE slug = ?').get(slug) || null
  },
  findAll() {
    return db.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM users WHERE company_id = c.id) as users_count,
        (SELECT COUNT(*) FROM courses WHERE company_id = c.id) as courses_count
      FROM companies c ORDER BY c.name
    `).all()
  },
  create({ name, slug }) {
    const result = db.prepare('INSERT INTO companies (name, slug) VALUES (?, ?)').run(name, slug)
    return this.findById(result.lastInsertRowid)
  },
  update(id, data) {
    const f = [], v = []
    if (data.name) { f.push('name = ?'); v.push(data.name) }
    if (data.slug) { f.push('slug = ?'); v.push(data.slug) }
    if (f.length) { v.push(id); db.prepare('UPDATE companies SET ' + f.join(', ') + ', updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(...v) }
    return this.findById(id)
  },
  delete(id) {
    db.prepare('DELETE FROM companies WHERE id = ?').run(id)
    return true
  },
}
