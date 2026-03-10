/**
 * Контекст аутентификации
 */
import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../api/index.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      api.users.me()
        .then((r) => setUser(r.data.data))
        .catch(() => {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        })
        .finally(() => setLoading(false))
    } else setLoading(false)
  }, [])

  const login = async (email, password, companyId = null) => {
    const payload = { email, password }
  
    if (companyId) {
      payload.company_id = Number(companyId)
    }
  
    const { data } = await api.auth.login(payload)
  
    localStorage.setItem('accessToken', data.data.accessToken)
    localStorage.setItem('refreshToken', data.data.refreshToken)
    setUser(data.data.user)
    return data
  }

  const logout = async () => {
    const refresh = localStorage.getItem('refreshToken')
    if (refresh) {
      try { await api.auth.logout({ refresh_token: refresh }) } catch (e) {}
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const isAdmin = () => user && (user.role_name === 'super_admin' || user.role_name === 'company_admin')

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
