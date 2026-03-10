1. Жобаның мақсаты мен идеясы: OHS Enterprise — еңбек қауіпсіздігі (еңбекті қорғау) бойынша қызметкерлердің білімін оқыту, тестілеу, нәтижесін бағалау, және талапқа сай өткен жағдайда сертификат беру үшін жасалған веб-қосымша.
Негізгі бизнес-логика: компания (организация) қызметкерлерін жүйеге қосу, курс беру (оқыту материалы), тестілеу жүргізу, автоматты бағалау, сертификат шығару және сертификатты тексеру (verify)

2. Қолданылған технологиялар (Tech Stack)
Backend
Node.js (v20) — серверлік орта
Express — REST API жасау
SQLite — дерекқор
better-sqlite3 — SQLite-пен жылдам жұмыс
JWT (jsonwebtoken) — авторизация (access token)
Refresh token логикасы — ұзақ сессия үшін
bcryptjs — парольді хэштеу
nanoid — refresh token генерациялау
Joi — validation (request body тексеру)
Swagger (swagger-jsdoc, swagger-ui-express) — API құжаттама
Қосымша қауіпсіздік/утилиталар: helmet, express-rate-limit, cors, morgan, dotenv (жобада бар екенін node_modules көрсетеді)
Frontend
React + Vite — SPA интерфейс
react-router-dom — беттер маршрутизациясы
Axios instance (client.js) — API-мен байланыс
Tailwind CSS — UI дизайн
lucide-react — иконкалар
Admin аналитикада графиктер болса: chart.js / react-chartjs-2 (сенің AdminDashboard кодыңнан көрінген)

3. Архитектура және құрылым
Backend архитектурасы (layered)
Сенде production-ға жақын дұрыс бөліну бар:
routes/ — endpoint-тер
controllers/ — request/response деңгейі
services/ — бизнес-логика
repositories/ — SQL/DB операциялар
db/ — connection, migrate, seed
middleware/ — auth/validate/error/tenant/audit
config/ — конфигурация
utils/ — helper, response format, ApiError
Бұл дипломда “қабатталған архитектура” деп сипатталады (Controllers → Services → Repositories).
Frontend құрылымы
pages/ — беттер (Login, Register, Dashboard, CourseDetail, TestPage, Certificates, Admin бөлімдер)
layouts/ — AppLayout (sidebar + header)
context/ — AuthContext (token сақтау, logout/login)
api/ — client.js және нақты endpoint-терге арналған әдістер

4. Жүйедегі рөлдер (RBAC)
Дерекқорда roles:
super_admin
company_admin
employee
Рөлге байланысты интерфейс пен мүмкіндіктер ашылады:
Admin мәзірлері (компаниялар, қызметкерлер, аналитика, аудит)
Employee мәзірлері (курстар, тест, сертификат)

5. Дерекқор (Database) және негізгі кестелер
Сенің SQLite кестелерің:
companies — компаниялар (name, slug)
users — қолданушылар (role_id, company_id, email, password_hash, full_name, email_verified…)
roles — рөлдер
courses — курстар (company_id, title, duration, passing_score, is_active…)
course_progress — курс прогресі (progress_percent, status, started_at, completed_at, time_spent_minutes)
tests — тесттер (course_id байланысы)
questions — тест сұрақтары (options_json, correct_answer_index, points)
test_results — тест нәтижелері
certificates — сертификаттар
audit_logs — аудит/әрекеттер журналы
refresh_tokens — refresh token сақтау
Дипломда мұны ER-диаграмма ретінде беруге болады.

6. Нақты жұмыс істейтін функционал (қазір бар)
Аутентификация
Register / Login
JWT access token
Refresh token генерациясы және сақтау
Logout
Пароль хэштеу (bcrypt)
Оқыту логикасы
Employee курс тізімін көреді
CourseDetail беті
Тест бастау (test бар болса)
Тест сұрақтарын шығару
Жауаптарды тексеру
Нәтижені сақтау (test_results)
Passing score ≥ 70% болса → сертификат шығару (certificates)
“Сертификатты тексеру” беті (verify бойынша)
Admin логикасы
Admin панель көрінеді (super_admin)
Companies беті (компаниялар)
Employees/users басқару беттері (сенде бар)
Analytics беті (сенде бар)
Audit беті (әрекеттер журналы)

7. Middleware-лер (өте маңызды диплом үшін)
Сенде middleware папкасы:
auth.js — JWT тексеру, req.user, req.role, req.companyId орнату
validate.js — Joi арқылы request validation
errorHandler.js — global error handling (ApiError)
tenant.js — multi-tenant логикаға дайындық
audit.js — аудит лог жазу (әрекеттерді бақылау)
Бұл бөлім дипломда “қауіпсіздік және бақылау механизмі” ретінде жақсы көрінеді.
