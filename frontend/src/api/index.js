/**
 * API методы OHS Enterprise
 */
import client from './client.js'

export const auth = {
  login: (d) => client.post('/auth/login', d),
  register: (d) => client.post('/auth/register', d),
  logout: (d) => client.post('/auth/logout', d),
}
export const users = {
  me: () => client.get('/users/me'),
  list: () => client.get('/users'),
  create: (d) => client.post('/users', d),
  update: (id, d) => client.patch('/users/' + id, d),
  delete: (id) => client.delete('/users/' + id),
}
export const dashboard = {
  user: () => client.get('/dashboard/user'),
  admin: () => client.get('/dashboard/admin'),
}
export const courses = {
  list: () => client.get('/courses'),
  get: (id) => client.get('/courses/' + id),
  create: (d) => client.post('/courses', d),
  update: (id, d) => client.patch('/courses/' + id, d),
  delete: (id) => client.delete('/courses/' + id),
  start: (id) => client.post('/courses/' + id + '/start'),
  updateProgress: (progressId, d) => client.patch('/courses/progress/' + progressId, d),
  complete: (id) => client.post('/courses/' + id + '/complete'),
}
export const tests = {
  get: (id) => client.get('/tests/' + id),
  getQuestions: (id, random) => client.get('/tests/' + id + '/questions', { params: { random: random !== false } }),
  submit: (id, d) => client.post('/tests/' + id + '/submit', d),
  create: (d) => client.post('/tests', d),
  addQuestion: (id, d) => client.post('/tests/' + id + '/questions', d),
}
export const certificates = {
  verify: (uniqueId) => client.get('/certificates/verify/' + uniqueId),
  my: () => client.get('/certificates/my'),
}
export const companies = { list: () => client.get('/companies'), create: (d) => client.post('/companies', d) }
export const audit = { list: (limit) => client.get('/audit', { params: { limit } }) }
export const analytics = { get: (companyId) => client.get('/analytics', { params: { company_id: companyId } }) }
export const categories = { list: (companyId) => client.get('/categories', { params: { company_id: companyId } }) }
