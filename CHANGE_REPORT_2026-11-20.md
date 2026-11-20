# Change Report — 2026-11-20 (`305business.llc`)

## Summary of Changes
Finalized `305business.llc` across English/Spanish landing pages, service subpages, interactive widgets, AI search metadata, and the 26-venture portfolio.

### 1. Replaced Dead Booking Tunnels, Placeholder Phone & Personal Email
- Replaced dead `oem-flex-spots-poll.trycloudflare.com` booking links with `https://www.aidynamic.pro/booking?service=free_ai_consultation` across `index.html`, `es.html`, `financial-forecasting.html`, `pitch-decks.html`, `valuation.html`, `legal-support.html`, and `305business-chatbot-widget.js`.
- Replaced placeholder `+1-305-000-0000` phone schema in `index.html` and `es.html` with `+1-786-643-2099`.
- Replaced public-facing `jasmelacosta@gmail.com` references with `hola@305business.llc` across `index.html`, `business-detail.html`, `list-business.html`, `broker-portal.html`, `founders.html`, `privacy.html`, `terms.html`, `admin/index.html`, `ventures/generate.cjs`, `js/email-notify.js` (`REPLY_TO`), and `305business-chatbot-widget.js` (leaving internal delivery defaults in `api/notify.js` and `js/email-notify.js` `NOTIFY_EMAIL`).
- Updated Ecosystem links in `index.html` and `es.html` to point directly to `https://www.aidynamic.pro`, `https://medicalbillingmb.com`, `https://aiscribers.com`, and `https://new-law-helper-app.vercel.app/`.

### 2. Removed Unsubstantiated Claims & Updated Metadata / AI Search
- Replaced unverified `"2,000+ listings / $2.4M volume"` claims in `index.html` and `es.html` (`ai:*` meta tags, `openai:*` meta tags, FAQ JSON-LD, hero floating data points, live pill, and AI matching copy) with actual platform positioning (`$0 commissions`, `100% direct`, `26` acquirable ventures).
- Created `llms.txt` (`2,309` bytes) and linked `<link rel="help" type="text/plain" href="/llms.txt" ... />` in `index.html` and `es.html`.

### 3. Fixed Broken Flows, JS Parse Bug & Venture Studio
- Fixed a pre-existing unescaped-quote `SyntaxError` on line `699` of `305business-chatbot-widget.js`.
- Removed `"coming soon"` blockers: redirected `showListingModal()` in `index.html` and `es.html` to `list-business.html`, replaced the `alert()` NDA stub in `legal-support.html` with a real Florida Mutual NDA `.txt` Blob download (`downloadNdaTemplate()` + GA4 `file_download`), and wired `broker-portal.html` waitlist submissions to `supabase305.submitContactMessage` with inline confirmation and `mailto` fallback.
- Added `gtag('event', 'generate_lead', ...)` tracking on contact form submissions in `index.html` and `es.html`, plus inside `ventures/generate.cjs` (`offerSubmit`) and `broker-portal.html`.
- Updated `ventures/index.html` (`#statN` `24` -> `26`, added `G-WTHCPMC25C` gtag + `/images/ventures-studio.webp` hero visual) and `ventures/generate.cjs`, and regenerated all `26` `ventures/*.html` pages.

### 4. Generated & Deployed Visual Assets
- `images/marketplace-hero.webp` (`88,140` B) & `images/marketplace-hero.jpg` (`88,179` B)
- `images/ventures-studio.webp` (`60,748` B) & `images/ventures-studio.jpg` (`68,983` B)
- Updated Open Graph / Twitter / Schema image tags across `index.html`, `es.html`, `ventures/index.html`, and `ventures/generate.cjs`.

## Verification
- `node ventures/generate.cjs`: exited `0` (`26` venture pages generated).
- `node --check`: passed (`0` errors) on `305business-chatbot-widget.js`, `ventures/generate.cjs`, `js/email-notify.js`, `supabase-client.js`, and `ventures/data.js`.
- HTML validation across `40` HTML files (`index.html`, `es.html`, 11 root/admin pages, `ventures/index.html`, and `26` venture pages): `44` JSON-LD blocks and `121` classic inline `<script>` blocks parsed cleanly (`2` `<script type="module">` blocks skipped by `vm.Script`).
- `rg` scan confirmed zero remaining public `oem-flex-spots-poll.trycloudflare.com`, `305-000-0000`, `2,000+`, `$2.4M`/`$2.4 million`, `aimedicalscriber`, or public `jasmelacosta@gmail.com` occurrences (pre-existing `'Edit feature coming soon'` toast in `dashboard.html:711`, `README.md`, `LEGAL_COMPLIANCE.md`, and unused `mbmb_stat_*` keys in `shared/translations/*.json` remain untouched).

## Remaining Manual Actions
- Confirm exact physical street/suite address if desired (currently `Miami, FL`).
- Verify `generate_lead` and `file_download` Key Events in GA4 property `G-WTHCPMC25C`.
