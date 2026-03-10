/**
 * Управление компаниями (Super Admin)
 */
import { useState, useEffect } from 'react'
import { companies } from '../api/index.js'
import { Building2 } from 'lucide-react'

export default function AdminCompanies() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    companies.list().then((r) => setList(r.data.data)).catch(() => setList([])).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-white/60">Загрузка...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Компании</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((c) => (
          <div key={c.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-violet-400" />
              <h2 className="font-semibold text-white">{c.name}</h2>
            </div>
            <p className="text-white/50 text-sm mb-2">{c.slug}</p>
            <div className="flex gap-4 text-sm text-white/60">
              <span>Пользователей: {c.users_count ?? 0}</span>
              <span>Курсов: {c.courses_count ?? 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
