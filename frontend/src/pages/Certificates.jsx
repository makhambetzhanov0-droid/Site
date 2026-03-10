/**
 * Список сертификатов пользователя
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { certificates } from '../api/index.js'
import { Award } from 'lucide-react'

export default function Certificates() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    certificates.my()
      .then((r) => setItems(r.data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-white/60">Загрузка...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Мои сертификаты</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">{c.course_title}</h2>
            </div>
            <div className="text-white/60 text-sm space-y-1 mb-4">
              <p>ID: {c.unique_id}</p>
              <p>Выдан: {new Date(c.issued_at).toLocaleDateString('ru')}</p>
            </div>
            <Link
              to={`/certificates/verify/${c.unique_id}`}
              className="inline-flex items-center gap-2 text-violet-300 hover:underline text-sm"
            >
              Проверить сертификат
            </Link>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-white/50 text-center py-12">У вас пока нет сертификатов</p>
      )}
    </div>
  )
}
