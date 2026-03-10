/**
 * API аутентификации
 */
import client from './client.js'

export const login = (data) => client.post('/auth/login', data)
export const register = (data) => client.post('/auth/register', data)
export const logout = (data) => client.post('/auth/logout', data)
export const refresh = (data) => client.post('/auth/refresh', data)
