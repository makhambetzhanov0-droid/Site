/**
 * Репозиторий сертификатов
 */
import db from '../db/connection.js'

export default {
  findByUniqueId(uniqueId) {
    return db.prepare(`
      SELECT cert.*, u.full_name, u.email, c.title as course_title, comp.name as company_name
      FROM certificates cert
      JOIN users u ON cert.user_id = u.id
      JOIN courses c ON cert.course_id = c.id
      LEFT JOIN companies comp ON u.company_id = comp.id
      WHERE cert.unique_id = ?
    `).get(uniqueId) || null
  },

  findByUser(userId) {
    return db.prepare(`
      SELECT cert.*, c.title as course_title
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      WHERE cert.user_id = ?
      ORDER BY cert.issued_at DESC
    `).all(userId)
  },

  create({ uniqueId, userId, courseId, testResultId, validUntil, qrCodeData }) {
    db.prepare(`
      INSERT INTO certificates (unique_id, user_id, course_id, test_result_id, valid_until, qr_code_data)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uniqueId, userId, courseId, testResultId, validUntil, qrCodeData)
    return this.findByUniqueId(uniqueId)
  },
}
