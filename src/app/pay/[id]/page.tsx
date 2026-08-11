'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Script from 'next/script'

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  image?: string
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
  handler: (r: RazorpayResponse) => void
  modal?: { ondismiss?: () => void }
}
interface RazorpayInstance { open: () => void }
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface LinkInfo {
  description: string
  baseAmount: number
  gstPct: number
  gstAmount: number
  totalAmount: number
  status: 'pending' | 'paid'
}

const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN')

export default function PaymentLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [link, setLink] = useState<LinkInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    fetch(`/api/payment-links/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: LinkInfo) => {
        if (!alive) return
        if (data.status === 'paid') { router.replace(`/pay/${id}/thank-you`); return }
        setLink(data)
      })
      .catch(() => { if (alive) setNotFound(true) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [id, router])

  const valid =
    form.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.trim().length >= 7

  const handlePay = async () => {
    if (!valid || paying || !link) return
    setError('')
    setPaying(true)
    try {
      const res = await fetch(`/api/payment-links/${id}/order`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.alreadyPaid) { router.push(`/pay/${id}/thank-you`); return }
        setError(data.error || 'Something went wrong. Please try again.')
        setPaying(false)
        return
      }
      if (!window.Razorpay) {
        setError('Payment is still loading. Please try again in a moment.')
        setPaying(false)
        return
      }
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Delta Trading Academy',
        description: link.description,
        image: 'https://deltatradinghub.com/logo.png',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#0f0e0c' },
        handler: async (response) => {
          const vr = await fetch(`/api/payment-links/${id}/verify`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(response),
          })
          const vd = await vr.json().catch(() => ({ verified: false }))
          if (vd.verified) { router.push(`/pay/${id}/thank-you`); return }
          setError('Payment could not be verified. If you were charged, contact us and we’ll sort it out.')
          setPaying(false)
        },
        modal: { ondismiss: () => setPaying(false) },
      })
      rzp.open()
    } catch {
      setError('Network error. Please try again.')
      setPaying(false)
    }
  }

  return (
    <main className="min-h-[100svh] bg-[#f7f6f3] font-nb flex items-center justify-center px-6 py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="w-full max-w-[460px]">
        <div className="flex justify-center mb-2">
          <div className="bg-[#0f0e0c] rounded-2xl px-7 py-4 w-full flex items-center justify-center">
            <Image src="/logo.png" alt="Delta Trading Academy" width={140} height={42} className="h-8 w-auto object-contain" priority />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-[24px] p-8 text-center text-black/40 text-[14px]">Loading…</div>
        ) : notFound ? (
          <div className="bg-white rounded-[24px] p-8 text-center">
            <p className="text-[18px] text-black tracking-[-0.01em] mb-2">Link not found</p>
            <p className="text-[13.5px] text-black/45 leading-[1.6]">
              This payment link is invalid or no longer active. Please check the link or contact us for a new one.
            </p>
          </div>
        ) : link ? (
          <div className="bg-white rounded-[24px] overflow-hidden">
            <div className="p-8 pb-6">
              <p className="text-[11.5px] text-black/35 tracking-[0.10em] uppercase mb-2">Course Payment</p>
              <h1 className="text-[24px] font-normal leading-[1.15] tracking-[-0.02em] text-black mb-6">
                {link.description}
              </h1>

              {/* ── GST breakdown ── */}
              <div className="rounded-2xl bg-black/[0.03] border border-black/[0.06] px-5 py-4 mb-6">
                <div className="flex items-center justify-between text-[14px] text-black/70 py-1">
                  <span>Amount</span>
                  <span className="tabular-nums">{inr(link.baseAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-black/45 py-1">
                  <span>+{link.gstPct}% GST</span>
                  <span className="tabular-nums">{inr(link.gstAmount)}</span>
                </div>
                <div className="h-px bg-black/[0.08] my-2.5" />
                <div className="flex items-center justify-between text-[16px] text-black">
                  <span>Total</span>
                  <span className="tabular-nums font-medium">{inr(link.totalAmount)}</span>
                </div>
              </div>

              {/* ── Customer details ── */}
              <form onSubmit={(e) => { e.preventDefault(); handlePay() }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">Full Name</label>
                  <input
                    type="text" required placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">Email</label>
                  <input
                    type="email" required placeholder="e.g. rahul.sharma@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">Mobile Number</label>
                  <input
                    type="tel" required placeholder="e.g. +91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white"
                  />
                </div>

                {error && <p className="text-red-500 text-[12.5px]">{error}</p>}

                <button
                  type="submit"
                  disabled={!valid || paying}
                  className="w-full bg-[#0f0e0c] text-white text-[14.5px] tracking-[0.005em] py-[15px] rounded-xl hover:bg-[#2a2825] transition-colors mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {paying ? 'Processing…' : `Pay ${inr(link.totalAmount)}`}
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
