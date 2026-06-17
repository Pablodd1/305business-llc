# 305business.llc — Soft Opening Project Plan
**CTO: Kimi Claw | Date: June 17, 2026**
**Goal: Production-ready business marketplace for Miami soft opening**

---

## 🎯 Executive Summary

**Current State:** Beautiful frontend, solid database, broken workflow  
**Target State:** Complete auth → profile → listing → review → notification pipeline  
**Timeline: 3 weeks to soft opening**

---

## 📋 PHASE BREAKDOWN

### PHASE 1: Foundation (Week 1) — CRITICAL PATH
**Goal: Users can register, create profiles, and you get notified**

| # | Task | Assignee | Status | Est. Time |
|---|------|----------|--------|-----------|
| 1.1 | Supabase Auth Setup (Magic Link) | **Kimi Claw** | 🔴 Not Started | 4h |
| 1.2 | Profiles Table + Schema | **Kimi Claw** | 🔴 Not Started | 2h |
| 1.3 | Login/Signup Pages | **Kimi Claw** | 🔴 Not Started | 6h |
| 1.4 | Brevo Email Integration (Notifications to Jasmel) | **Kimi Claw** | 🔴 Not Started | 4h |
| 1.5 | Fix supabase-client.js auth headers | **Kimi Claw** | 🔴 Not Started | 2h |

**Deliverable:** Users can register → create profile → submit listing → Jasmel gets email

---

### PHASE 2: Dashboard & UX (Week 2)
**Goal: Users can manage their account and listings**

| # | Task | Assignee | Status | Est. Time |
|---|------|----------|--------|-----------|
| 2.1 | Seller Dashboard (`/dashboard.html`) | **Kimi Claw** | 🔴 Not Started | 8h |
| 2.2 | "My Listings" view (edit, status, inquiries) | **Kimi Claw** | 🔴 Not Started | 6h |
| 2.3 | Navigation update (add Login/Profile links) | **Kimi Claw** | 🔴 Not Started | 2h |
| 2.4 | Session persistence (stay logged in) | **Kimi Claw** | 🔴 Not Started | 3h |
| 2.5 | Password reset flow | **Kimi Claw** | 🔴 Not Started | 3h |

**Deliverable:** Complete user account lifecycle

---

### PHASE 3: Admin & Workflow (Week 2-3)
**Goal: Jasmel can review and manage all listings**

| # | Task | Assignee | Status | Est. Time |
|---|------|----------|--------|-----------|
| 3.1 | Admin Review Queue (`/admin.html` v2) | **Kimi Claw** | 🔴 Not Started | 8h |
| 3.2 | Listing status workflow (Draft→Pending→Active→Sold) | **Kimi Claw** | 🔴 Not Started | 4h |
| 3.3 | Email to seller on status change | **Kimi Claw** | 🔴 Not Started | 2h |
| 3.4 | Featured listing flag management | **Kimi Claw** | 🔴 Not Started | 2h |

**Deliverable:** Full admin control over listings

---

### PHASE 4: Content & Compliance (Week 3)
**Goal: Professional, trustworthy experience**

| # | Task | Assignee | Status | Est. Time |
|---|------|----------|--------|-----------|
| 4.1 | `/seller-guide.html` — Miami market Q&A | **Kimi Claw** | 🔴 Not Started | 6h |
| 4.2 | `/faq.html` — Buyer & Seller FAQ | **Kimi Claw** | 🔴 Not Started | 4h |
| 4.3 | Legal consent tracking (terms acceptance) | **Kimi Claw** | 🔴 Not Started | 3h |
| 4.4 | Required documents checklist in listing form | **Kimi Claw** | 🔴 Not Started | 2h |
| 4.5 | NDA flow for confidential details | **Kimi Claw** | 🟡 Deferred | 8h |

**Deliverable:** Complete content + legal foundation

---

### PHASE 5: Polish & Launch (Week 3)
**Goal: Production-ready deployment**

| # | Task | Assignee | Status | Est. Time |
|---|------|----------|--------|-----------|
| 5.1 | End-to-end testing (full user journey) | **Kimi Claw** | 🔴 Not Started | 4h |
| 5.2 | Mobile responsiveness audit | **Kimi Claw** | 🔴 Not Started | 3h |
| 5.3 | SEO final optimization | **Kimi Claw** | 🟢 Partial | 2h |
| 5.4 | Deploy to Vercel + Railway | **Kimi Claw** | 🟢 Infrastructure ready | 1h |
| 5.5 | Analytics + conversion tracking setup | **Kimi Claw** | 🟢 GA4 already installed | 1h |

---

## 🏗️ WORKER ASSIGNMENTS

### **Worker 1: Auth & Identity Team (Kimi Claw)**
**Focus:** User registration, authentication, profiles
**Stack:** Supabase Auth, Magic Link, Session Management
**Key Files:**
- `auth.js` — Authentication module
- `profiles` table — User data
- `login.html` / `signup.html` — Auth pages
- `dashboard.html` — User dashboard

### **Worker 2: Backend & Notifications Team (Kimi Claw)**
**Focus:** Email notifications, admin workflow, database
**Stack:** Brevo API, Supabase, Python/Node
**Key Files:**
- `supabase-client.js` — Updated with auth
- `email-notifications.js` — Brevo integration
- `admin.html` — Admin review queue
- `api/` — Backend endpoints

### **Worker 3: Content & UX Team (Kimi Claw)**
**Focus:** Copywriting, user guides, FAQ, legal
**Stack:** HTML, SEO, Copywriting
**Key Files:**
- `seller-guide.html` — Complete selling guide
- `faq.html` — Q&A for buyers and sellers
- `list-business.html` — Enhanced with consent tracking

---

## 📊 CRITICAL PATH TIMELINE

```
Week 1: [====Auth+Profiles====][====Notifications====]
Week 2: [====Dashboard====][====Admin Review====]
Week 3: [====Content====][====Polish====][🚀 LAUNCH]
```

**Total estimated time: 80 hours (~2 weeks of focused work)**

---

## 🎯 SUCCESS CRITERIA (Soft Opening)

- [ ] User can register with email (magic link)
- [ ] User can create a business profile
- [ ] User can submit a business listing (4-step form)
- [ ] Jasmel receives email notification on every submission
- [ ] Jasmel can review/approve/reject listings in admin
- [ ] Seller receives email when listing status changes
- [ ] Seller can view their listings in dashboard
- [ ] Buyer can browse listings and submit inquiries
- [ ] All pages have proper SEO + analytics
- [ ] Mobile-friendly experience

---

## 🚨 BLOCKERS & RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase auth limits (free tier) | Medium | Monitor usage, upgrade if needed |
| Brevo email deliverability | Medium | Use verified sender domain |
| User adoption (chicken-egg) | High | Seed with 5-10 sample listings |
| Legal liability | High | Add disclaimers, TOS acceptance |

---

## 📁 FILE STRUCTURE (Target)

```
305business-llc/
├── index.html              ✅ (existing)
├── how-it-works.html       ✅ (existing)
├── list-business.html      🔄 (enhance with auth)
├── business-detail.html    ✅ (existing)
├── broker-portal.html      ✅ (existing)
├── valuation.html          ✅ (existing)
├── login.html              ❌ (NEW)
├── signup.html             ❌ (NEW)
├── dashboard.html          ❌ (NEW)
├── admin.html              🔄 (enhance)
├── seller-guide.html       ❌ (NEW)
├── faq.html                ❌ (NEW)
├── legal-support.html      ✅ (existing)
├── founders.html           ✅ (existing)
├── terms.html              ✅ (existing)
├── privacy.html            ✅ (existing)
│
├── js/
│   ├── auth.js             ❌ (NEW)
│   ├── supabase-client.js  🔄 (enhance)
│   ├── email-notify.js     ❌ (NEW)
│   └── dashboard.js        ❌ (NEW)
│
├── backend/
│   ├── api_server.py       ✅ (existing)
│   ├── email_server.py     🔄 (fix/deploy)
│   └── 305business_schema.sql 🔄 (enhance)
│
└── api/
    └── notify.js           ✅ (existing)
```

---

## 🎬 NEXT ACTIONS (Start Now)

1. **Enable Supabase Auth** in project dashboard
2. **Create `profiles` table** linked to `auth.users`
3. **Build `auth.js`** module with magic link login
4. **Create `login.html`** and `signup.html`
5. **Integrate Brevo** for email notifications
6. **Test end-to-end** registration → listing → notification

---

**Status:** 🟡 PLANNING COMPLETE → Ready to execute
**Next Milestone:** Phase 1.1 — Supabase Auth Setup
