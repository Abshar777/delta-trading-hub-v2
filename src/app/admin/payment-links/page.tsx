'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const KEY_STORE = 'admin-key'
const HUB = 'https://deltatradinghub.com'
const GST_PCT = 18

interface PaymentLink {
  linkId: string
  description: string
  baseAmount: number
  gstPct: number
  gstAmount: number
  totalAmount: number
  status: 'pending' | 'paid'
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  createdAt: string
  paidAt?: string
}

const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN')
const fmt = (d?: string) =>
  d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

export default function AdminPaymentLinksPage() {
  const [adminKey, setAdminKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')

  const [rows, setRows] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState('')

  const [description, setDescription] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [justCreated, setJustCreated] = useState<PaymentLink | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchRows = useCallback(async (key: string) => {
    setLoading(true)
    setListError('')
    try {
      const res = await fetch('/api/admin/payment-links', { headers: { 'x-admin-key': key } })
      const data = await res.json().catch(() => ({}))
      if (res.status === 401) {
        setAuthError('Wrong password.')
        setAuthed(false)
        setAdminKey('')
        sessionStorage.removeItem(KEY_STORE)
        return
      }
      if (!res.ok) {
        setListError(data.error || 'Could not load payment links.')
        return
      }
      setRows(data.rows || [])
      sessionStorage.setItem(KEY_STORE, key)
    } catch {
      setListError('Network error.')
    } finally {
      setLoading(false)
    }
  }, [])

  /* Resume session if a key was already entered (shared with /admin/seminars) */
  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORE)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) { setAdminKey(saved); setAuthed(true) }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (adminKey) fetchRows(adminKey)
  }, [adminKey, fetchRows])

  const logout = () => {
    sessionStorage.removeItem(KEY_STORE)
    setAuthed(false)
    setAdminKey('')
    setKeyInput('')
    setRows([])
  }

  /* Live breakdown as the admin types the amount */
  const breakdown = useMemo(() => {
    const rupees = Number(amountInput)
    if (!Number.isFinite(rupees) || rupees <= 0) return null
    const base = Math.round(rupees * 100)
    const gst = Math.round((base * GST_PCT) / 100)
    return { base, gst, total: base + gst }
  }, [amountInput])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!breakdown || creating) return
    setCreating(true)
    setCreateError('')
    setJustCreated(null)
    setCopied(false)
    try {
      const res = await fetch('/api/admin/payment-links', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey, 'content-type': 'application/json' },
        body: JSON.stringify({ description, amount: Number(amountInput) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCreateError(data.error || 'Could not create the link.')
        return
      }
      setJustCreated(data.link)
      setRows((prev) => [data.link, ...prev])
      setDescription('')
      setAmountInput('')
    } catch {
      setCreateError('Network error.')
    } finally {
      setCreating(false)
    }
  }

  const linkUrl = (linkId: string) => `${HUB}/pay/${linkId}`

  const copyLink = async (linkId: string) => {
    try {
      await navigator.clipboard.writeText(linkUrl(linkId))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable — ignore */ }
  }

  /* ── Login gate ── */
  if (!authed) {
    return (
      <main className="min-h-[100svh] bg-[#0b0a08] font-nb flex items-center justify-center px-6">
        <div className="w-full max-w-[360px]">
          <h1 className="text-white text-[22px] tracking-[-0.01em] mb-1">Admin · Payment Links</h1>
          <p className="text-white/45 text-[13px] mb-6">Enter the admin password to generate payment links.</p>
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
            {authError && <p className="text-red-400 text-[12.5px]">{authError}</p>}
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
            <h1 className="text-[22px] tracking-[-0.01em]">Payment Links</h1>
            <p className="text-white/45 text-[13px] mt-0.5">Generate a course payment link · amount + 18% GST</p>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href="/admin/seminars"
              className="text-white/45 text-[13px] px-3 py-2 hover:text-white transition-colors"
            >
              Seminar registrations →
            </a>
            <button
              onClick={() => fetchRows(adminKey)}
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

        {listError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
            {listError}
          </div>
        )}

        {/* ── Create link ── */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 md:p-6 mb-8">
          <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase mb-4">Generate a new link</p>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-white/40 tracking-[0.06em] uppercase">Course / Description</label>
              <input
                type="text"
                placeholder="e.g. Advanced Forex Mastery Course"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/12 rounded-xl px-4 py-2.5 text-[13.5px] text-white placeholder:text-white/25 outline-none focus:border-white/35"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-white/40 tracking-[0.06em] uppercase">Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="15000"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                required
                className="w-full bg-white/[0.05] border border-white/12 rounded-xl px-4 py-2.5 text-[13.5px] text-white placeholder:text-white/25 outline-none focus:border-white/35 tabular-nums"
              />
            </div>
            <button
              type="submit"
              disabled={!breakdown || creating}
              className="bg-[#d4af37] text-[#0f0e0c] text-[13.5px] px-6 py-2.5 rounded-xl hover:bg-[#e6c14e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {creating ? 'Generating…' : 'Generate Link'}
            </button>
          </form>

          {/* live breakdown */}
          {breakdown && (
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-[13.5px] text-white/70 tabular-nums">
              <span>{inr(breakdown.base)}</span>
              <span className="text-white/40">+18% GST ({inr(breakdown.gst)})</span>
              <span className="text-white/25">—</span>
              <span className="text-white text-[15px]">{inr(breakdown.total)} total</span>
            </div>
          )}

          {createError && <p className="text-red-400 text-[12.5px] mt-3">{createError}</p>}

          {justCreated && (
            <div className="mt-4 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/[0.08] px-4 py-3 flex items-center gap-3 flex-wrap">
              <span className="text-[13px] text-white/85 font-mono break-all">{linkUrl(justCreated.linkId)}</span>
              <button
                onClick={() => copyLink(justCreated.linkId)}
                className="ml-auto bg-[#d4af37] text-[#0f0e0c] text-[12.5px] px-3.5 py-1.5 rounded-full hover:bg-[#e6c14e] transition-colors whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          )}
        </div>

        {/* ── List ── */}
        <div className="rounded-2xl border border-white/10 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[920px]">
            <thead>
              <tr className="bg-white/[0.04] text-white/45 text-[11px] tracking-[0.08em] uppercase">
                <th className="px-4 py-3 font-normal">Created</th>
                <th className="px-4 py-3 font-normal">Description</th>
                <th className="px-4 py-3 font-normal">Amount</th>
                <th className="px-4 py-3 font-normal">GST</th>
                <th className="px-4 py-3 font-normal">Total</th>
                <th className="px-4 py-3 font-normal">Customer</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Link</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-white/40">
                    No payment links yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.linkId} className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3 text-white/85 max-w-[220px] truncate">{r.description || '—'}</td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap tabular-nums">{inr(r.baseAmount)}</td>
                  <td className="px-4 py-3 text-white/50 whitespace-nowrap tabular-nums">{inr(r.gstAmount)}</td>
                  <td className="px-4 py-3 text-white/90 whitespace-nowrap tabular-nums">{inr(r.totalAmount)}</td>
                  <td className="px-4 py-3 text-white/60">
                    {r.customerName
                      ? <div><p className="text-white/80">{r.customerName}</p><p className="text-[11.5px] text-white/40">{r.customerEmail} · {r.customerPhone}</p></div>
                      : '—'}
                  </td>
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copyLink(r.linkId)}
                      className="text-white/45 hover:text-white text-[12px] px-2.5 py-1 rounded-full border border-white/12 hover:border-white/30 transition-colors whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
