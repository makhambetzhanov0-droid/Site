/**
 * Миграции базы данных
 * Создаёт все необходимые таблицы
 */
import db from './connection.js'

const migrations = [
  // Компании (Multi-tenant)
  `CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Роли
  `CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`,

  // Пользователи
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER REFERENCES companies(id),
    role_id INTEGER REFERENCES roles(id) NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME,
    UNIQUE(email, company_id)
  )`,

  // Refresh токены
  `CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Категории курсов
  `CREATE TABLE IF NOT EXISTS course_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER REFERENCES companies(id),
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Курсы
  `CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER REFERENCES companies(id) NOT NULL,
    category_id INTEGER REFERENCES course_categories(id),
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 60,
    passing_score INTEGER DEFAULT 70,
    is_active INTEGER DEFAULT 1,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Прогресс прохождения курса
  `CREATE TABLE IF NOT EXISTS course_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    progress_percent INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    time_spent_minutes INTEGER DEFAULT 0,
    UNIQUE(user_id, course_id)
  )`,

  // Тесты
  `CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    time_limit_minutes INTEGER DEFAULT 30,
    passing_score INTEGER DEFAULT 70,
    question_count INTEGER DEFAULT 10,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Вопросы
  `CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    options_json TEXT NOT NULL,
    correct_answer_index INTEGER NOT NULL,
    points INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Результаты тестов
  `CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    passed INTEGER NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    answers_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, test_id)
  )`,

  // Сертификаты
  `CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unique_id TEXT UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    test_result_id INTEGER REFERENCES test_results(id),
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    valid_until DATETIME,
    qr_code_data TEXT
  )`,

  // Аудит логи
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    company_id INTEGER REFERENCES companies(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    details_json TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Индексы
  `CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  `CREATE INDEX IF NOT EXISTS idx_courses_company ON courses(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_course_progress_course ON course_progress(course_id)`,
  `CREATE INDEX IF NOT EXISTS idx_test_results_user ON test_results(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_certificates_unique_id ON certificates(unique_id)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_company ON audit_logs(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)`,
]

async function migrate() {
  console.log('🔄 Запуск миграций...')
  const run = db.transaction(() => {
    migrations.forEach((sql, i) => {
      try {
        db.exec(sql)
        console.log(`  ✓ Миграция ${i + 1}/${migrations.length}`)
      } catch (err) {
        console.error(`  ✗ Ошибка миграции ${i + 1}:`, err.message)
        throw err
      }
    })
  })
  run()
  console.log('✅ Миграции завершены успешно')
}

migrate().catch((err) => {
  console.error('Ошибка миграций:', err)
  process.exit(1)
})
