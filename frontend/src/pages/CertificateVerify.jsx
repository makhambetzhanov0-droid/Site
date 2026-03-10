/**
 * Публичная страница проверки сертификата
 */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { certificates } from '../api/index.js'
import { Award, Check, X } from 'lucide-react'

export default function CertificateVerify() {
  const { uniqueId } = useParams()
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    certificates.verify(uniqueId).then((r) => setCert(r.data.data)).catch(() => { setCert(null); setError('Сертификат не найден') }).finally(() => setLoading(false))
  }, [uniqueId])

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60">Проверка...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-white/[0.03] border border-white/10">
        {cert ? (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/20 mx-auto mb-4">
              <Award className="w-8 h-8 text-violet-400" />
            </div>
            <h1 className="text-xl font-bold text-white text-center mb-6">Сертификат подтверждён</h1>
            <div className="space-y-2 text-white/80">
              <p><span className="text-white/50">ФИО:</span> {cert.full_name}</p>
              <p><span className="text-white/50">Курс:</span> {cert.course_title}</p>
              <p><span className="text-white/50">ID:</span> {cert.unique_id}</p>
              <p><span className="text-white/50">Выдан:</span> {new Date(cert.issued_at).toLocaleDateString('ru')}</p>
            </div>
            {cert.valid !== false && <p className="mt-4 flex items-center justify-center gap-2 text-green-400"><Check className="w-5 h-5" />Сертификат действителен</p>}
            {cert.valid === false && <p className="mt-4 flex items-center justify-center gap-2 text-red-400"><X className="w-5 h-5" />Сертификат истёк</p>}
          </>
        ) : (
          <div className="text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
