/**
 * Страница теста — вопросы с радио-ответами
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tests } from '../api/index.js'

export default function TestPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    tests.getQuestions(id)
      .then((r) => setQuestions(r.data.data || []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false))
  }, [id])

  const handleAnswer = (qIdx, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleSubmit = () => {
    const answerList = questions.map((_, qIdx) => answers[qIdx] ?? -1)
    setSubmitting(true)
    tests
      .submit(id, {
        answers: answerList,
        time_spent_seconds: 0,
      })
      .then((r) => {
        const result = r.data.data
        if (result?.passed) {
          navigate('/certificates')
        } else {
          navigate('/courses')
        }
      })
      .catch(() => setSubmitting(false))
      .finally(() => setSubmitting(false))
  }

  if (loading) return <div className="text-white/60">Загрузка...</div>

  const answeredCount = Object.keys(answers).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Тест</h1>
      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div
            key={q.id ?? qIdx}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
          >
            <p className="text-white font-medium mb-4">
              {qIdx + 1}. {q.question_text}
            </p>
            <div className="space-y-2">
              {(q.options || []).map((opt, optIdx) => (
                <label
                  key={optIdx}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    answers[qIdx] === optIdx
                      ? 'bg-violet-500/20 border border-violet-500/50'
                      : 'bg-white/[0.03] border border-transparent hover:bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${qIdx}`}
                    checked={answers[qIdx] === optIdx}
                    onChange={() => handleAnswer(qIdx, optIdx)}
                    className="w-4 h-4 text-violet-500"
                  />
                  <span className="text-white/90">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      {questions.length > 0 && (
        <div className="mt-8 flex items-center justify-between">
          <span className="text-white/60">
            Отвечено: {answeredCount} из {questions.length}
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            {submitting ? 'Отправка...' : 'Отправить тест'}
          </button>
        </div>
      )}
      {questions.length === 0 && (
        <p className="text-white/50 text-center py-12">Нет вопросов в тесте</p>
      )}
    </div>
  )
}
