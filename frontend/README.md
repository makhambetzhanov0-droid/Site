# OHS Enterprise

Платформа обучения и сертификации по охране труда — enterprise-level SaaS для дипломного проекта.

## Структура проекта

```
Site/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/    # Конфигурация
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── db/        # Миграции, сидер, подключение
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
├── src/               # React Frontend
│   ├── api/           # HTTP клиент и методы
│   ├── context/       # AuthContext
│   ├── layouts/
│   ├── pages/
│   └── App.jsx
├── docker-compose.yml
└── README.md
```

## Быстрый старт (локально)

**Примечание:** `better-sqlite3` требует сборки нативного модуля. На Windows нужны build-tools и Python. Рекомендуется использовать Docker или WSL для локальной разработки.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
node src/db/migrate.js
node src/db/seed.js
npm run dev
```

Backend будет доступен на http://localhost:3001

### 2. Frontend

```bash
npm install
npm run dev
```

Frontend будет доступен на http://localhost:5173 (проксирует /api на backend)

## Учётные данные (после seed)

| Роль          | Email                    | Пароль      |
|---------------|--------------------------|-------------|
| Super Admin   | admin@ohs.local          | Password123! |
| Company Admin | admin@bezopasnost.ru     | Password123! |
| Employee      | employee1@bezopasnost.ru | Password123! |

## Запуск через Docker

```bash
cd backend && node src/db/migrate.js && node src/db/seed.js
docker-compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost/api
- Swagger: http://localhost:3001/api-docs (при локальном backend)

## Основные возможности

- **Auth**: JWT Access + Refresh, bcrypt, валидация Joi
- **RBAC**: Super Admin, Company Admin, Employee
- **Multi-tenant**: изоляция данных по компаниям
- **Dashboard**: user (прогресс, курсы, сертификаты), admin (сотрудники, completion rate, графики)
- **Курсы**: CRUD, категории, прогресс
- **Тесты**: CRUD вопросов, ограничение по времени, случайный порядок, защита от повторной сдачи
- **Сертификаты**: PDF-ready, уникальный ID, QR-код, публичная проверка
- **Analytics**: completion rate, средний балл, рост по месяцам, популярность курсов
- **Audit logs**: логирование действий
- **Security**: Helmet, CORS, rate limiting, централизованная обработка ошибок
