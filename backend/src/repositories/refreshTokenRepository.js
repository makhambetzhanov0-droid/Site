/**
 * Репозиторий refresh токенов
 */
import db from '../db/connection.js'

export default {
  create(userId, token, expiresAt) {
    db.prepare('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)')
      .run(userId, token, expiresAt.toISOString())
  },

  findByToken(token) {
    const row = db.prepare(`
      SELECT * FROM refresh_tokens 
      WHERE token = ? AND expires_at > datetime('now')
    `).get(token)
    return row || null
  },

  deleteByToken(token) {
    db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token)
  },

  deleteByUserId(userId) {
    db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId)
  },

  deleteExpired() {
    db.prepare("DELETE FROM refresh_tokens WHERE expires_at <= datetime('now')").run()
  },
}
