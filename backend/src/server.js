/**
 * OHS Enterprise — точка входа сервера
 */
import app from './app.js'
import config from './config/index.js'

const server = app.listen(config.port, () => {
  console.log(`🚀 OHS Enterprise API запущен на порту ${config.port}`)
  console.log(`   Health: http://localhost:${config.port}/health`)
  console.log(`   API Docs: http://localhost:${config.port}/api-docs`)
})

export default server
