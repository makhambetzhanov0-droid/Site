/**
 * OHS Enterprise — Точка входа приложения
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import TestPage from './pages/TestPage.jsx'
import Certificates from './pages/Certificates.jsx'
import CertificateVerify from './pages/CertificateVerify.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminAnalytics from './pages/AdminAnalytics.jsx'
import AdminAudit from './pages/AdminAudit.jsx'
import AdminCompanies from './pages/AdminCompanies.jsx'
import { Shield } from 'lucide-react'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60">Загрузка...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function Home() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-3xl mb-4">
          <Shield className="w-12 h-12 text-violet-400" />
          OHS Enterprise
        </div>
        <p className="text-white/70 text-lg mb-8">Платформа обучения и сертификации по охране труда</p>
        <div className="flex gap-4 justify-center">
          <a href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity">Вход</a>
          <a href="/register" className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">Регистрация</a>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/certificates/verify/:uniqueId" element={<CertificateVerify />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="tests/:id" element={<TestPage />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/analytics" element={<AdminAnalytics />} />
            <Route path="admin/audit" element={<AdminAudit />} />
            <Route path="admin/companies" element={<AdminCompanies />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
