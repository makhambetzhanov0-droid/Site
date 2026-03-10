/**
 * Утилиты для унифицированного ответа API
 * Формат: { success, data, message }
 */
export function success(data = null, message = 'OK') {
  return { success: true, data, message }
}

export function error(message = 'Произошла ошибка', data = null) {
  return { success: false, data, message }
}
