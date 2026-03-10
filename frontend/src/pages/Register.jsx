/**
 * Страница регистрации
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../api/index.js'
import { Shield } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.register(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-xl">
            <Shield className="w-10 h-10 text-violet-400" />
            OHS Enterprise
          </Link>
          <p className="text-white/60 mt-2">Регистрация</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/[0.03] border border-white/10">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">ФИО</label>
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Иван Иванов" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="email@company.ru" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Пароль (мин. 8 символов)</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold hover:opacity-90 disabled:opacity-50">
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          <p className="mt-4 text-center text-white/50 text-sm">
            Есть аккаунт? <Link to="/login" className="text-violet-400 hover:underline">Вход</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
