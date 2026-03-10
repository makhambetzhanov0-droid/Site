/**
 * Сервис сертификатов
 */
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'
import certificateRepository from '../repositories/certificateRepository.js'
import testResultRepository from '../repositories/testResultRepository.js'
import userRepository from '../repositories/userRepository.js'
import courseRepository from '../repositories/courseRepository.js'
import ApiError from '../utils/ApiError.js'
import config from '../config/index.js'
import emailService from './emailService.js'

export default {
  verify(uniqueId) {
    const cert = certificateRepository.findByUniqueId(uniqueId)
    if (!cert) throw new ApiError('Сертификат не найден', 404)
    const valid = !cert.valid_until || new Date(cert.valid_until) > new Date()
    return { ...cert, valid }
  },

  getByUser(userId) {
    return certificateRepository.findByUser(userId)
  },

  async issue(userId, courseId, testResultId) {
    const user = userRepository.findById(userId)
    if (!user) throw new ApiError('Пользователь не найден', 404)
    const course = courseRepository.findById(courseId)
    if (!course) throw new ApiError('Курс не найден', 404)
    const uniqueId = nanoid(12)
    const baseUrl = config.cors?.origin?.replace(/:\d+$/, '') || 'http://localhost:3001'
    const verifyUrl = `${baseUrl}/api/certificates/verify/${uniqueId}`
    let qrSvg = ''
    try {
      qrSvg = await QRCode.toString(verifyUrl, { type: 'svg' })
    } catch (e) {
      qrSvg = verifyUrl
    }
    const validUntil = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString()
    const cert = certificateRepository.create({
      uniqueId,
      userId,
      courseId,
      testResultId,
      validUntil,
      qrCodeData: qrSvg,
    })
    emailService.sendCertificate(user, course.title, uniqueId)
    return cert
  },
}
