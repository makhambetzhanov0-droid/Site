/**
 * Репозиторий пользователей
 */
import db from '../db/connection.js'

export default {
  findById(id) {
    const row = db.prepare(`
      SELECT u.id, u.company_id, u.role_id, u.email, u.full_name, u.email_verified, u.created_at, u.last_login_at, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `).get(id)
    return row || null
  },

  findByEmail(email) {
  const row = db.prepare(`
    SELECT u.*, r.name as role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?
  `).get(email)   // ⚠️ ТЕК email!

  return row || null
},

  create({ companyId, roleId, email, passwordHash, fullName }) {
    const result = db.prepare(`
      INSERT INTO users (company_id, role_id, email, password_hash, full_name)
      VALUES (?, ?, ?, ?, ?)
    `).run(companyId, roleId, email, passwordHash, fullName)
    return this.findById(result.lastInsertRowid)
  },

  updateLastLogin(id) {
    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(id)
  },

  findByCompany(companyId) {
    return db.prepare(`
      SELECT u.id, u.email, u.full_name, u.created_at, u.last_login_at, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.company_id = ?
      ORDER BY u.created_at DESC
    `).all(companyId)
  },

  findAll() {
    return db.prepare(`
      SELECT u.id, u.email, u.full_name, u.company_id, c.name as company_name, r.name as role_name, u.created_at
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `).all()
  },

  update(id, data) {
    const fields = []
    const values = []
    if (data.full_name !== undefined) { fields.push('full_name = ?'); values.push(data.full_name) }
    if (data.role_id !== undefined) { fields.push('role_id = ?'); values.push(data.role_id) }
    if (data.email_verified !== undefined) { fields.push('email_verified = ?'); values.push(data.email_verified) }
    if (fields.length === 0) return this.findById(id)
    values.push(id)
    db.prepare(`UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values)
    return this.findById(id)
  },

  delete(id) {
    db.prepare('DELETE FROM users WHERE id = ?').run(id)
    return true
  },
}
