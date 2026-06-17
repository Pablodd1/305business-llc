# 305business.llc — CTO MASTER PLAN v2.0
**Role: Chief Technology Officer | Status: In Progress**

---

## 🎯 CURRENT BUILD STATUS

### ✅ COMPLETED (Last 30 min)
| Component | File | Status | Owner |
|-----------|------|--------|-------|
| Auth Module | `js/auth.js` | ✅ Production-ready | Kimi (Main) |
| Login Page | `login.html` | ✅ Mobile-responsive | Kimi (Main) |
| Signup Page | `signup.html` | ✅ Multi-step, 3 roles | Kimi (Main) |
| Profiles Schema | `backend/profiles_schema.sql` | ✅ With RLS policies | Kimi (Main) |
| Email Notifications | `js/email-notify.js` | ✅ Brevo integration | Worker 2 |
| Dashboard UI | `dashboard.html` | ✅ Sidebar, stats, tables | Worker 3 |
| Dashboard Logic | `js/dashboard.js` | ✅ CRUD operations | Worker 3 |

### 🟡 PARTIAL / NEEDS INTEGRATION
| Component | Issue | Action |
|-----------|-------|--------|
| `index.html` nav | Auth links added but needs auth.js module | **Fix now** |
| `list-business.html` | No auth check, no profile pre-fill | **Worker 4** |
| `business-detail.html` | No auth on inquiry form | **Worker 4** |
| `supabase-client.js` | Needs auth header integration | **Worker 5** |

### ❌ MISSING — CRITICAL FOR SOFT OPENING
| Component | Priority | Owner |
|-----------|----------|-------|
| Password Reset Flow | P1 | **Worker 6** |
| Profile Settings Page | P1 | **Worker 7** |
| Auth Guard (page protection) | P0 | **Worker 8** |
| Onboarding Welcome Flow | P2 | **Worker 9** |
| Consistent Nav Across ALL Pages | P1 | **Kimi (Main)** |
| Logout on Every Page | P1 | **Kimi (Main)** |
| Mobile Menu Auth Links | P1 | **Kimi (Main)** |
| Session Expiry Handling | P2 | **Worker 10** |
| Email Verification Status | P2 | **Worker 10** |
| Admin PIN Protection | P1 | **Kimi (Main)** |

---

## 👥 WORKER ASSIGNMENTS

### 🏗️ Worker 4: Listing Integration Team
**Task:** Integrate auth into listing workflow
- Add auth check to `list-business.html` (redirect if not logged in)
- Pre-fill seller info from profile (name, email, phone)
- Add "Save Draft" functionality
- Show "My Listings" link in nav when logged in
- Connect listing submission to email notifications

### 🔧 Worker 5: API Integration Team
**Task:** Connect frontend to backend properly
- Update `supabase-client.js` to use auth headers
- Ensure all API calls include Bearer token
- Add error handling for 401/403 responses
- Connect email notifications to listing/inquiry events

### 🔐 Worker 6: Security & Recovery Team
**Task:** Password reset and account recovery
- Create `reset-password.html` page
- Create `forgot-password.html` page
- Implement OTP verification flow
- Add session expiry warnings

### 👤 Worker 7: Profile Management Team
**Task:** User profile settings
- Create `profile.html` settings page
- Allow updating name, phone, company, avatar
- Show verification status
- Account deletion option (GDPR)

### 🛡️ Worker 8: Auth Guard Team
**Task:** Page protection middleware
- Create `js/auth-guard.js` module
- Protect dashboard, profile, admin pages
- Redirect unauthenticated users to login
- Show "Login Required" modal on public pages

### ✨ Worker 9: Onboarding Team
**Task:** First-time user experience
- Welcome modal after first login
- Quick setup checklist (profile, first listing)
- Tooltip tour of dashboard features
- "Getting Started" email sequence

### 📱 Kimi (Main): Navigation & Consistency
**Task:** Ensure consistent experience
- Add auth nav to ALL pages (index, how-it-works, etc.)
- Add mobile menu auth links
- Add logout functionality everywhere
- Admin PIN protection on admin.html
- Test mobile responsiveness of auth pages

---

## 🔄 USER WORKFLOW (Target)

```
NEW USER:
  1. Lands on index.html → sees "Get Started" button
  2. Clicks → signup.html → chooses role (Seller/Buyer/Broker)
  3. Enters profile info → clicks "Create Account"
  4. Receives magic link email → clicks → auto-login
  5. Redirected to dashboard.html → sees welcome modal
  6. Completes profile → prompted to create first listing
  7. Lists business → Jasmel gets email notification
  8. Can view/edit/manage listings from dashboard

RETURNING USER:
  1. Clicks "Log In" → login.html → enters email
  2. Receives magic link → clicks → auto-login
  3. Redirected to dashboard.html

BUYER:
  1. Can browse listings without login
  2. To inquire → prompted to login/signup
  3. After login → inquiry form with pre-filled info
```

---

## 🎯 SUCCESS CRITERIA (Soft Opening Checklist)

### Authentication
- [ ] User can register with email (magic link)
- [ ] User can login with magic link
- [ ] User can reset password
- [ ] Session persists across page refreshes
- [ ] Logout works on all pages
- [ ] Auth state reflected in navigation

### Profile Management
- [ ] User can view profile
- [ ] User can update profile info
- [ ] Profile info pre-fills listing forms
- [ ] Avatar/initials shown in nav

### Listing Workflow
- [ ] Only authenticated users can list businesses
- [ ] Seller info auto-filled from profile
- [ ] "Save Draft" works
- [ ] Jasmel gets email on every submission
- [ ] Seller sees listing in dashboard

### Dashboard
- [ ] Shows user's listings with status
- [ ] Shows inquiry count
- [ ] Shows view count
- [ ] Can edit/delete listings
- [ ] Mobile responsive

### Admin (Jasmel)
- [ ] PIN-protected access
- [ ] Review queue with approve/reject
- [ ] Email notifications on new submissions
- [ ] Can manage all listings

### Cross-Cutting
- [ ] Consistent nav on ALL pages
- [ ] Mobile menu works with auth
- [ ] All pages mobile-responsive
- [ ] No console errors
- [ ] Fast load times

---

## 📊 TIMELINE

| Phase | Tasks | Est. Time | Owner |
|-------|-------|-----------|-------|
| **Phase 1** | Auth integration across all pages | 2h | Kimi |
| **Phase 2** | Listing form auth + pre-fill | 2h | Worker 4 |
| **Phase 3** | Password reset + profile settings | 3h | Worker 6+7 |
| **Phase 4** | Auth guards + onboarding | 2h | Worker 8+9 |
| **Phase 5** | Testing + bug fixes | 2h | All |
| **TOTAL** | | **~11 hours** | |

---

## 🚨 CRITICAL PATH

**Must have for soft opening:**
1. Auth on listing form (prevents spam)
2. Email notifications to Jasmel (business workflow)
3. Dashboard for sellers (user retention)
4. Admin review queue (quality control)

**Nice to have (post-launch):**
1. Onboarding tour
2. Email verification badge
3. Advanced search filters
4. Broker matching algorithm

---

*Plan created: June 17, 2026*
*Next review: After Worker 4-9 complete*
