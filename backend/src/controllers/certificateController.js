/**
 * Контроллер сертификатов
 */
import certificateService from '../services/certificateService.js'
import { success } from '../utils/response.js'

export default {
  verify(req, res) {
    const cert = certificateService.verify(req.params.uniqueId)
    res.json(success(cert))
  },

  my(req, res) {
    const certs = certificateService.getByUser(req.userId)
    res.json(success(certs))
  },
}
