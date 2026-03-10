/**
 * OHS Enterprise — Express приложение
 */
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import config from './config/index.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import testRoutes from './routes/testRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'
import companyRoutes from './routes/companyRoutes.js'
import auditRoutes from './routes/auditRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: config.cors.origin.split(',').map((o) => o.trim()), credentials: true }))
app.use(morgan('combined'))
app.use(express.json())
app.use(rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max }))

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/tests', testRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/categories', categoryRoutes)

// Swagger
const swaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'OHS Enterprise API', version: '1.0' },
  servers: [{ url: `http://localhost:${config.port}` }],
  paths: {
    '/api/auth/login': {
      post: { summary: 'Вход', tags: ['Auth'] },
    },
    '/api/auth/register': {
      post: { summary: 'Регистрация', tags: ['Auth'] },
    },
  },
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler)

export default app
