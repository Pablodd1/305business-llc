#!/usr/bin/env python3
"""
305business.llc — Production Backend API
Supabase + Stripe + AI SEO Engine

Port: 8087
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import uuid
from datetime import datetime
import requests

# Try to import supabase
try:
    from supabase import create_client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False
    print("⚠️ supabase-py not installed. Install: pip install supabase")

app = Flask(__name__)
CORS(app, origins=['https://305business.llc', 'https://*.305business.llc', 'http://localhost:*'])

# ───────────────────────────────────────────────────────────────────────────
# CONFIG
# ───────────────────────────────────────────────────────────────────────────
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://yzakbldootyzaamyxqiw.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_ADMIN_CHAT_ID = os.environ.get('TELEGRAM_ADMIN_CHAT_ID', '7838956683')

# Initialize Supabase
supabase = None
if HAS_SUPABASE and SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"✅ Supabase connected: {SUPABASE_URL}")
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")

# ───────────────────────────────────────────────────────────────────────────
# HELPERS
# ───────────────────────────────────────────────────────────────────────────

def send_telegram_notification(message: str):
    """Send notification to admin Telegram"""
    if not TELEGRAM_BOT_TOKEN:
        return False
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_ADMIN_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        }
        response = requests.post(url, json=payload, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"Telegram notification failed: {e}")
        return False

def generate_ai_seo_content(business_data: dict) -> dict:
    """Generate AI SEO content using Gemini API"""
    if not GEMINI_API_KEY:
        return {
            "seo_title": f"Buy {business_data.get('business_name', 'Business')} in Miami | 305business",
            "seo_description": f"{business_data.get('business_name', 'Business')} for sale in Miami. {business_data.get('short_description', 'Great business opportunity')} - 305business marketplace",
            "ai_generated": False
        }
    
    try:
        prompt = f"""
Generate SEO metadata for a Miami business listing:

Business: {business_data.get('business_name')}
Category: {business_data.get('category')}
Location: {business_data.get('location')}
Price: ${business_data.get('asking_price', 'N/A')}
Description: {business_data.get('description', '')[:500]}

Generate:
1. SEO Title (50-60 chars, include "Miami" and category)
2. SEO Description (150-160 chars, compelling CTA)
3. Keywords (array of 10 relevant keywords)
4. Short Description (2 sentences, under 200 chars)

Return JSON only: {{"seo_title": "...", "seo_description": "...", "keywords": [...], "short_description": "..."}}
"""
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.3, "maxOutputTokens": 500}
        }
        
        response = requests.post(url, json=payload, timeout=30)
        if response.status_code == 200:
            result = response.json()
            text = result['candidates'][0]['content']['parts'][0]['text']
            
            # Extract JSON
            import re
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                seo_data = json.loads(json_match.group())
                return {
                    "seo_title": seo_data.get('seo_title', '')[:60],
                    "seo_description": seo_data.get('seo_description', '')[:160],
                    "seo_keywords": seo_data.get('keywords', []),
                    "short_description": seo_data.get('short_description', '')[:200],
                    "ai_generated": True
                }
    except Exception as e:
        print(f"AI SEO generation failed: {e}")
    
    # Fallback
    return {
        "seo_title": f"Buy {business_data.get('business_name', 'Business')} in Miami | 305business",
        "seo_description": f"{business_data.get('business_name', 'Business')} for sale in Miami. {business_data.get('short_description', 'Great business opportunity')[:150]}",
        "ai_generated": False
    }

# ───────────────────────────────────────────────────────────────────────────
# LISTINGS API
# ───────────────────────────────────────────────────────────────────────────

@app.route('/api/listings', methods=['GET'])
def get_listings():
    """Get all active listings with filters"""
    if not supabase:
        return jsonify({"error": "Database not connected"}), 500
    
    # Query parameters
    category = request.args.get('category')
    city = request.args.get('city', 'Miami')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    featured = request.args.get('featured')
    search = request.args.get('search')
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    
    # Build query
    query = supabase.table('listings').select('*').eq('status', 'active')
    
    if category:
        query = query.eq('category', category)
    if city:
        query = query.eq('city', city)
    if min_price:
        query = query.gte('asking_price', float(min_price))
    if max_price:
        query = query.lte('asking_price', float(max_price))
    if featured == 'true':
        query = query.eq('is_featured', True)
    if search:
        query = query.ilike('business_name', f'%{search}%')
    
    # Order: featured first, then newest
    query = query.order('is_featured', desc=True).order('created_at', desc=True)
    
    result = query.limit(limit).offset(offset).execute()
    
    return jsonify({
        "listings": result.data,
        "count": len(result.data),
        "limit": limit,
        "offset": offset
    })

@app.route('/api/listings/<slug>', methods=['GET'])
def get_listing_by_slug(slug):
    """Get single listing by slug"""
    if not supabase:
        return jsonify({"error": "Database not connected"}), 500
    
    result = supabase.table('listings').select('*').eq('slug', slug).single().execute()
    
    if not result.data:
        return jsonify({"error": "Listing not found"}), 404
    
    # Increment view count
    supabase.table('listings').update({'view_count': result.data.get('view_count', 0) + 1}).eq('id', result.data['id']).execute()
    
    return jsonify(result.data)

@app.route('/api/listings', methods=['POST'])
def create_listing():
    """Create new business listing"""
    if not supabase:
        return jsonify({"error": "Database not connected"}), 500
    
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Generate slug
    business_name = data.get('business_name', '')
    slug = business_name.lower().replace(' ', '-').replace(',', '').replace('.', '')[:50]
    
    # Check if slug exists and append number
    existing = supabase.table('listings').select('slug').ilike('slug', f'{slug}%').execute()
    if existing.data:
        slug = f"{slug}-{len(existing.data) + 1}"
    
    # AI SEO Generation
    seo_data = generate_ai_seo_content(data)
    
    # Prepare listing data
    listing_data = {
        **data,
        "slug": slug,
        "status": "pending",
        "seo_title": seo_data.get('seo_title'),
        "seo_description": seo_data.get('seo_description'),
        "seo_keywords": seo_data.get('seo_keywords', []),
        "short_description": seo_data.get('short_description'),
        "ai_generated_description": seo_data.get('ai_generated', False),
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Insert into database
    result = supabase.table('listings').insert(listing_data).execute()
    
    if not result.data:
        return jsonify({"error": "Failed to create listing"}), 500
    
    listing = result.data[0]
    
    # Send Telegram notification
    message = f"""🏢 <b>New Business Listing</b>

<b>{listing['business_name']}</b>
📍 {listing.get('location', 'N/A')}
💰 ${listing.get('asking_price', 'N/A')}
📧 {listing.get('seller_email', 'N/A')}

<a href='https://305business.llc/business/{listing['slug']}'>View Listing</a>"""
    send_telegram_notification(message)
    
    return jsonify({
        "success": True,
        "listing": listing,
        "seo_data": seo_data
    }), 201

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories with listing counts"""
    if not supabase:
        return jsonify({"error": "Database not connected"}), 500
    
    result = supabase.table('categories').select('*').execute()
    return jsonify({"categories": result.data})

# ───────────────────────────────────────────────────────────────────────────
# INQUIRIES API
# ───────────────────────────────────────────────────────────────────────────

@app.route('/api/inquiries', methods=['POST'])
def create_inquiry():
    """Submit buyer inquiry"""
    if not supabase:
        return jsonify({"error": "Database not connected"}), 500
    
    data = request.json
    if not data or not data.get('listing_id'):
        return jsonify({"error": "listing_id required"}), 400
    
    # Insert inquiry
    result = supabase.table('inquiries').insert(data).execute()
    
    if not result.data:
        return jsonify({"error": "Failed to create inquiry"}), 500
    
    inquiry = result.data[0]
    
    # Update listing inquiry count
    supabase.table('listings').update({'inquiry_count': supabase.table('listings').select('inquiry_count').eq('id', data['listing_id']).execute().data[0]['inquiry_count'] + 1}).eq('id', data['listing_id']).execute()
    
    # Send notification
    message = f"""📩 <b>New Buyer Inquiry</b>

<b>Buyer:</b> {data.get('buyer_name', 'N/A')}
<b>Email:</b> {data.get('buyer_email', 'N/A')}
<b>Phone:</b> {data.get('buyer_phone', 'N/A')}
<b>Message:</b> {data.get('buyer_message', 'N/A')[:200]}

<a href='https://305business.llc/admin'>View in Admin</a>"""
    send_telegram_notification(message)
    
    return jsonify({"success": True, "inquiry": inquiry}), 201

# ───────────────────────────────────────────────────────────────────────────
# STRIPE PAYMENTS
# ───────────────────────────────────────────────────────────────────────────

@app.route('/api/stripe/create-checkout', methods=['POST'])
def create_checkout_session():
    """Create Stripe checkout session for subscription"""
    if not STRIPE_SECRET_KEY:
        return jsonify({"error": "Stripe not configured"}), 500
    
    try:
        import stripe
        stripe.api_key = STRIPE_SECRET_KEY
        
        data = request.json
        plan = data.get('plan', 'pro_monthly')
        email = data.get('email')
        listing_id = data.get('listing_id')
        
        # Price IDs (configure these in Stripe Dashboard)
        PRICE_IDS = {
            'pro_monthly': 'price_pro_monthly_placeholder',
            'enterprise_monthly': 'price_enterprise_monthly_placeholder',
            'featured_weekly': 'price_featured_weekly_placeholder'
        }
        
        price_id = PRICE_IDS.get(plan)
        if not price_id:
            return jsonify({"error": "Invalid plan"}), 400
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            customer_email=email,
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f'https://305business.llc/payment-success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'https://305business.llc/payment-cancel',
            metadata={
                'listing_id': listing_id or '',
                'plan': plan
            }
        )
        
        return jsonify({"session_id": session.id, "url": session.url})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stripe/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    if not STRIPE_WEBHOOK_SECRET:
        return jsonify({"error": "Webhook secret not configured"}), 500
    
    try:
        import stripe
        stripe.api_key = STRIPE_SECRET_KEY
        
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            
            # Update listing tier
            listing_id = session.get('metadata', {}).get('listing_id')
            plan = session.get('metadata', {}).get('plan')
            
            if listing_id and supabase:
                tier = 'pro' if 'pro' in plan else 'enterprise' if 'enterprise' in plan else 'featured'
                supabase.table('listings').update({
                    'tier': tier,
                    'tier_expires_at': datetime.utcnow().isoformat()
                }).eq('id', listing_id).execute()
        
        return jsonify({"status": "success"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ───────────────────────────────────────────────────────────────────────────
# AI SEO ENGINE
# ───────────────────────────────────────────────────────────────────────────

@app.route('/api/seo/generate', methods=['POST'])
def generate_seo():
    """Generate AI SEO content for a listing"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    seo_data = generate_ai_seo_content(data)
    return jsonify(seo_data)

@app.route('/api/sitemap.xml', methods=['GET'])
def generate_sitemap():
    """Generate XML sitemap"""
    if not supabase:
        return jsonify({"error": "Database not connected"}), 500
    
    # Get all active listings
    result = supabase.table('listings').select('slug, updated_at').eq('status', 'active').execute()
    
    urls = [
        {"loc": "https://305business.llc/", "priority": "1.0", "changefreq": "daily"},
        {"loc": "https://305business.llc/list-business", "priority": "0.8", "changefreq": "weekly"},
        {"loc": "https://305business.llc/broker-portal", "priority": "0.7", "changefreq": "weekly"},
        {"loc": "https://305business.llc/valuation", "priority": "0.7", "changefreq": "monthly"},
    ]
    
    for listing in result.data:
        urls.append({
            "loc": f"https://305business.llc/business/{listing['slug']}",
            "priority": "0.9",
            "changefreq": "weekly",
            "lastmod": listing.get('updated_at', '')
        })
    
    # Generate XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml += '  <url>\n'
        xml += f"    <loc>{url['loc']}</loc>\n"
        if url.get('lastmod'):
            xml += f"    <lastmod>{url['lastmod']}</lastmod>\n"
        xml += f"    <changefreq>{url['changefreq']}</changefreq>\n"
        xml += f"    <priority>{url['priority']}</priority>\n"
        xml += '  </url>\n'
    
    xml += '</urlset>'
    
    return xml, 200, {'Content-Type': 'application/xml'}

# ───────────────────────────────────────────────────────────────────────────
# HEALTH
# ───────────────────────────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "supabase_connected": supabase is not None,
        "stripe_configured": bool(STRIPE_SECRET_KEY),
        "gemini_configured": bool(GEMINI_API_KEY),
        "telegram_configured": bool(TELEGRAM_BOT_TOKEN)
    })

# ───────────────────────────────────────────────────────────────────────────
# MAIN
# ───────────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8087))
    print(f"🚀 305business API Server starting on port {port}")
    print(f"📊 Supabase: {'✅ Connected' if supabase else '❌ Not connected'}")
    print(f"💳 Stripe: {'✅ Configured' if STRIPE_SECRET_KEY else '❌ Not configured'}")
    print(f"🤖 Gemini: {'✅ Configured' if GEMINI_API_KEY else '❌ Not configured'}")
    app.run(host='0.0.0.0', port=port, debug=False)
