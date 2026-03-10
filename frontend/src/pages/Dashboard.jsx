/**
 * Дашборд пользователя
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboard } from '../api/index.js'
import { BookOpen, Award, TrendingUp, Clock } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

function AnimatedCounter({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / 30
    const t = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(t); return }
      setDisplay(Math.round(start))
    }, 40)
    return () => clearInterval(t)
  }, [value])
  return <span>{display}{suffix}</span>
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboard.user().then((r) => setData(r.data.data)).catch(() => setData(null)).finally(() => setLoading(false))
  }, [])

  if (loading || !data) return <div className="text-white/60">Загрузка...</div>

  const chartData = {
    labels: data.progress?.map((p) => p.course_title) || [],
    datasets: [{ label: 'Прогресс %', data: data.progress?.map((p) => p.progress_percent) || [], backgroundColor: 'rgba(139,92,246,0.6)' }],
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-violet-400" />
            <span className="text-white/60">Курсы</span>
          </div>
          <p className="text-3xl font-bold text-white"><AnimatedCounter value={data.coursesCount || 0} /></p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-violet-400" />
            <span className="text-white/60">Сертификаты</span>
          </div>
          <p className="text-3xl font-bold text-white"><AnimatedCounter value={data.certificatesCount || 0} /></p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-violet-400" />
            <span className="text-white/60">Прогресс</span>
          </div>
          <p className="text-3xl font-bold text-white"><AnimatedCounter value={data.completionPercent || 0} suffix="%" /></p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-violet-400" />
            <span className="text-white/60">Средний балл</span>
          </div>
          <p className="text-3xl font-bold text-white"><AnimatedCounter value={data.avgScore || 0} suffix="%" /></p>
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Прогресс по курсам</h2>
        <div className="h-64">
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Последние курсы</h2>
          {data.progress?.length ? (
            <ul className="space-y-3">
              {data.progress.slice(0, 5).map((p) => (
                <li key={p.id} className="flex justify-between items-center">
                  <Link to={`/courses/${p.course_id}`} className="text-violet-300 hover:underline">{p.course_title}</Link>
                  <span className="text-white/60">{p.progress_percent}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/50">Нет начатых курсов</p>
          )}
        </div>
      </div>
    </div>
  )
}
