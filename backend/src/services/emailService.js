/**
 * Mock email сервис - логирует в консоль
 */
export default {
  sendVerification(user) {
    console.log(`[EMAIL MOCK] Отправка письма верификации на ${user.email} для ${user.full_name}`)
    return true
  },
  sendCertificate(user, courseTitle, certId) {
    console.log(`[EMAIL MOCK] Отправка сертификата на ${user.email}: ${courseTitle}, ID: ${certId}`)
    return true
  },
}
