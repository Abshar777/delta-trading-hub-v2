'use client'

import { useCallback, useEffect, useState } from 'react'

const KEY_STORE = 'admin-key'

interface Row {
  name: string
  email: string
  phone: string
  seminar: string
  amount: number
  currency: string
  orderId: string
  paymentId?: string
  status: 'created' | 'paid'
  createdAt: string
  paidAt?: string
}

const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN')
const fmt = (d?: string) =>
  d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

export default function AdminSeminarsPage() {
  const [key, setKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (adminKey: string) => {
    setKey(adminKey)
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/registrations', { headers: { 'x-admin-key': adminKey } })
      const data = await res.json().catch(() => ({}))
      if (res.status === 401) {
        setError('Wrong password.')
        setAuthed(false)
        sessionStorage.removeItem(KEY_STORE)
        return
      }
      if (!res.ok) {
        setError(data.error || 'Could not load data.')
        setAuthed(true)
        setRows([])
        return
      }
      setRows(data.registrations || [])
      setAuthed(true)
      sessionStorage.setItem(KEY_STORE, adminKey)
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }, [])

  /* Resume session if a key was already entered */
  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORE)
    // Resume the admin session on mount if a key was already entered.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) load(saved)
  }, [load])

  const logout = () => {
    sessionStorage.removeItem(KEY_STORE)
    setAuthed(false)
    setRows([])
    setKey('')
  }

  const paidRows = rows.filter((r) => r.status === 'paid')
  const revenue = paidRows.reduce((s, r) => s + r.amount, 0)

  /* ── Login gate ── */
  if (!authed) {
    return (
      <main className="min-h-[100svh] bg-[#0b0a08] font-nb flex items-center justify-center px-6">
        <div className="w-full max-w-[360px]">
          <h1 className="text-white text-[22px] tracking-[-0.01em] mb-1">Admin · Seminars</h1>
          <p className="text-white/45 text-[13px] mb-6">Enter the admin password to view registrations.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (key.trim()) load(key.trim())
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="password"
              placeholder="Admin password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoFocus
              className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-white/40"
            />
            {error && <p className="text-red-400 text-[12.5px]">{error}</p>}
            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="bg-[#d4af37] text-[#0f0e0c] text-[14px] py-3 rounded-xl hover:bg-[#e6c14e] transition-colors disabled:opacity-50"
            >
              {loading ? 'Checking…' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  /* ── Dashboard ── */
  return (
    <main className="min-h-[100svh] bg-[#0b0a08] font-nb text-white px-5 md:px-10 py-8">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-[22px] tracking-[-0.01em]">Seminar Registrations</h1>
            <p className="text-white/45 text-[13px] mt-0.5">Bangalore seminar · live data</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => load(key)}
              className="bg-white/[0.08] border border-white/15 text-white/85 text-[13px] px-4 py-2 rounded-full hover:bg-white/[0.14] transition-colors"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              onClick={logout}
              className="text-white/45 text-[13px] px-3 py-2 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          {[
            { label: 'Total leads', value: rows.length },
            { label: 'Paid', value: paidRows.length },
            { label: 'Revenue', value: inr(revenue) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
              <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase mb-2">{s.label}</p>
              <p className="text-[26px] md:text-[30px] tracking-[-0.02em]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[820px]">
            <thead>
              <tr className="bg-white/[0.04] text-white/45 text-[11px] tracking-[0.08em] uppercase">
                <th className="px-4 py-3 font-normal">Date</th>
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Phone</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Amount</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Payment</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-white/40">
                    No registrations yet.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={r.orderId + i} className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3 text-white/90">{r.name || '—'}</td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{r.phone || '—'}</td>
                  <td className="px-4 py-3 text-white/60">{r.email || '—'}</td>
                  <td className="px-4 py-3 text-white/80 whitespace-nowrap">{inr(r.amount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        'inline-block px-2.5 py-0.5 rounded-full text-[11px]',
                        r.status === 'paid'
                          ? 'bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/25'
                          : 'bg-white/[0.06] text-white/50 border border-white/10',
                      ].join(' ')}
                    >
                      {r.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 font-mono text-[11.5px] whitespace-nowrap">
                    {r.paymentId || r.orderId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-white/25 text-[11.5px] mt-4">
          Showing latest {rows.length} registration{rows.length === 1 ? '' : 's'}.
        </p>
      </div>
    </main>
  )
}
