'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

export default function SeminarRegisterModal({
  open,
  onClose,
  priceLabel,
  seminarTitle,
  city,
}: {
  open: boolean
  onClose: () => void
  priceLabel: string
  seminarTitle: string
  city: string
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  const valid =
    form.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.trim().length >= 7

  /* Reset + animate in whenever the modal opens (sync to the `open` prop) */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) {
      setError('')
      setDone(false)
      setForm({ name: '', email: '', phone: '' })
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
    }
  }, [open])
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!open) return null

  const handlePay = async () => {
    if (!valid || loading) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/seminar/order', { method: 'POST', body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      if (!window.Razorpay) {
        setError('Payment is still loading. Please try again in a moment.')
        setLoading(false)
        return
      }
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Delta Trading Academy',
        description: `${seminarTitle} — ${city}`,
        image: 'https://deltatradinghub.com/logo.png',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#0f0e0c' },
        handler: async (response) => {
          const vr = await fetch('/api/seminar/verify', { method: 'POST', body: JSON.stringify(response) })
          const vd = await vr.json().catch(() => ({ verified: false }))
          if (vd.verified) {
            /* animated confirmation → auto-opens the invitation PDF */
            router.push(`/seminar/thank-you?order=${encodeURIComponent(data.orderId)}`)
            return
          }
          setError('Payment could not be verified. If you were charged, contact us and we’ll sort it out.')
          setLoading(false)
        },
        modal: { ondismiss: () => setLoading(false) },
      })
      rzp.open()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-nb"
      style={{
        background: 'rgba(10,8,6,0.52)',
        backdropFilter: 'blur(6px)',
        transition: 'opacity 320ms ease',
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="relative bg-white rounded-[24px] overflow-hidden w-full max-w-[440px] shadow-2xl"
        style={{
          maxHeight: '92vh',
          transition: 'transform 340ms cubic-bezier(.22,.68,0,1.2), opacity 320ms ease',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="flex flex-col p-9 max-md:p-7 overflow-y-auto">
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#0f0e0c] flex items-center justify-center hover:bg-[#2a2825] transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          {done ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#0f0e0c] flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <h3 className="text-[22px] text-black tracking-[-0.01em] mb-2">You&apos;re in! 🎉</h3>
              <p className="text-[13.5px] text-black/50 leading-[1.6] max-w-[280px]">
                Your seat for the {city} seminar is confirmed. We&apos;ll email the venue details shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-7 pr-8">
                <p className="text-[11.5px] text-black/35 tracking-[0.10em] uppercase mb-3">Reserve your seat</p>
                <h3 className="text-[26px] font-normal leading-[1.1] tracking-[-0.025em] text-black mb-2.5">
                  Join the {city} seminar
                </h3>
                <p className="text-[14px] text-black/50 leading-[1.6]">
                  Fill in your details and pay securely — you&apos;ll get instant confirmation.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handlePay() }} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">Full Name</label>
                  <input
                    type="text" required placeholder="e.g. Ahmed Al Mansoori"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">Email</label>
                  <input
                    type="email" required placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">Mobile Number</label>
                  <input
                    type="tel" required placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white"
                  />
                </div>

                {error && <p className="text-[12.5px] text-red-600 leading-[1.5]">{error}</p>}

                <button
                  type="submit"
                  disabled={!valid || loading}
                  className="w-full spotlight-btn spotlight-btn-gold bg-[#0f0e0c] text-white text-[14px] tracking-[0.005em] py-[15px] rounded-xl hover:bg-[#2a2825] transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing…' : `Pay ${priceLabel} & Join Seminar`}
                </button>
                <p className="text-[11.5px] text-black/30 text-center tracking-[0.003em]">
                  Secure payment via Razorpay · UPI, cards & netbanking
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
