/**
 * Наполнение базы тестовыми данными
 */
import db from './connection.js'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'

const ROLES = { SUPER_ADMIN: 1, COMPANY_ADMIN: 2, EMPLOYEE: 3 }

async function seed() {
  console.log('🌱 Запуск сидера...')

  // Генерируем QR-коды до транзакции (async)
  const certId1 = nanoid(12)
  const certId2 = nanoid(12)
  const baseUrl = 'http://localhost:3001'
  let qrSvg1 = ''
  let qrSvg2 = ''
  try {
    qrSvg1 = await QRCode.toString(`${baseUrl}/api/certificates/verify/${certId1}`, { type: 'svg' })
    qrSvg2 = await QRCode.toString(`${baseUrl}/api/certificates/verify/${certId2}`, { type: 'svg' })
  } catch (e) {
    qrSvg1 = certId1
    qrSvg2 = certId2
  }

  const run = db.transaction(() => {
    // Роли
    db.run(`INSERT OR IGNORE INTO roles (id, name) VALUES (1, 'super_admin')`)
    db.run(`INSERT OR IGNORE INTO roles (id, name) VALUES (2, 'company_admin')`)
    db.run(`INSERT OR IGNORE INTO roles (id, name) VALUES (3, 'employee')`)

    // Компании
    const company1 = db.prepare('INSERT INTO companies (name, slug) VALUES (?, ?)').run('ООО Безопасность', 'bezopasnost')
    const company2 = db.prepare('INSERT INTO companies (name, slug) VALUES (?, ?)').run('ИП СтройИнвест', 'stroinvest')
    const company1Id = company1.lastInsertRowid || 1
    const company2Id = company2.lastInsertRowid || 2

    const passwordHash = bcrypt.hashSync('Password123!', 10)

    // Super Admin (без компании)
    db.prepare(`INSERT OR REPLACE INTO users (id, company_id, role_id, email, password_hash, full_name, email_verified) 
      VALUES (1, NULL, ?, 'admin@ohs.local', ?, 'Супер Администратор', 1)`)
      .run(ROLES.SUPER_ADMIN, passwordHash)

    // Company Admin и сотрудники
    db.prepare(`INSERT OR REPLACE INTO users (id, company_id, role_id, email, password_hash, full_name, email_verified) 
      VALUES (2, ?, ?, 'admin@bezopasnost.ru', ?, 'Иван Петров', 1)`)
      .run(company1Id, ROLES.COMPANY_ADMIN, passwordHash)
    db.prepare(`INSERT OR REPLACE INTO users (id, company_id, role_id, email, password_hash, full_name, email_verified) 
      VALUES (3, ?, ?, 'employee1@bezopasnost.ru', ?, 'Мария Сидорова', 1)`)
      .run(company1Id, ROLES.EMPLOYEE, passwordHash)
    db.prepare(`INSERT OR REPLACE INTO users (id, company_id, role_id, email, password_hash, full_name, email_verified) 
      VALUES (4, ?, ?, 'employee2@bezopasnost.ru', ?, 'Алексей Козлов', 1)`)
      .run(company1Id, ROLES.EMPLOYEE, passwordHash)
    db.prepare(`INSERT OR REPLACE INTO users (id, company_id, role_id, email, password_hash, full_name, email_verified) 
      VALUES (5, ?, ?, 'admin@stroinvest.ru', ?, 'Елена Новикова', 1)`)
      .run(company2Id, ROLES.COMPANY_ADMIN, passwordHash)
    db.prepare(`INSERT OR REPLACE INTO users (id, company_id, role_id, email, password_hash, full_name, email_verified) 
      VALUES (6, ?, ?, 'worker@stroinvest.ru', ?, 'Дмитрий Волков', 1)`)
      .run(company2Id, ROLES.EMPLOYEE, passwordHash)

    // Сброс автоинкремента для users
    db.run('DELETE FROM sqlite_sequence WHERE name="users"')
    db.run('INSERT INTO sqlite_sequence (name, seq) VALUES ("users", 6)')

    // Категории
    const cat1 = db.prepare('INSERT INTO course_categories (company_id, name) VALUES (?, ?)').run(company1Id, 'Общие вопросы')
    const cat2 = db.prepare('INSERT INTO course_categories (company_id, name) VALUES (?, ?)').run(company1Id, 'Пожарная безопасность')
    const cat1Id = cat1.lastInsertRowid
    const cat2Id = cat2.lastInsertRowid

    // Курсы
    const course1 = db.prepare(`INSERT INTO courses (company_id, category_id, title, description, duration_minutes, passing_score, created_by) 
      VALUES (?, ?, 'Вводный инструктаж по охране труда', 'Базовые правила безопасности на предприятии', 60, 70, 2)`).run(company1Id, cat1Id)
    const course2 = db.prepare(`INSERT INTO courses (company_id, category_id, title, description, duration_minutes, passing_score, created_by) 
      VALUES (?, ?, 'Пожарная безопасность', 'Правила пожарной безопасности и эвакуации', 45, 80, 2)`).run(company1Id, cat2Id)
    const course1Id = course1.lastInsertRowid
    const course2Id = course2.lastInsertRowid

    // Курс для второй компании
    db.prepare(`INSERT INTO courses (company_id, category_id, title, description, duration_minutes, passing_score, created_by) 
      VALUES (?, ?, 'Охрана труда на стройке', 'Специфика безопасности в строительстве', 90, 75, 5)`).run(company2Id, null, 5)

    // Тесты для курсов
    const test1 = db.prepare('INSERT INTO tests (course_id, title, time_limit_minutes, passing_score, question_count) VALUES (?, ?, 15, 70, 5)')
      .run(course1Id, 'Тест по вводному инструктажу')
    const test2 = db.prepare('INSERT INTO tests (course_id, title, time_limit_minutes, passing_score, question_count) VALUES (?, ?, 20, 80, 5)')
      .run(course2Id, 'Тест по пожарной безопасности')
    const test1Id = test1.lastInsertRowid
    const test2Id = test2.lastInsertRowid

    // Вопросы для теста 1
    const questions1 = [
      { text: 'Кто несёт ответственность за соблюдение правил охраны труда?', options: ['Только работодатель', 'Только работник', 'Работодатель и работник', 'Инспектор'], correct: 2 },
      { text: 'Как часто проводится вводный инструктаж?', options: ['Раз в год', 'При приёме на работу', 'Раз в квартал', 'По желанию'], correct: 1 },
      { text: 'Что такое СИЗ?', options: ['Система управления', 'Средства индивидуальной защиты', 'Стандарт качества', 'Санитарные нормы'], correct: 1 },
      { text: 'При несчастном случае необходимо:', options: ['Оказать первую помощь', 'Сообщить руководителю', 'Оформить акт', 'Всё перечисленное'], correct: 3 },
      { text: 'Первичный инструктаж проводит:', options: ['Специалист по ОТ', 'Непосредственный руководитель', 'HR-менеджер', 'Директор'], correct: 1 },
    ]
    questions1.forEach((q, i) => {
      db.prepare('INSERT INTO questions (test_id, question_text, options_json, correct_answer_index, points) VALUES (?, ?, ?, ?, 1)')
        .run(test1Id, q.text, JSON.stringify(q.options), q.correct)
    })

    // Вопросы для теста 2
    const questions2 = [
      { text: 'Какие средства тушения пожара считаются первичными?', options: ['Огнетушители', 'Пожарные гидранты', 'Песок', 'Все перечисленные'], correct: 3 },
      { text: 'При обнаружении пожара нужно:', options: ['Позвонить 101', 'Эвакуироваться', 'Сообщить руководителю', 'Всё вышеперечисленное'], correct: 3 },
      { text: 'Класс пожара А — это горение:', options: ['Твёрдых веществ', 'Жидкостей', 'Газов', 'Электрооборудования'], correct: 0 },
      { text: 'Как пользоваться порошковым огнетушителем?', options: ['Направить на пламя и нажать рычаг', 'Встряхнуть и направить', 'Открыть крышку и высыпать', 'Все варианты верны'], correct: 0 },
      { text: 'Пути эвакуации должны быть:', options: ['Свободными', 'Оборудованы указателями', 'Освещены', 'Всё перечисленное'], correct: 3 },
    ]
    questions2.forEach((q) => {
      db.prepare('INSERT INTO questions (test_id, question_text, options_json, correct_answer_index, points) VALUES (?, ?, ?, ?, 1)')
        .run(test2Id, q.text, JSON.stringify(q.options), q.correct)
    })

    // Прогресс курсов
    const now = new Date().toISOString()
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    db.prepare('INSERT OR REPLACE INTO course_progress (user_id, course_id, progress_percent, status, completed_at, time_spent_minutes) VALUES (3, ?, 100, ?)')
      .run(course1Id, 'completed')
    db.prepare('UPDATE course_progress SET completed_at = ?, time_spent_minutes = 55 WHERE user_id = 3 AND course_id = ?').run(now, course1Id)
    db.prepare('INSERT OR REPLACE INTO course_progress (user_id, course_id, progress_percent, status, time_spent_minutes) VALUES (3, ?, 60, ?, 30)')
      .run(course2Id, 'in_progress')
    db.prepare('INSERT OR REPLACE INTO course_progress (user_id, course_id, progress_percent, status, time_spent_minutes) VALUES (4, ?, 20, ?, 10)')
      .run(course1Id, 'in_progress')
    db.prepare('INSERT OR REPLACE INTO course_progress (user_id, course_id, progress_percent, status, completed_at, time_spent_minutes) VALUES (6, ?, 100, ?)')
      .run(course2Id, 'completed')

    // Результаты тестов
    db.prepare('INSERT OR REPLACE INTO test_results (user_id, test_id, score, total_points, passed, time_spent_seconds, answers_json) VALUES (3, ?, 5, 5, 1, 420, ?)')
      .run(test1Id, JSON.stringify([0, 1, 1, 2, 3, 1]))
    db.prepare('INSERT OR REPLACE INTO test_results (user_id, test_id, score, total_points, passed, time_spent_seconds, answers_json) VALUES (6, ?, 4, 5, 1, 600, ?)')
      .run(test2Id, JSON.stringify([3, 3, 0, 0, 3]))

    // Сертификаты
    const validUntil = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString()
    db.prepare('INSERT INTO certificates (unique_id, user_id, course_id, test_result_id, valid_until, qr_code_data) VALUES (?, 3, ?, (SELECT id FROM test_results WHERE user_id=3 AND test_id=? LIMIT 1), ?, ?)')
      .run(certId1, course1Id, test1Id, validUntil, qrSvg1)
    db.prepare('INSERT INTO certificates (unique_id, user_id, course_id, test_result_id, valid_until, qr_code_data) VALUES (?, 6, ?, (SELECT id FROM test_results WHERE user_id=6 AND test_id=? LIMIT 1), ?, ?)')
      .run(certId2, course2Id, test2Id, validUntil, qrSvg2)

    // Аудит логи
    const auditActions = [
      [2, company1Id, 'login', null, null, '{"message":"Успешный вход"}'],
      [3, company1Id, 'course_start', 'course', course1Id, '{"course":"Вводный инструктаж"}'],
      [3, company1Id, 'course_complete', 'course', course1Id, '{"course":"Вводный инструктаж","score":100}'],
      [2, company1Id, 'course_create', 'course', course1Id, '{"title":"Вводный инструктаж"}'],
      [1, null, 'user_view', 'user', 3, '{"email":"employee1@bezopasnost.ru"}'],
    ]
    auditActions.forEach(([userId, compId, action, entityType, entityId, details]) => {
      db.prepare('INSERT INTO audit_logs (user_id, company_id, action, entity_type, entity_id, details_json) VALUES (?, ?, ?, ?, ?, ?)')
        .run(userId, compId, action, entityType, entityId, details)
    })
  })

  run()
  console.log('✅ Сидер завершён успешно')
  console.log('\n📋 Учётные данные для входа:')
  console.log('  Super Admin: admin@ohs.local / Password123!')
  console.log('  Company Admin: admin@bezopasnost.ru / Password123!')
  console.log('  Employee: employee1@bezopasnost.ru / Password123!')
}

seed().catch((err) => {
  console.error('Ошибка сидера:', err)
  process.exit(1)
})
