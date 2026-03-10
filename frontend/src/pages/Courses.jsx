/**
 * Список курсов
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courses } from '../api/index.js'
import { BookOpen } from 'lucide-react'

export default function Courses() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    courses.list()
      .then((r) => setItems(r.data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-white/60">Загрузка...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Курсы</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <Link
            key={c.id}
            to={`/courses/${c.id}`}
            className="block p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">{c.title}</h2>
            </div>
            {c.description && (
              <p className="text-white/60 text-sm line-clamp-2 mb-3">{c.description}</p>
            )}
            <div className="flex items-center gap-2 text-white/50 text-sm">
              {c.duration_minutes && <span>{c.duration_minutes} мин</span>}
              {c.category_name && <span>• {c.category_name}</span>}
            </div>
          </Link>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-white/50 text-center py-12">Нет доступных курсов</p>
      )}
    </div>
  )
}
