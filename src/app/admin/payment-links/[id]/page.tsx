'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

const KEY_STORE = 'admin-key'
const HUB = 'https://deltatradinghub.com'

interface PaymentLink {
  linkId: string
  description: string
  baseAmount: number
  gstPct: number
  gstAmount: number
  totalAmount: number
  status: 'pending' | 'paid'
  orderId?: string
  paymentId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  createdAt: string
  paidAt?: string
}

const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN')
const fmt = (d?: string) =>
  d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

export default function AdminPaymentLinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [adminKey, setAdminKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')

  const [link, setLink] = useState<PaymentLink | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const fetchLink = useCallback(async (key: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/payment-links/${id}`, { headers: { 'x-admin-key': key } })
      const data = await res.json().catch(() => ({}))
      if (res.status === 401) {
        setAuthError('Wrong password.')
        setAuthed(false)
        setAdminKey('')
        sessionStorage.removeItem(KEY_STORE)
        return
      }
      if (!res.ok) {
        setError(data.error || 'Could not load this payment link.')
        return
      }
      setLink(data.link)
      sessionStorage.setItem(KEY_STORE, key)
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }, [id])

  /* Resume session if a key was already entered (shared with /admin/payment-links) */
  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORE)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) { setAdminKey(saved); setAuthed(true) }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (adminKey) fetchLink(adminKey)
  }, [adminKey, fetchLink])

  const linkUrl = link ? `${HUB}/pay/${link.linkId}` : ''
  const copyLink = async () => {
    if (!linkUrl) return
    try {
      await navigator.clipboard.writeText(linkUrl)
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
          <p className="text-white/45 text-[13px] mb-6">Enter the admin password to view this link.</p>
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

  return (
    <main className="min-h-[100svh] bg-[#0b0a08] font-nb text-white px-5 md:px-10 py-8">
      <div className="max-w-[720px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <Link href="/admin/payment-links" className="text-white/45 text-[13px] hover:text-white transition-colors">
            ← All payment links
          </Link>
          <button
            onClick={() => fetchLink(adminKey)}
            className="bg-white/[0.08] border border-white/15 text-white/85 text-[13px] px-4 py-2 rounded-full hover:bg-white/[0.14] transition-colors"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
            {error}
          </div>
        )}

        {loading && !link && <p className="text-white/40 text-[13.5px]">Loading…</p>}

        {link && (
          <>
            {/* Title + status */}
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
              <div>
                <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase mb-2">Payment link</p>
                <h1 className="text-[24px] tracking-[-0.01em]">{link.description}</h1>
              </div>
              <span
                className={[
                  'inline-block px-3 py-1 rounded-full text-[12px] whitespace-nowrap',
                  link.status === 'paid'
                    ? 'bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/25'
                    : 'bg-white/[0.06] text-white/50 border border-white/10',
                ].join(' ')}
              >
                {link.status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>

            {/* Amount breakdown */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 md:p-6 mb-5">
              <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase mb-4">Amount</p>
              <div className="flex items-center justify-between text-[14px] text-white/70 py-1">
                <span>Amount</span>
                <span className="tabular-nums">{inr(link.baseAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-white/45 py-1">
                <span>+{link.gstPct}% GST</span>
                <span className="tabular-nums">{inr(link.gstAmount)}</span>
              </div>
              <div className="h-px bg-white/10 my-2.5" />
              <div className="flex items-center justify-between text-[16px] text-white">
                <span>Total</span>
                <span className="tabular-nums font-medium">{inr(link.totalAmount)}</span>
              </div>
            </div>

            {/* Customer */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 md:p-6 mb-5">
              <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase mb-4">Customer</p>
              {link.customerName ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[11px] text-white/35 uppercase tracking-[0.06em] mb-1">Name</p>
                    <p className="text-[14px] text-white/90">{link.customerName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/35 uppercase tracking-[0.06em] mb-1">Email</p>
                    <p className="text-[14px] text-white/90 break-all">{link.customerEmail || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/35 uppercase tracking-[0.06em] mb-1">Phone</p>
                    <p className="text-[14px] text-white/90">{link.customerPhone || '—'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[13.5px] text-white/40">
                  No customer yet — they&apos;ll appear here once the link is opened and checkout starts.
                </p>
              )}
            </div>

            {/* Payment info */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 md:p-6 mb-5">
              <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase mb-4">Payment</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-white/35 uppercase tracking-[0.06em] mb-1">Created</p>
                  <p className="text-[14px] text-white/90">{fmt(link.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/35 uppercase tracking-[0.06em] mb-1">Paid at</p>
                  <p className="text-[14px] text-white/90">{fmt(link.paidAt)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/35 uppercase tracking-[0.06em] mb-1">Order ID</p>
                  <p className="text-[13px] text-white/70 font-mono break-all">{link.orderId || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/35 uppercase tracking-[0.06em] mb-1">Payment ID</p>
                  <p className="text-[13px] text-white/70 font-mono break-all">{link.paymentId || '—'}</p>
                </div>
              </div>
            </div>

            {/* Link + actions */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/[0.08] p-5 md:p-6 flex items-center gap-3 flex-wrap">
              <span className="text-[13px] text-white/85 font-mono break-all">{linkUrl}</span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={copyLink}
                  className="bg-[#d4af37] text-[#0f0e0c] text-[12.5px] px-3.5 py-1.5 rounded-full hover:bg-[#e6c14e] transition-colors whitespace-nowrap"
                >
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
                {link.status === 'paid' && (
                  <a
                    href={`/api/payment-links/${link.linkId}/receipt`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/[0.08] border border-white/15 text-white/85 text-[12.5px] px-3.5 py-1.5 rounded-full hover:bg-white/[0.14] transition-colors whitespace-nowrap"
                  >
                    View receipt
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
