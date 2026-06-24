'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111110] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-widest uppercase text-[#6B6B65] mb-10 font-sans">
          Studio Access
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-transparent border-b border-[#333330] py-3 text-sm text-[#E8E8E4] font-sans placeholder-[#555550] focus:outline-none focus:border-[#6B7C9B] transition-colors duration-200"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-sans" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-xs tracking-widest uppercase font-sans text-[#111110] bg-[#E8E8E4] py-3 hover:bg-[#6B7C9B] hover:text-white transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
