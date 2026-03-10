import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { LayoutDashboard, BookOpen, Award, BarChart3, FileText, Users, Building2, Menu, X, LogOut, Shield } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { path: '/courses', label: 'Курсы', icon: BookOpen },
  { path: '/certificates', label: 'Сертификаты', icon: Award },
]

const adminItems = [
  { path: '/admin/dashboard', label: 'Админ-дашборд', icon: BarChart3 },
  { path: '/admin/users', label: 'Сотрудники', icon: Users },
  { path: '/admin/analytics', label: 'Аналитика', icon: BarChart3 },
  { path: '/admin/audit', label: 'Аудит', icon: FileText },
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setSidebarOpen((s) => !s)} className="lg:hidden p-2">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Shield className="w-8 h-8 text-violet-400" />
            OHS Enterprise
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm hidden sm:block">{user?.full_name}</span>
          <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs">{user?.role_name}</span>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Выход</span>
          </button>
        </div>
      </nav>
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white/[0.03] border-r border-white/10 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 space-y-2">
          {navItems.map((n) => (
            <Link key={n.path} to={n.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === n.path ? 'bg-violet-500/20 text-violet-300' : 'hover:bg-white/5 text-white/80'}`}>
              <n.icon className="w-5 h-5 shrink-0" />
              {n.label}
            </Link>
          ))}
          {isAdmin() && adminItems.map((n) => (
            <Link key={n.path} to={n.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === n.path ? 'bg-violet-500/20 text-violet-300' : 'hover:bg-white/5 text-white/80'}`}>
              <n.icon className="w-5 h-5 shrink-0" />
              {n.label}
            </Link>
          ))}
          {user?.role_name === 'super_admin' && (
            <Link to="/admin/companies" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80">
              <Building2 className="w-5 h-5 shrink-0" />
              Компании
            </Link>
          )}
        </div>
      </aside>
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
