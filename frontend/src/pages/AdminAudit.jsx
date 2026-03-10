/**
 * Аудит логи
 */
import { useState, useEffect } from 'react'
import { audit } from '../api/index.js'

export default function AdminAudit() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    audit.list(100).then((r) => setLogs(r.data.data)).catch(() => setLogs([])).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-white/60">Загрузка...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Аудит логи</h1>
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-white/60 text-sm border-b border-white/10">
              <th className="pb-3 pr-4">Дата</th>
              <th className="pb-3 pr-4">Пользователь</th>
              <th className="pb-3 pr-4">Действие</th>
              <th className="pb-3 pr-4">Сущность</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/60 text-sm">{new Date(l.created_at).toLocaleString('ru')}</td>
                <td className="py-3 pr-4 text-white">{l.full_name || l.email || '-'}</td>
                <td className="py-3 pr-4 text-violet-300">{l.action}</td>
                <td className="py-3 pr-4 text-white/60">{l.entity_type || '-'} {l.entity_id || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!logs.length && <p className="text-white/50 mt-4">Логов пока нет</p>}
    </div>
  )
}
