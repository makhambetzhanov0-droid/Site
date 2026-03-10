/**
 * Репозиторий категорий курсов
 */
import db from '../db/connection.js'

export default {
  findByCompany(companyId) {
    return db.prepare('SELECT * FROM course_categories WHERE company_id = ? ORDER BY name').all(companyId)
  },

  findById(id) {
    return db.prepare('SELECT * FROM course_categories WHERE id = ?').get(id) || null
  },

  create(companyId, name) {
    const result = db.prepare('INSERT INTO course_categories (company_id, name) VALUES (?, ?)').run(companyId, name)
    return this.findById(result.lastInsertRowid)
  },

  update(id, name) {
    db.prepare('UPDATE course_categories SET name = ? WHERE id = ?').run(name, id)
    return this.findById(id)
  },

  delete(id) {
    db.prepare('DELETE FROM course_categories WHERE id = ?').run(id)
    return true
  },
}
