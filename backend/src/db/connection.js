/**
 * Подключение к SQLite базе данных
 */
import Database from 'better-sqlite3'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import config from '../config/index.js'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Создаём директорию data если не существует
const dbDir = join(__dirname, '../../data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = config.db.path.startsWith('.') 
  ? join(__dirname, '../..', config.db.path) 
  : config.db.path

const db = new Database(dbPath, { verbose: config.nodeEnv === 'development' ? console.log : null })

// Включаем foreign keys
db.pragma('foreign_keys = ON')

export default db
