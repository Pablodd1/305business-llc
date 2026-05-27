# 305business.llc — Supabase Setup Guide

## Overview

Replace SQLite/Railway with **Supabase PostgreSQL** as your production database.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in / Sign up (GitHub auth recommended)
3. Click **New Project**
4. Name: `305business`
5. Region: `US East (N. Virginia)` — closest to Miami
6. Plan: **Free Tier** (upgrade later if needed)
7. Click **Create New Project** (takes ~2 minutes)

## 2. Get Connection String

Once the project is ready:

1. Go to **Project Settings** (gear icon) → **Database**
2. Scroll to **Connection string** → **URI**
3. Copy the `postgresql://` string. It looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   ```
4. **Save this** — you'll need it in the next step.

## 3. Configure Backend

### Option A: Environment Variable (Production)

Set `DATABASE_URL` to your Supabase connection string:

```bash
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres"
export SECRET_KEY="your-random-secret-key-min-32-chars"
export TELEGRAM_BOT_TOKEN=""  # Optional: add later
export TELEGRAM_ADMIN_CHAT_ID="7838956683"
```

### Option B: `.env` File (Local Development)

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres
SECRET_KEY=your-random-secret-key-min-32-chars
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=7838956683
```

Install python-dotenv:
```bash
cd backend
pip install python-dotenv
```

Add to top of `app.py`:
```python
from dotenv import load_dotenv
load_dotenv()
```

## 4. Initialize Database

### First Time Setup

Run the backend locally once to create all tables in Supabase:

```bash
cd backend
pip install -r requirements.txt
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('✅ Tables created in Supabase')
"
```

### Seed with 10 Demo Listings + Admin

```bash
python -c "
import requests
r = requests.post('http://localhost:5000/api/init')
print(r.json())
"
```

Or using curl:
```bash
curl -X POST http://localhost:5000/api/init
```

This creates:
- Admin user: `admin@305business.llc` / `admin305`
- **10 active demo listings** with full financials

## 5. Hosting the Backend

Since you said **NO RAILWAY**, here are alternatives:

### Option 1: Vercel Serverless (Recommended for frontend + API)

Use a Vercel serverless function wrapper. Create `api/index.py` at repo root:

```python
from backend.app import app
from vercel_wsgi import make_wsgi_handler

handler = make_wsgi_handler(app)
```

Install: `pip install vercel-wsgi`

Add `vercel.json`:
```json
{
  "routes": [{ "src": "/api/(.*)", "dest": "/api/index.py" }]
}
```

**Note:** File uploads won't work in serverless. For uploads, use Supabase Storage directly (see below).

### Option 2: VPS / Dedicated Server

Deploy to any VPS (DigitalOcean, Hetzner, AWS EC2, etc.):

```bash
# Ubuntu setup
sudo apt update && sudo apt install python3-pip python3-venv nginx

cd /var/www/305business
git clone https://github.com/Pablodd1/305business-llc.git .

python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://...
export SECRET_KEY=...

# Run with gunicorn
gunicorn backend.app:app --bind 0.0.0.0:5000 --workers 2
```

Add systemd service for auto-start.

### Option 3: Render.com (Free Tier)

1. Go to [https://render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Build Command: `pip install -r backend/requirements.txt`
4. Start Command: `gunicorn backend.app:app`
5. Add environment variables in dashboard

### Option 4: Run Locally (Development)

```bash
cd backend
python app.py
```

Backend runs on `http://localhost:5000`

## 6. File Uploads with Supabase Storage

Since serverless hosts don't have persistent disk, move uploads to **Supabase Storage**:

1. In Supabase dashboard → **Storage** → **New Bucket**
2. Name: `business-photos`
3. Another bucket: `documents`
4. Set buckets to **public** (for easy access)
5. Get Storage API key from **Project Settings → API**

Update backend to upload to Supabase Storage instead of local disk.

**Quick patch** — replace upload routes in `app.py`:

```python
import supabase

supabase_client = supabase.create_client(
    os.environ.get('SUPABASE_URL', ''),
    os.environ.get('SUPABASE_KEY', '')
)

@app.route('/api/upload/photo', methods=['POST'])
def upload_photo():
    if 'file' not in request.files:
        return jsonify({'message': 'No file'}), 400
    
    file = request.files['file']
    filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
    
    # Upload to Supabase Storage
    supabase_client.storage.from_('business-photos').upload(
        filename, file.read(), {'content-type': file.content_type}
    )
    
    public_url = supabase_client.storage.from_('business-photos').get_public_url(filename)
    return jsonify({'url': public_url})
```

## 7. Frontend API Configuration

All frontend files now use a **relative API path** by default:

```javascript
const API_BASE = window.API_BASE || (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api');
```

### If backend is on a different domain:

Add this script tag **before** other scripts in each HTML file:

```html
<script>window.API_BASE = 'https://your-backend-url.com/api';</script>
```

Or set in browser console for testing:
```javascript
window.API_BASE = 'https://your-backend-url.com/api';
location.reload();
```

## 8. Complete Checklist

- [ ] Create Supabase project (US East region)
- [ ] Copy PostgreSQL connection string
- [ ] Set `DATABASE_URL` in backend environment
- [ ] Run `db.create_all()` to create tables
- [ ] Run `POST /api/init` to seed 10 listings + admin
- [ ] Verify tables in Supabase **Table Editor**
- [ ] Deploy backend (VPS/Render/Vercel)
- [ ] Update `window.API_BASE` if needed
- [ ] Test: `GET /api/listings` returns 10 businesses
- [ ] Test: Admin login works at `admin.html`

## 9. The 10 Demo Businesses

| # | Business | Category | Location | Price | Revenue |
|---|----------|----------|----------|-------|---------|
| 1 | Miami Beach Café | Restaurant | Miami Beach | $185K | $420K |
| 2 | Brickell Medical Billing | Healthcare | Brickell | $495K | $680K |
| 3 | Wynwood Art Gallery | Retail | Wynwood | $320K | $380K |
| 4 | Little Havana Auto Repair | Automotive | Little Havana | $650K | $850K |
| 5 | Coral Gables Luxury Salon | Beauty | Coral Gables | $420K | $580K |
| 6 | El Pan Cubano Bakery | Food | Little Havana | $295K | $520K |
| 7 | Downtown Miami CPA Firm | Professional | Downtown | $380K | $450K |
| 8 | Aventura Pet Grooming | Services | Aventura | $165K | $310K |
| 9 | Kendall Strength Studio | Fitness | Kendall | $210K | $280K |
| 10 | Miami Lakes Convenience | Retail | Miami Lakes | $275K | $890K |

All include: revenue history 2021-2025, cash flow, employee count, square footage, lease terms, features, training plans, growth opportunities.

---

## Questions?

Telegram: @JassCTO (7838956683)
