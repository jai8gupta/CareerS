# CareerSpeak

Production-oriented Next.js application for practising interviews and workplace English through short voice drills, structured AI feedback, and measurable progress.

## Stack

- Next.js App Router, React, TypeScript
- Supabase Auth + Postgres with row-level security
- OpenAI file transcription and structured feedback
- Razorpay Orders + Subscriptions for India-first billing
- Browser MediaRecorder with a typed-answer fallback

## Local setup

1. Copy `.env.example` to `.env.local` and add development credentials.
2. Create a Supabase project and run `supabase/migrations/001_initial.sql` in its SQL editor.
3. Keep `RAZORPAY_SUBSCRIPTIONS_ENABLED=false` while only ordinary payments are approved. All three paid plans will use one-time Orders.
4. Configure a Razorpay webhook at `/api/billing/webhook` for payment events. After Subscriptions approval, create monthly and annual plans, add their IDs, and set `RAZORPAY_SUBSCRIPTIONS_ENABLED=true`.
5. Install and run:

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. Without Supabase credentials the public pages still render, but authentication and protected features require configuration.

## Production checklist

- Use separate Supabase and Razorpay projects/keys for preview and production.
- Set all variables from `.env.example` in the deployment provider; never expose secret keys as `NEXT_PUBLIC_*`.
- Configure Supabase Site URL and redirect URLs for the production domain.
- Enable email confirmation, configure a branded transactional-email provider, and apply the browser-independent templates in [`docs/supabase-auth-email-templates.md`](docs/supabase-auth-email-templates.md).
- Review the funnel event contract in [`docs/analytics-events.md`](docs/analytics-events.md) and enable Vercel Web Analytics before evaluating conversion.
- Add the public HTTPS webhook URL in Razorpay and subscribe to `payment.captured`, `subscription.authenticated`, `subscription.activated`, `subscription.charged`, `subscription.completed`, `subscription.cancelled`, `subscription.paused`, and `subscription.halted`.
- Complete Razorpay individual/freelancer KYC and switch from Test Mode to Live Mode.
- Replace placeholder support and legal contact details before accepting payments.
- Add distributed rate limiting (Upstash/Cloudflare) before meaningful paid traffic; the included application quota is enforced in Postgres.
- Run `npm run typecheck`, `npm run lint`, and `npm run build` in CI.

## Pricing strategy

- Free: 3 complete AI reviews per calendar month
- Interview Sprint: ₹39 once, 10 reviews for 7 days
- Pro Monthly: ₹79 for 30 days, 25 reviews
- Pro Annual: ₹599 for 365 days, 25 reviews per calendar month

The one-week Sprint captures urgent interview intent without forcing a subscription. Until Razorpay Subscriptions is approved, Monthly and Annual are one-time passes with manual renewal. Usage limits protect voice-inference margins.
