/**
 * Валидация с Joi
 */
import ApiError from '../utils/ApiError.js'

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'body' ? req.body : source === 'params' ? req.params : req.query
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) {
      const message = error.details.map((d) => d.message).join(', ')
      throw new ApiError(message, 400)
    }
    next()
  }
}
