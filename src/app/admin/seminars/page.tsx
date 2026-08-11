'use client'

import { useCallback, useEffect, useState } from 'react'

const KEY_STORE = 'admin-key'
const LIMIT = 25

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
interface Stats { totalLeads: number; paid: number; revenue: number }

const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN')
const fmt = (d?: string) =>
  d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

export default function AdminSeminarsPage() {
  const [adminKey, setAdminKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [authed, setAuthed] = useState(false)

  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState<Stats>({ totalLeads: 0, paid: 0, revenue: 0 })

  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<'all' | 'created' | 'paid'>('all')
  const [q, setQ] = useState('')
  const [qInput, setQInput] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(
    async (key: string, p: number, st: string, query: string) => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams({ page: String(p), limit: String(LIMIT), status: st, q: query })
        const res = await fetch(`/api/admin/registrations?${params.toString()}`, {
          headers: { 'x-admin-key': key },
        })
        const data = await res.json().catch(() => ({}))
        if (res.status === 401) {
          setError('Wrong password.')
          setAuthed(false)
          setAdminKey('')
          sessionStorage.removeItem(KEY_STORE)
          return
        }
        if (!res.ok) {
          setError(data.error || 'Could not load data.')
          setRows([])
          return
        }
        setRows(data.rows || [])
        setTotal(data.total || 0)
        setStats(data.stats || { totalLeads: 0, paid: 0, revenue: 0 })
        sessionStorage.setItem(KEY_STORE, key)
      } catch {
        setError('Network error.')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  /* Resume session on mount if a key was already entered */
  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORE)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) { setAdminKey(saved); setAuthed(true) }
  }, [])

  /* Debounce the search box → q (and reset to page 1) */
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(qInput.trim())
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [qInput])

  /* Fetch whenever the key, page, status or search changes (syncs server data) */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (adminKey) fetchData(adminKey, page, status, q)
  }, [adminKey, page, status, q, fetchData])

  const logout = () => {
    sessionStorage.removeItem(KEY_STORE)
    setAuthed(false)
    setAdminKey('')
    setKeyInput('')
    setRows([])
    setPage(1)
    setStatus('all')
    setQ('')
    setQInput('')
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

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
              if (keyInput.trim()) { setAdminKey(keyInput.trim()); setAuthed(true) }
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="password"
              placeholder="Admin password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              autoFocus
              className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-white/40"
            />
            {error && <p className="text-red-400 text-[12.5px]">{error}</p>}
            <button
              type="submit"
              disabled={loading || !keyInput.trim()}
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
            <a
              href="/admin/payment-links"
              className="text-white/45 text-[13px] px-3 py-2 hover:text-white transition-colors"
            >
              Payment links →
            </a>
            <button
              onClick={() => fetchData(adminKey, page, status, q)}
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

        {/* Stats (global) */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {[
            { label: 'Total leads', value: stats.totalLeads },
            { label: 'Paid', value: stats.paid },
            { label: 'Revenue', value: inr(stats.revenue) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
              <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase mb-2">{s.label}</p>
              <p className="text-[26px] md:text-[30px] tracking-[-0.02em]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Search name, email, phone, order id…"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            className="flex-1 min-w-[220px] bg-white/[0.05] border border-white/12 rounded-full px-4 py-2.5 text-[13.5px] text-white placeholder:text-white/30 outline-none focus:border-white/35"
          />
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/12 rounded-full p-1">
            {(['all', 'paid', 'created'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1) }}
                className={[
                  'text-[12.5px] px-3.5 py-1.5 rounded-full transition-colors capitalize',
                  status === s ? 'bg-[#d4af37] text-[#0f0e0c]' : 'text-white/60 hover:text-white',
                ].join(' ')}
              >
                {s === 'created' ? 'Pending' : s}
              </button>
            ))}
          </div>
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
                    {q || status !== 'all' ? 'No matching registrations.' : 'No registrations yet.'}
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

        {/* Pagination */}
        <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
          <p className="text-white/35 text-[12.5px]">
            {total === 0
              ? 'No results'
              : `${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} of ${total}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="bg-white/[0.06] border border-white/12 text-white/80 text-[13px] px-4 py-2 rounded-full hover:bg-white/[0.12] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="text-white/50 text-[12.5px] tabular-nums px-1">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="bg-white/[0.06] border border-white/12 text-white/80 text-[13px] px-4 py-2 rounded-full hover:bg-white/[0.12] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
