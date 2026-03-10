/**
 * Сервис аутентификации
 */
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import config from '../config/index.js'
import userRepository from '../repositories/userRepository.js'
import refreshTokenRepository from '../repositories/refreshTokenRepository.js'
import ApiError from '../utils/ApiError.js'
import emailService from './emailService.js'

export default {
  async register({ email, password, fullName, companyId, roleId = 3 }) {
    const existing = userRepository.findByEmail(email, companyId)
    if (existing) throw new ApiError('Пользователь с таким email уже существует', 400)
    const passwordHash = bcrypt.hashSync(password, 10)
    const user = userRepository.create({ companyId, roleId, email, passwordHash, fullName })
    emailService.sendVerification(user)
    const { password_hash, ...rest } = user
    return rest
  },

  async login(email, password, companyId = null) {
    const user = userRepository.findByEmail(email)
    if (!user) throw new ApiError('Неверный email или пароль', 401)
    const valid = bcrypt.compareSync(password, user.password_hash)
    if (!valid) throw new ApiError('Неверный email или пароль', 401)
    userRepository.updateLastLogin(user.id)
    const accessToken = jwt.sign({ sub: user.id }, config.jwt.secret, { expiresIn: config.jwt.accessExpiry })
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const refreshToken = nanoid(64)
    refreshTokenRepository.create(user.id, refreshToken, refreshExpiry)
    const { password_hash, ...userData } = user
    return { user: userData, accessToken, refreshToken, expiresIn: config.jwt.accessExpiry }
  },

  async refresh(refreshToken) {
    const stored = refreshTokenRepository.findByToken(refreshToken)
    if (!stored) throw new ApiError('Недействительный refresh токен', 401)
    const user = userRepository.findById(stored.user_id)
    if (!user) throw new ApiError('Пользователь не найден', 401)
    refreshTokenRepository.deleteByToken(refreshToken)
    const accessToken = jwt.sign({ sub: user.id }, config.jwt.secret, { expiresIn: config.jwt.accessExpiry })
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const newRefreshToken = nanoid(64)
    refreshTokenRepository.create(user.id, newRefreshToken, refreshExpiry)
    const { password_hash, ...userData } = user
    return { user: userData, accessToken, refreshToken: newRefreshToken, expiresIn: config.jwt.accessExpiry }
  },

  async logout(refreshToken) {
    refreshTokenRepository.deleteByToken(refreshToken)
    return true
  },
}
