'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'

interface LinkInfo {
  description: string
  baseAmount: number
  gstPct: number
  gstAmount: number
  totalAmount: number
  status: 'pending' | 'paid'
}

const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN')

export default function PaymentThankYouPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [link, setLink] = useState<LinkInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetch(`/api/payment-links/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (alive) setLink(data) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [id])

  const receiptUrl = `/api/payment-links/${id}/receipt`

  return (
    <main className="min-h-[100svh] bg-[#f7f6f3] font-nb flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[460px]">
        <div className="flex justify-center mb-2">
          <div className="bg-[#0f0e0c] rounded-2xl px-7 py-4 w-full flex items-center justify-center">
            <Image src="/logo.png" alt="Delta Trading Academy" width={140} height={42} className="h-8 w-auto object-contain" priority />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M4 10l4.5 4.5L16 6" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-[22px] text-black tracking-[-0.01em] mb-2">Payment successful</h1>

          {!loading && link && (
            <p className="text-[13.5px] text-black/45 leading-[1.65] mb-1">
              {inr(link.totalAmount)} received for <span className="text-black/70">{link.description}</span>
            </p>
          )}
          <p className="text-[13.5px] text-black/45 leading-[1.65] mb-7">
            A confirmation email with your receipt is on its way to your inbox.
          </p>

          <a
            href={receiptUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#0f0e0c] text-white text-[14px] tracking-[0.005em] px-7 py-[13px] rounded-full hover:bg-[#2a2825] transition-colors"
          >
            View receipt
            <span className="text-[11px]">→</span>
          </a>
        </div>
      </div>
    </main>
  )
}
