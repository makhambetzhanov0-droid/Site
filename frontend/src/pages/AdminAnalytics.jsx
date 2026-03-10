import { useState, useEffect } from 'react'
import { analytics } from '../api/index.js'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useAuth } from '../context/AuthContext.jsx'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

export default function AdminAnalytics() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    analytics.get(user?.company_id).then((r) => setData(r.data.data)).catch(() => setData(null))
  }, [user?.company_id])

  if (!data) return <div className="text-white/60">Загрузка...</div>

  const growthData = data.monthlyGrowth?.length ? {
    labels: data.monthlyGrowth.map((m) => m.month),
    datasets: [{ label: 'Тестов', data: data.monthlyGrowth.map((m) => m.count), backgroundColor: 'rgba(139,92,246,0.6)' }],
  } : null

  const popularityData = data.coursePopularity?.length ? {
    labels: data.coursePopularity.map((c) => c.title),
    datasets: [{ label: 'Завершено', data: data.coursePopularity.map((c) => c.completions), backgroundColor: 'rgba(99,102,241,0.6)' }],
  } : null

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Аналитика</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <p className="text-white/60 text-sm">Completion rate</p>
          <p className="text-2xl font-bold text-white mt-1">{data.completionRate ?? 0}%</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <p className="text-white/60 text-sm">Средний балл</p>
          <p className="text-2xl font-bold text-white mt-1">{data.avgScore ?? 0}%</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <p className="text-white/60 text-sm">Активные пользователи</p>
          <p className="text-2xl font-bold text-white mt-1">{data.activeUsers ?? 0}</p>
        </div>
      </div>
      {growthData && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 h-64">
          <h2 className="text-lg font-semibold text-white mb-4">Рост по месяцам</h2>
          <Bar data={growthData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      )}
      {popularityData && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 h-64">
          <h2 className="text-lg font-semibold text-white mb-4">Популярность курсов</h2>
          <Bar data={popularityData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
        </div>
      )}
    </div>
  )
}
