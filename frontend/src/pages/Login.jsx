import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Shield } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа')
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
          <p className="text-white/60 mt-2">Вход в систему</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/[0.03] border border-white/10">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="email@company.ru" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold disabled:opacity-50">
            {loading ? 'Вход...' : 'Войти'}
          </button>
          <p className="mt-4 text-center text-white/50 text-sm">
            Нет аккаунта? <Link to="/register" className="text-violet-400">Регистрация</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
