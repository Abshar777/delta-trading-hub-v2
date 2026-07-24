This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Seminar payments (Razorpay)

The Bangalore seminar page (`/seminar`) takes payments via Razorpay.

1. Get your keys from the [Razorpay Dashboard → API Keys](https://dashboard.razorpay.com/app/keys) (use `rzp_test_*` while testing).
2. Add them to `.env.local` (already scaffolded; not committed):

   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_here
   ```

3. Restart the dev server. Until keys are set, the "Pay & Join" button shows a
   "payments not set up yet" message instead of crashing.

- Ticket price is set in `src/app/api/seminar/order/route.ts` (`SEMINAR_AMOUNT`, in paise — ₹299 = 29900).
- Seminar details (date, venue, price label, agenda) are placeholders in `src/app/seminar/page.tsx`.
- Payment signature is verified server-side in `src/app/api/seminar/verify/route.ts`.

## Seminar registrations (MongoDB + admin portal)

Every seminar registration is stored in MongoDB (`registrations` collection):
- On payment order creation → record saved with `status: "created"`.
- On verified payment → same record updated to `status: "paid"` + `paymentId`.

**Setup** — add to `.env.local`:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
MONGODB_DB=delta
ADMIN_PASSWORD=choose-a-strong-password
```

**Admin portal:** visit `/admin/seminars`, enter `ADMIN_PASSWORD`, and view all
registrations (name, phone, email, amount, status, payment id) with totals/revenue.

- Persistence is best-effort: if `MONGODB_URI` is unset, payments still work — records just aren't saved.
- The admin gate is a simple password check (server-verified, constant-time). For production, consider a proper auth provider.
- All backend logic lives in this app: `src/lib/mongodb.ts`, `src/lib/registrations.ts`, `src/app/api/seminar/*`, `src/app/api/admin/registrations`.
