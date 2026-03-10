import { useState, useEffect } from 'react'
import { dashboard } from '../api/index.js'
import { Users, TrendingUp, Award, BarChart3 } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement)

export default function AdminDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    dashboard.admin().then((r) => setData(r.data.data)).catch(() => setData(null))
  }, [])

  const chartData = data?.monthlyGrowth?.length ? {
    labels: data.monthlyGrowth.map((m) => m.month),
    datasets: [{ label: 'Тестов', data: data.monthlyGrowth.map((m) => m.count), backgroundColor: 'rgba(139,92,246,0.6)' }],
  } : null

  if (!data) return <div className="text-white/60">Загрузка...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Админ-дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-3 mb-2"><Users className="w-8 h-8 text-violet-400" /><span className="text-white/60">Сотрудники</span></div>
          <p className="text-3xl font-bold text-white">{data.employeesCount ?? 0}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-3 mb-2"><TrendingUp className="w-8 h-8 text-violet-400" /><span className="text-white/60">Completion rate</span></div>
          <p className="text-3xl font-bold text-white">{data.completionRate ?? 0}%</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-3 mb-2"><Award className="w-8 h-8 text-violet-400" /><span className="text-white/60">Средний балл</span></div>
          <p className="text-3xl font-bold text-white">{data.avgScore ?? 0}%</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-3 mb-2"><BarChart3 className="w-8 h-8 text-violet-400" /><span className="text-white/60">Активные</span></div>
          <p className="text-3xl font-bold text-white">{data.activeUsers ?? 0}</p>
        </div>
      </div>
      {chartData && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 h-64">
          <h2 className="text-lg font-semibold text-white mb-4">Рост по месяцам</h2>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      )}
    </div>
  )
}
