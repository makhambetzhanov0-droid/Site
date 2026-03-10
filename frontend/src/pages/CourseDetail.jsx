/**
 * Детальная страница курса
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courses } from '../api/index.js'
import { BookOpen, Play } from 'lucide-react'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    courses.get(id)
      .then((r) => setCourse(r.data.data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false))
  }, [id])

  const completeCourse = async () => {
  try {
    await courses.complete(course.id)
    setProgress({ status: 'completed' })
  } catch (error) {
    console.error(error)
  }
}

  const handleStartTest = () => {
    if (course?.test_id) {
      navigate(`/tests/${course.test_id}`)
    }
  }

  if (loading || !course) return <div className="text-white/60">Загрузка...</div>

  return (
    <div>
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{course.title}</h1>
        </div>
        {course.description && (
          <p className="text-white/70 mb-4">{course.description}</p>
        )}
        <div className="flex flex-wrap gap-2 text-white/50 text-sm mb-6">
          {course.duration_minutes && <span>{course.duration_minutes} мин</span>}
          {course.category_name && <span>• {course.category_name}</span>}
          {course.passing_score != null && <span>• Проходной балл: {course.passing_score}%</span>}
        </div>
        {course.test_id ? (
          <button
            type="button"
            onClick={handleStartTest}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-semibold transition-colors"
          >
            <Play className="w-5 h-5" />
            Начать тест
          </button>
        ) : (
          <p className="text-white/50">Тест пока не доступен</p>
        )}
      </div>
    </div>
  )
}
