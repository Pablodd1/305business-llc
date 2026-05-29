For a marketplace like 305business, you need **recurring billing** (monthly featured listings), **marketplace splits** (you take a cut of sale), and **large transaction support** (businesses sell for $50K-$5M). Here's the real breakdown:

## 💳 Best Options

| Platform | Fee | Best For | Caveat |
|----------|-----|----------|--------|
| **Stripe** | 2.9% + 30¢ / 0.8% ACH | Everything | Industry standard, subscriptions built-in |
| **Stripe + Connect** | 2.9% + platform fee % | Marketplace splits | Best for broker payouts |
| **Lemon Squeezy** | 5% + 50¢ | SaaS / No tax headache | Handles all sales tax/VAT automatically |
| **Mercury** | Free transfers | Business bank-to-bank | No payment processing, just transfers |

## 🚫 Skip These

- **Zelle** — No API, consumer-only, no recurring billing, fraud risk for large amounts
- **Venmo** — 1.9% but no subscription API, consumer brand hurts credibility for $500K business sales
- **Cash App** — Same problem. You look like a food truck, not a business broker.

## ✅ What I'd Actually Build

**For 305business specifically:**

| Feature | Tool | Cost |
|---------|------|------|
| Featured listings ($99/mo) | Stripe Subscriptions | 2.9% + 30¢ |
| Broker membership ($199/mo) | Stripe Subscriptions | same |
| One-time valuation ($299) | Stripe Checkout | same |
| Business sale escrow | Stripe Connect + escrow partner | 0.5% platform fee |
| Big transfers ($50K+) | Stripe ACH | **0.8%, max $5** ← huge savings |

**The "new" move:**
- Use **Stripe ACH** for actual business sales (saves $1,450 on a $500K sale vs credit cards)
- Use **Stripe Crypto** (Beta) for international buyers — near-zero forex fees
- Offer **Klarna / Affirm** for buyers who need financing on smaller acquisitions ($50K-$200K)

## 🏗 Architecture I'd Wire

```
Seller pays $99/mo → Stripe Subscription → Webhook → Supabase (mark featured)
Buyer pays $299 valuation → Stripe Checkout → Webhook → Supabase (create order)
Business sale closes → Stripe Connect → 90% to seller, 10% to 305business
```

**Bottom line:** Stripe isn't the cheapest on paper, but it's the cheapest in reality because you won't need to build subscription logic, invoice emails, dunning (failed payment retries), tax reporting, or marketplace splits yourself. That dev time costs more than the 2.9%.

If you want to **optimize costs later**: Start with Stripe, add ACH for large transactions, then negotiate lower rates at $100K+/month volume.

Want me to add Stripe Checkout to the "Featured Listing" flow right now? I can build the webhook handler that auto-upgrades listings in Supabase when payment succeeds.