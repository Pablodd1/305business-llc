# 305business.llc — Complete Deployment Guide

## What Was Built

A full-stack business marketplace platform with:
- **Backend**: Flask + SQLAlchemy API (SQLite dev / PostgreSQL prod)
- **Frontend**: Static HTML pages on Vercel (already deployed)
- **Database**: Full relational schema with listings, inquiries, messages, users
- **Auth**: JWT-based with role system (seller, buyer, admin, broker)
- **Telegram**: Live notifications for every listing, inquiry, message, approval
- **Admin Dashboard**: Full control panel with stats, approve/reject, chat monitor
- **Chat/Q&A**: Buyer-seller messaging system per inquiry
- **Legalities**: Compliance checkboxes + disclosure on every listing
- **VSEO/AI SEO**: Agentic config integrated across all pages

---

## Files Created / Updated

### Backend (`/backend/`)
| File | Purpose |
|------|---------|
| `app.py` | Complete Flask API (1,000+ lines) — listings, auth, inquiries, messages, admin, uploads, Telegram |
| `requirements.txt` | All Python dependencies |
| `Procfile` | Railway deployment command |
| `runtime.txt` | Python 3.11 for Railway |

### Frontend (root)
| File | Purpose |
|------|---------|
| `index.html` | **Updated** — now loads real listings from API dynamically |
| `list-business.html` | **Updated** — full multi-step form submits to `/api/listings` with photos, legal checkboxes, revenue history |
| `business-detail.html` | **New** — API-driven detail page with inquiry form + live chat widget |
| `admin.html` | **New** — Full admin dashboard with login, stats, listing approval/rejection, inquiry tracker, chat monitor, user list |
| `agentic-config.js` | VSEO/AI SEO tracking config (already existed, now included on all pages) |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/me` — Get current user

### Listings (Public)
- `GET /api/listings` — Get all active listings (with filters)
- `GET /api/listings/<id>` — Get single listing (increments views)
- `POST /api/listings` — Create new listing (no auth required for MVP)

### Inquiries (Public)
- `POST /api/inquiries` — Submit buyer inquiry

### Messages / Chat
- `POST /api/messages` — Send message in inquiry thread
- `GET /api/messages/<inquiry_id>` — Get all messages

### Admin (Requires JWT + admin role)
- `GET /api/admin/stats` — Dashboard statistics
- `GET /api/admin/listings` — All listings (including pending)
- `GET /api/admin/inquiries` — All inquiries
- `GET /api/admin/users` — All registered users
- `POST /api/admin/listings/<id>/approve` — Approve pending listing
- `POST /api/admin/listings/<id>/reject` — Reject pending listing

### Uploads
- `POST /api/upload/photo` — Upload business photo
- `POST /api/upload/document` — Upload document

### System
- `GET /api/health` — Health check
- `GET /api/test/telegram` — Test Telegram notification
- `POST /api/init` — Initialize database with demo data + admin user

---

## Admin Login

- **Email**: `admin@305business.llc`
- **Password**: `admin305`
- **Role**: `admin`

---

## Database Architecture

### SQLite (Development)
```
sqlite:///305business.db
```

### PostgreSQL (Production)
Set environment variable:
```
DATABASE_URL=postgresql://user:pass@host:5432/305business
```

### Tables
| Table | Purpose |
|-------|---------|
| `users` | Sellers, buyers, admins, brokers |
| `listings` | Business listings with full financials |
| `inquiries` | Buyer inquiries per listing |
| `messages` | Chat messages per inquiry |
| `favorites` | User saved listings |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | No | `sqlite:///305business.db` | Database connection |
| `SECRET_KEY` | Yes (prod) | `305business-dev-secret-key-change-in-production` | JWT signing |
| `TELEGRAM_BOT_TOKEN` | No | (empty) | Bot token for notifications |
| `TELEGRAM_ADMIN_CHAT_ID` | No | `7838956683` | Your Telegram chat ID |
| `PORT` | No | `5000` | Server port |

---

## Railway Deployment Steps

### 1. Push to GitHub
```bash
cd /root/.openclaw/workspace/305business-llc
git add .
git commit -m "Complete backend + admin dashboard + API integration"
git push origin main
```

### 2. Create Railway Project
```bash
railway login
railway init
```

### 3. Add PostgreSQL Database
In Railway dashboard:
- Click "New" → "Database" → "Add PostgreSQL"
- Copy the `DATABASE_URL` from the "Connect" tab

### 4. Set Environment Variables
In Railway dashboard → Variables:
```
DATABASE_URL = (auto-filled by Railway PostgreSQL)
SECRET_KEY = your-random-secret-key-here
TELEGRAM_BOT_TOKEN = your-telegram-bot-token-here
TELEGRAM_ADMIN_CHAT_ID = 7838956683
```

### 5. Deploy
```bash
cd backend
railway up
```

### 6. Initialize Database
After first deploy:
```bash
curl -X POST https://your-app-url.railway.app/api/init
```

This creates:
- Admin user (`admin@305business.llc` / `admin305`)
- 3 demo listings with full data

---

## Telegram Bot Setup (Optional but Recommended)

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create new bot → copy token
3. Add token to Railway environment variables as `TELEGRAM_BOT_TOKEN`
4. Get your chat ID:
   - Message [@userinfobot](https://t.me/userinfobot) → copy ID
   - Set as `TELEGRAM_ADMIN_CHAT_ID`

**Notifications sent:**
- New listing submitted
- New buyer inquiry
- New chat message
- Listing approved/rejected
- New user registered

---

## VSEO / AI SEO

The `agentic-config.js` file tracks:
- Searches, clicks, scroll depth, form submissions
- Time on page, conversions, engagement
- Auto-optimizes meta titles and descriptions

**Included on all pages:** `index.html`, `list-business.html`, `business-detail.html`, `admin.html`

---

## What Sellers Can Input (List Business Form)

### Step 1: Basic Info
- Business name, category, year established, location
- Full description
- Photos (upload up to 5MB each)
- Contact name, email, phone

### Step 2: Financials
- Asking price, annual revenue, cash flow
- Inventory value, monthly rent, lease terms
- Number of employees, square footage
- Revenue history (2021-2025)

### Step 3: Details
- Business hours, parking type
- Features & assets (checkboxes): Real estate, equipment, liquor license, franchise, trademarks, clients, website, social media
- Reason for selling
- Training & transition plan
- Growth opportunities

### Step 4: Legal & Review
- Accuracy confirmation (required)
- Response commitment (required)
- NDA requirement option
- Featured listing upgrade ($99)

---

## What Buyers See (Business Detail)

- Full financial overview with revenue history chart
- Business details (hours, parking, sqft, rent, lease)
- Features & assets tags
- Training & growth opportunities
- Legal disclosure box
- Contact seller card with inquiry form
- Live Q&A chat widget
- Share/print actions

---

## What Admin Sees

### Dashboard
- 6 stat cards: Total listings, Active, Pending, Total inquiries, New inquiries, Total views
- Recent listings panel with approve/reject quick actions
- Recent inquiries panel

### Listings Management
- Filter by: All, Pending, Active, Rejected
- Approve / Reject buttons for pending listings
- View count, inquiry count per listing
- Quick link to public detail page

### Inquiries
- Filter by: All, New, Contacted
- Buyer name, email, phone, message preview
- Mark as contacted button
- Link to chat thread

### Chat Monitor
- List of all inquiries with buyers
- Full conversation history per inquiry
- See buyer, seller, admin messages

### Users
- All registered users with roles
- Contact info, verification status, join date

---

## Testing Checklist

- [ ] `POST /api/init` — Initialize database
- [ ] `POST /api/listings` — Submit new listing
- [ ] `GET /api/listings` — View all active listings
- [ ] `GET /api/listings/1` — View single listing
- [ ] `POST /api/inquiries` — Submit inquiry
- [ ] `POST /api/messages` — Send chat message
- [ ] `GET /api/messages/1` — View chat thread
- [ ] `POST /api/auth/login` — Admin login
- [ ] `GET /api/admin/stats` — View dashboard stats
- [ ] `POST /api/admin/listings/1/approve` — Approve listing
- [ ] `GET /api/test/telegram` — Test notification

---

## Next Steps (Your Action Items)

1. **Deploy backend to Railway** (instructions above)
2. **Get Telegram Bot Token** from @BotFather and add to Railway vars
3. **Update `API_BASE` URLs** in frontend files to point to your Railway URL:
   - `index.html` line ~1424
   - `list-business.html` in submitForm()
   - `business-detail.html` line ~1
   - `admin.html` line ~1
4. **Re-deploy frontend** to Vercel after updating API URLs
5. **Test full flow**: Submit listing → Check Telegram → Approve in admin → View live

---

## Support

Questions? Contact via Telegram: [@28729102e2163caa3555992f580e1013](https://t.me/28729102e2163caa3555992f580e1013)

**Built by Kimi Claw for 305business.llc**
