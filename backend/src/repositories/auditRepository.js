/**
 * Репозиторий аудит логов
 */
import db from '../db/connection.js'

export default {
  create({ userId, companyId, action, entityType, entityId, detailsJson, ipAddress, userAgent }) {
    db.prepare(`
      INSERT INTO audit_logs (user_id, company_id, action, entity_type, entity_id, details_json, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, companyId, action, entityType, entityId, detailsJson, ipAddress, userAgent)
  },

  findByCompany(companyId, limit = 50) {
    return db.prepare(`
      SELECT al.*, u.full_name, u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.company_id = ?
      ORDER BY al.created_at DESC
      LIMIT ?
    `).all(companyId, limit)
  },

  findAll(limit = 100) {
    return db.prepare(`
      SELECT al.*, u.full_name, u.email, c.name as company_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN companies c ON al.company_id = c.id
      ORDER BY al.created_at DESC
      LIMIT ?
    `).all(limit)
  },
}
