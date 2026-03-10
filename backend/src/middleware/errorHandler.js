/**
 * Централизованный обработчик ошибок
 */
import { error } from '../utils/response.js'
import ApiError from '../utils/ApiError.js'
import config from '../config/index.js'

export default function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500
  const message = err instanceof ApiError ? err.message : 'Внутренняя ошибка сервера'
  if (config.nodeEnv === 'development') console.error('Error:', err)
  res.status(statusCode).json(error(message, null))
}
