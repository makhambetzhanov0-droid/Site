import { useState, useEffect } from 'react'
import { users } from '../api/index.js'

export default function AdminUsers() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    users.list().then((r) => setList(r.data.data)).catch(() => setList([])).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-white/60">Загрузка...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Сотрудники</h1>
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-white/60 text-sm border-b border-white/10">
              <th className="pb-3 pr-4">ФИО</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Роль</th>
              <th className="pb-3 pr-4">Компания</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="py-3 pr-4 text-white">{u.full_name}</td>
                <td className="py-3 pr-4 text-white/80">{u.email}</td>
                <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs">{u.role_name}</span></td>
                <td className="py-3 pr-4 text-white/60">{u.company_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
