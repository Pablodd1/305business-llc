"""
305business.llc — Complete Backend API
Flask + SQLAlchemy + Telegram Bot + JWT Auth
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
import datetime
import os
import json
import uuid
import requests

app = Flask(__name__)
CORS(app)

# Config
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', '305business-dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///305business.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Telegram Config
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_ADMIN_CHAT_ID = os.environ.get('TELEGRAM_ADMIN_CHAT_ID', '7838956683')  # Jasmel's chat ID

db = SQLAlchemy(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'business-photos'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'documents'), exist_ok=True)

# ==================== MODELS ====================

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), default='seller')  # seller, buyer, admin, broker
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)
    
    listings = db.relationship('Listing', backref='seller', lazy=True)
    inquiries_made = db.relationship('Inquiry', foreign_keys='Inquiry.buyer_id', backref='buyer', lazy=True)

class Listing(db.Model):
    __tablename__ = 'listings'
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic Info
    business_name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    year_established = db.Column(db.Integer)
    location = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Financials
    asking_price = db.Column(db.Float, nullable=False)
    annual_revenue = db.Column(db.Float)
    annual_cash_flow = db.Column(db.Float)
    inventory_value = db.Column(db.Float)
    monthly_rent = db.Column(db.Float)
    lease_terms = db.Column(db.String(200))
    num_employees = db.Column(db.Integer)
    square_footage = db.Column(db.Integer)
    
    # Revenue History
    revenue_2021 = db.Column(db.Float)
    revenue_2022 = db.Column(db.Float)
    revenue_2023 = db.Column(db.Float)
    revenue_2024 = db.Column(db.Float)
    revenue_2025 = db.Column(db.Float)
    
    # Details
    business_hours = db.Column(db.String(100))
    parking = db.Column(db.String(50))
    reason_for_selling = db.Column(db.String(50))
    training_transition = db.Column(db.Text)
    growth_opportunities = db.Column(db.Text)
    
    # Features (stored as JSON)
    features = db.Column(db.Text, default='[]')  # JSON array
    
    # Status
    status = db.Column(db.String(20), default='pending')  # pending, active, negotiating, sold, rejected
    is_featured = db.Column(db.Boolean, default=False)
    
    # Media
    photos = db.Column(db.Text, default='[]')  # JSON array of file paths
    documents = db.Column(db.Text, default='[]')  # JSON array of file paths
    
    # Contact
    contact_name = db.Column(db.String(100))
    contact_email = db.Column(db.String(120))
    contact_phone = db.Column(db.String(20))
    
    # Foreign Keys
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    views = db.Column(db.Integer, default=0)
    inquiries_count = db.Column(db.Integer, default=0)
    ndas_signed = db.Column(db.Integer, default=0)

class Inquiry(db.Model):
    __tablename__ = 'inquiries'
    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Buyer Info (if not logged in)
    buyer_name = db.Column(db.String(100), nullable=False)
    buyer_email = db.Column(db.String(120), nullable=False)
    buyer_phone = db.Column(db.String(20))
    
    # Inquiry Details
    message = db.Column(db.Text)
    request_type = db.Column(db.String(50), default='info')  # info, viewing, nda, offer
    
    # NDA
    nda_signed = db.Column(db.Boolean, default=False)
    nda_signed_at = db.Column(db.DateTime)
    
    # Status
    status = db.Column(db.String(20), default='new')  # new, contacted, viewing_scheduled, nda_sent, closed
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    listing = db.relationship('Listing', backref='inquiries')

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    inquiry_id = db.Column(db.Integer, db.ForeignKey('inquiries.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    sender_name = db.Column(db.String(100), nullable=False)
    sender_role = db.Column(db.String(20), default='buyer')  # buyer, seller, admin
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    
    inquiry = db.relationship('Inquiry', backref='messages')

class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# ==================== HELPERS ====================

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1] if ' ' in request.headers['Authorization'] else request.headers['Authorization']
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

def send_telegram_notification(message, chat_id=None):
    """Send notification to Telegram"""
    if not TELEGRAM_BOT_TOKEN:
        print(f"[TELEGRAM MOCK] {message}")
        return True
    
    target_chat = chat_id or TELEGRAM_ADMIN_CHAT_ID
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    
    try:
        payload = {
            'chat_id': target_chat,
            'text': message,
            'parse_mode': 'HTML'
        }
        response = requests.post(url, json=payload, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"Telegram error: {e}")
        return False

def listing_to_dict(listing, include_private=False):
    """Convert listing to dictionary"""
    data = {
        'id': listing.id,
        'business_name': listing.business_name,
        'category': listing.category,
        'year_established': listing.year_established,
        'location': listing.location,
        'description': listing.description,
        'asking_price': listing.asking_price,
        'annual_revenue': listing.annual_revenue,
        'annual_cash_flow': listing.annual_cash_flow,
        'inventory_value': listing.inventory_value,
        'monthly_rent': listing.monthly_rent,
        'lease_terms': listing.lease_terms,
        'num_employees': listing.num_employees,
        'square_footage': listing.square_footage,
        'business_hours': listing.business_hours,
        'parking': listing.parking,
        'reason_for_selling': listing.reason_for_selling,
        'training_transition': listing.training_transition,
        'growth_opportunities': listing.growth_opportunities,
        'features': json.loads(listing.features) if listing.features else [],
        'status': listing.status,
        'is_featured': listing.is_featured,
        'photos': json.loads(listing.photos) if listing.photos else [],
        'views': listing.views,
        'inquiries_count': listing.inquiries_count,
        'ndas_signed': listing.ndas_signed,
        'created_at': listing.created_at.isoformat() if listing.created_at else None,
    }
    
    if include_private:
        data['contact_name'] = listing.contact_name
        data['contact_email'] = listing.contact_email
        data['contact_phone'] = listing.contact_phone
        data['revenue_2021'] = listing.revenue_2021
        data['revenue_2022'] = listing.revenue_2022
        data['revenue_2023'] = listing.revenue_2023
        data['revenue_2024'] = listing.revenue_2024
        data['revenue_2025'] = listing.revenue_2025
        data['documents'] = json.loads(listing.documents) if listing.documents else []
    
    return data

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Email, password, and name are required'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 409
    
    user = User(
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        name=data['name'],
        phone=data.get('phone', ''),
        role=data.get('role', 'seller')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Send Telegram notification
    send_telegram_notification(
        f"<b>🆕 New User Registered</b>\n\n"
        f"Name: {user.name}\n"
        f"Email: {user.email}\n"
        f"Role: {user.role}\n"
        f"Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}"
    )
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_me(current_user):
    return jsonify({
        'id': current_user.id,
        'name': current_user.name,
        'email': current_user.email,
        'role': current_user.role,
        'phone': current_user.phone
    })

# ==================== LISTING ROUTES ====================

@app.route('/api/listings', methods=['GET'])
def get_listings():
    """Get all active listings (public)"""
    category = request.args.get('category')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    location = request.args.get('location')
    featured = request.args.get('featured', type=bool)
    
    query = Listing.query.filter(Listing.status.in_(['active', 'negotiating']))
    
    if category:
        query = query.filter(Listing.category == category)
    if min_price:
        query = query.filter(Listing.asking_price >= min_price)
    if max_price:
        query = query.filter(Listing.asking_price <= max_price)
    if location:
        query = query.filter(Listing.location.ilike(f'%{location}%'))
    if featured:
        query = query.filter(Listing.is_featured == True)
    
    # Featured first, then newest
    query = query.order_by(Listing.is_featured.desc(), Listing.created_at.desc())
    
    listings = query.all()
    return jsonify([listing_to_dict(l) for l in listings])

@app.route('/api/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    """Get single listing"""
    listing = Listing.query.get_or_404(listing_id)
    
    # Increment views
    listing.views += 1
    db.session.commit()
    
    return jsonify(listing_to_dict(listing, include_private=True))

@app.route('/api/listings', methods=['POST'])
def create_listing():
    """Create new listing (public - no auth required for MVP)"""
    data = request.get_json() or {}
    
    # Handle both JSON body and form-like data
    listing = Listing(
        business_name=data.get('business_name', ''),
        category=data.get('category', ''),
        year_established=data.get('year_established', type=int),
        location=data.get('location', ''),
        description=data.get('description', ''),
        asking_price=float(data.get('asking_price', 0)),
        annual_revenue=float(data.get('annual_revenue', 0)) if data.get('annual_revenue') else None,
        annual_cash_flow=float(data.get('annual_cash_flow', 0)) if data.get('annual_cash_flow') else None,
        inventory_value=float(data.get('inventory_value', 0)) if data.get('inventory_value') else None,
        monthly_rent=float(data.get('monthly_rent', 0)) if data.get('monthly_rent') else None,
        lease_terms=data.get('lease_terms', ''),
        num_employees=data.get('num_employees', type=int),
        square_footage=data.get('square_footage', type=int),
        business_hours=data.get('business_hours', ''),
        parking=data.get('parking', ''),
        reason_for_selling=data.get('reason_for_selling', ''),
        training_transition=data.get('training_transition', ''),
        growth_opportunities=data.get('growth_opportunities', ''),
        features=json.dumps(data.get('features', [])),
        status='pending',  # Requires admin approval
        contact_name=data.get('contact_name', ''),
        contact_email=data.get('contact_email', ''),
        contact_phone=data.get('contact_phone', ''),
        revenue_2021=float(data.get('revenue_2021', 0)) if data.get('revenue_2021') else None,
        revenue_2022=float(data.get('revenue_2022', 0)) if data.get('revenue_2022') else None,
        revenue_2023=float(data.get('revenue_2023', 0)) if data.get('revenue_2023') else None,
        revenue_2024=float(data.get('revenue_2024', 0)) if data.get('revenue_2024') else None,
        revenue_2025=float(data.get('revenue_2025', 0)) if data.get('revenue_2025') else None,
    )
    
    db.session.add(listing)
    db.session.commit()
    
    # Send Telegram notification
    send_telegram_notification(
        f"<b>🏢 NEW BUSINESS LISTING</b>\n\n"
        f"📌 <b>{listing.business_name}</b>\n"
        f"📍 {listing.location}\n"
        f"💰 Asking: ${listing.asking_price:,.0f}\n"
        f"📊 Revenue: ${listing.annual_revenue:,.0f}" if listing.annual_revenue else "💰 Revenue: Not provided" + "\n"
        f"📂 Category: {listing.category}\n"
        f"👤 Contact: {listing.contact_name}\n"
        f"📧 {listing.contact_email}\n"
        f"📞 {listing.contact_phone}\n\n"
        f"<b>Status:</b> ⏳ PENDING APPROVAL\n"
        f"🔗 Review at: /admin\n\n"
        f"Approve or reject in admin dashboard."
    )
    
    return jsonify({
        'message': 'Listing submitted successfully',
        'id': listing.id,
        'status': listing.status,
        'reference': f'LIST-{listing.id:04d}'
    }), 201

@app.route('/api/listings/<int:listing_id>', methods=['PUT'])
@token_required
def update_listing(current_user, listing_id):
    """Update listing (owner or admin)"""
    listing = Listing.query.get_or_404(listing_id)
    
    if current_user.role != 'admin' and listing.seller_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update fields
    for field in ['business_name', 'category', 'location', 'description', 'status',
                  'asking_price', 'annual_revenue', 'annual_cash_flow', 'inventory_value',
                  'monthly_rent', 'lease_terms', 'num_employees', 'square_footage',
                  'business_hours', 'parking', 'reason_for_selling', 'training_transition',
                  'growth_opportunities', 'contact_name', 'contact_email', 'contact_phone']:
        if field in data:
            setattr(listing, field, data[field])
    
    if 'features' in data:
        listing.features = json.dumps(data['features'])
    if 'is_featured' in data:
        listing.is_featured = data['is_featured']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Listing updated successfully',
        'listing': listing_to_dict(listing, include_private=True)
    })

@app.route('/api/listings/<int:listing_id>', methods=['DELETE'])
@token_required
def delete_listing(current_user, listing_id):
    """Delete listing (owner or admin)"""
    listing = Listing.query.get_or_404(listing_id)
    
    if current_user.role != 'admin' and listing.seller_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    db.session.delete(listing)
    db.session.commit()
    
    return jsonify({'message': 'Listing deleted successfully'})

# ==================== INQUIRY ROUTES ====================

@app.route('/api/inquiries', methods=['POST'])
def create_inquiry():
    """Create inquiry (public)"""
    data = request.get_json()
    
    listing = Listing.query.get_or_404(data.get('listing_id'))
    
    inquiry = Inquiry(
        listing_id=data['listing_id'],
        buyer_id=data.get('buyer_id'),
        buyer_name=data.get('buyer_name', ''),
        buyer_email=data.get('buyer_email', ''),
        buyer_phone=data.get('buyer_phone', ''),
        message=data.get('message', ''),
        request_type=data.get('request_type', 'info')
    )
    
    db.session.add(inquiry)
    
    # Update listing inquiry count
    listing.inquiries_count += 1
    
    db.session.commit()
    
    # Send Telegram notification
    send_telegram_notification(
        f"<b>📩 NEW BUYER INQUIRY</b>\n\n"
        f"🏢 Listing: {listing.business_name}\n"
        f"👤 Buyer: {inquiry.buyer_name}\n"
        f"📧 {inquiry.buyer_email}\n"
        f"📞 {inquiry.buyer_phone}\n"
        f"💬 Type: {inquiry.request_type.upper()}\n\n"
        f"<b>Message:</b>\n{inquiry.message[:200]}{'...' if len(inquiry.message) > 200 else ''}\n\n"
        f"🔗 Respond in admin dashboard"
    )
    
    return jsonify({
        'message': 'Inquiry submitted successfully',
        'id': inquiry.id,
        'reference': f'INQ-{inquiry.id:04d}'
    }), 201

@app.route('/api/inquiries', methods=['GET'])
@token_required
def get_inquiries(current_user):
    """Get inquiries (admin sees all, seller sees their listings' inquiries)"""
    if current_user.role == 'admin':
        inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    else:
        # Get inquiries for seller's listings
        listings = Listing.query.filter_by(seller_id=current_user.id).all()
        listing_ids = [l.id for l in listings]
        inquiries = Inquiry.query.filter(Inquiry.listing_id.in_(listing_ids)).order_by(Inquiry.created_at.desc()).all()
    
    result = []
    for i in inquiries:
        result.append({
            'id': i.id,
            'listing_id': i.listing_id,
            'listing_name': i.listing.business_name if i.listing else 'Unknown',
            'buyer_name': i.buyer_name,
            'buyer_email': i.buyer_email,
            'buyer_phone': i.buyer_phone,
            'message': i.message,
            'request_type': i.request_type,
            'status': i.status,
            'nda_signed': i.nda_signed,
            'created_at': i.created_at.isoformat() if i.created_at else None,
        })
    
    return jsonify(result)

@app.route('/api/inquiries/<int:inquiry_id>/status', methods=['PUT'])
@token_required
def update_inquiry_status(current_user, inquiry_id):
    """Update inquiry status"""
    inquiry = Inquiry.query.get_or_404(inquiry_id)
    data = request.get_json()
    
    inquiry.status = data.get('status', inquiry.status)
    if data.get('nda_signed'):
        inquiry.nda_signed = True
        inquiry.nda_signed_at = datetime.datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Inquiry updated', 'status': inquiry.status})

# ==================== MESSAGE / CHAT ROUTES ====================

@app.route('/api/messages', methods=['POST'])
def create_message():
    """Send message in inquiry thread"""
    data = request.get_json()
    
    message = Message(
        inquiry_id=data['inquiry_id'],
        sender_id=data.get('sender_id'),
        sender_name=data['sender_name'],
        sender_role=data.get('sender_role', 'buyer'),
        content=data['content']
    )
    
    db.session.add(message)
    db.session.commit()
    
    # Get inquiry for notification
    inquiry = Inquiry.query.get(data['inquiry_id'])
    if inquiry:
        listing = Listing.query.get(inquiry.listing_id)
        send_telegram_notification(
            f"<b>💬 NEW MESSAGE</b>\n\n"
            f"🏢 {listing.business_name if listing else 'Unknown'}\n"
            f"👤 {message.sender_name} ({message.sender_role})\n\n"
            f"{message.content[:150]}{'...' if len(message.content) > 150 else ''}\n\n"
            f"🔗 Check admin dashboard"
        )
    
    return jsonify({
        'id': message.id,
        'created_at': message.created_at.isoformat() if message.created_at else None
    }), 201

@app.route('/api/messages/<int:inquiry_id>', methods=['GET'])
def get_messages(inquiry_id):
    """Get all messages for an inquiry"""
    messages = Message.query.filter_by(inquiry_id=inquiry_id).order_by(Message.created_at).all()
    
    return jsonify([{
        'id': m.id,
        'sender_name': m.sender_name,
        'sender_role': m.sender_role,
        'content': m.content,
        'created_at': m.created_at.isoformat() if m.created_at else None,
        'is_read': m.is_read
    } for m in messages])

# ==================== ADMIN ROUTES ====================

@app.route('/api/admin/stats', methods=['GET'])
@token_required
@admin_required
def admin_stats(current_user):
    """Get admin dashboard statistics"""
    total_listings = Listing.query.count()
    active_listings = Listing.query.filter_by(status='active').count()
    pending_listings = Listing.query.filter_by(status='pending').count()
    total_inquiries = Inquiry.query.count()
    new_inquiries = Inquiry.query.filter_by(status='new').count()
    total_users = User.query.count()
    total_views = db.session.query(db.func.sum(Listing.views)).scalar() or 0
    
    # Recent activity
    recent_listings = Listing.query.order_by(Listing.created_at.desc()).limit(5).all()
    recent_inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).limit(5).all()
    
    return jsonify({
        'stats': {
            'total_listings': total_listings,
            'active_listings': active_listings,
            'pending_listings': pending_listings,
            'total_inquiries': total_inquiries,
            'new_inquiries': new_inquiries,
            'total_users': total_users,
            'total_views': int(total_views)
        },
        'recent_listings': [listing_to_dict(l, include_private=True) for l in recent_listings],
        'recent_inquiries': [{
            'id': i.id,
            'listing_name': i.listing.business_name if i.listing else 'Unknown',
            'buyer_name': i.buyer_name,
            'buyer_email': i.buyer_email,
            'request_type': i.request_type,
            'status': i.status,
            'created_at': i.created_at.isoformat() if i.created_at else None
        } for i in recent_inquiries]
    })

@app.route('/api/admin/listings', methods=['GET'])
@token_required
@admin_required
def admin_listings(current_user):
    """Get all listings for admin (includes pending)"""
    status = request.args.get('status')
    
    query = Listing.query
    if status:
        query = query.filter_by(status=status)
    
    listings = query.order_by(Listing.created_at.desc()).all()
    return jsonify([listing_to_dict(l, include_private=True) for l in listings])

@app.route('/api/admin/inquiries', methods=['GET'])
@token_required
@admin_required
def admin_inquiries(current_user):
    """Get all inquiries for admin"""
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    
    result = []
    for i in inquiries:
        result.append({
            'id': i.id,
            'listing_id': i.listing_id,
            'listing_name': i.listing.business_name if i.listing else 'Unknown',
            'buyer_name': i.buyer_name,
            'buyer_email': i.buyer_email,
            'buyer_phone': i.buyer_phone,
            'message': i.message,
            'request_type': i.request_type,
            'status': i.status,
            'nda_signed': i.nda_signed,
            'created_at': i.created_at.isoformat() if i.created_at else None,
        })
    
    return jsonify(result)

@app.route('/api/admin/listings/<int:listing_id>/approve', methods=['POST'])
@token_required
@admin_required
def approve_listing(current_user, listing_id):
    """Approve a pending listing"""
    listing = Listing.query.get_or_404(listing_id)
    listing.status = 'active'
    db.session.commit()
    
    send_telegram_notification(
        f"<b>✅ LISTING APPROVED</b>\n\n"
        f"📌 {listing.business_name}\n"
        f"📍 {listing.location}\n"
        f"💰 ${listing.asking_price:,.0f}\n\n"
        f"Listing is now LIVE on the marketplace."
    )
    
    return jsonify({'message': 'Listing approved', 'status': 'active'})

@app.route('/api/admin/listings/<int:listing_id>/reject', methods=['POST'])
@token_required
@admin_required
def reject_listing(current_user, listing_id):
    """Reject a pending listing"""
    listing = Listing.query.get_or_404(listing_id)
    data = request.get_json() or {}
    
    listing.status = 'rejected'
    db.session.commit()
    
    send_telegram_notification(
        f"<b>❌ LISTING REJECTED</b>\n\n"
        f"📌 {listing.business_name}\n"
        f"Reason: {data.get('reason', 'No reason provided')}\n\n"
        f"Seller has been notified."
    )
    
    return jsonify({'message': 'Listing rejected', 'status': 'rejected'})


@app.route('/api/admin/users', methods=['GET'])
@token_required
@admin_required
def admin_users(current_user):
    """Get all users for admin"""
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([{
        'id': u.id,
        'name': u.name,
        'email': u.email,
        'phone': u.phone,
        'role': u.role,
        'is_verified': u.is_verified,
        'created_at': u.created_at.isoformat() if u.created_at else None
    } for u in users])

# ==================== UPLOAD ROUTES ====================

@app.route('/api/upload/photo', methods=['POST'])
def upload_photo():
    """Upload business photo"""
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    filepath = os.path.join('business-photos', filename)
    full_path = os.path.join(app.config['UPLOAD_FOLDER'], filepath)
    file.save(full_path)
    
    return jsonify({
        'message': 'File uploaded successfully',
        'filename': filename,
        'url': f"/uploads/{filepath}"
    })

@app.route('/api/upload/document', methods=['POST'])
def upload_document():
    """Upload business document (NDA, financials, etc.)"""
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    filepath = os.path.join('documents', filename)
    full_path = os.path.join(app.config['UPLOAD_FOLDER'], filepath)
    file.save(full_path)
    
    return jsonify({
        'message': 'Document uploaded successfully',
        'filename': filename,
        'url': f"/uploads/{filepath}"
    })

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ==================== HEALTH / TEST ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'database': 'connected'
    })

@app.route('/api/test/telegram', methods=['GET'])
def test_telegram():
    """Test Telegram notification"""
    success = send_telegram_notification(
        f"<b>🧪 TEST NOTIFICATION</b>\n\n"
        f"305business.llc backend is working!\n"
        f"Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        f"If you see this, Telegram notifications are configured correctly."
    )
    
    return jsonify({
        'success': success,
        'message': 'Test notification sent'
    })

# ==================== INITIALIZATION ====================

@app.route('/api/init', methods=['POST'])
def init_database():
    """Initialize database with demo data (for first setup)"""
    try:
        db.create_all()
        
        # Create admin user
        admin = User.query.filter_by(email='admin@305business.llc').first()
        if not admin:
            admin = User(
                email='admin@305business.llc',
                password_hash=generate_password_hash('admin305'),
                name='305business Admin',
                role='admin'
            )
            db.session.add(admin)
        
        # Create demo listings if none exist
        if Listing.query.count() == 0:
            demo_listings = [
                Listing(
                    business_name="Miami Beach Café",
                    category="restaurant",
                    year_established=2015,
                    location="Miami Beach, FL",
                    description="Established café with ocean views. 45 seats, full kitchen, loyal customer base. Perfect for owner-operator looking for a turn-key operation in prime Miami Beach location.",
                    asking_price=185000,
                    annual_revenue=420000,
                    annual_cash_flow=85000,
                    inventory_value=15000,
                    monthly_rent=4500,
                    lease_terms="5 years remaining",
                    num_employees=8,
                    square_footage=1200,
                    business_hours="Mon-Sun 7AM-10PM",
                    parking="street",
                    reason_for_selling="retirement",
                    training_transition="2 weeks hands-on training plus 30 days phone support",
                    growth_opportunities="Expand catering, add delivery, extend hours for nightlife crowd",
                    features=json.dumps(["real_estate", "equipment", "liquor_license", "established_clients", "pos_system"]),
                    status='active',
                    contact_name="Carlos Martinez",
                    contact_email="carlos@cafeexample.com",
                    contact_phone="305-555-0100",
                    revenue_2021=280000,
                    revenue_2022=320000,
                    revenue_2023=350000,
                    revenue_2024=420000,
                    revenue_2025=450000,
                ),
                Listing(
                    business_name="Brickell Medical Billing",
                    category="healthcare",
                    year_established=2018,
                    location="Brickell, Miami, FL",
                    description="Profitable medical billing company serving 12 physician practices. Recurring revenue model, trained staff, proprietary software included.",
                    asking_price=495000,
                    annual_revenue=680000,
                    annual_cash_flow=185000,
                    inventory_value=0,
                    monthly_rent=3200,
                    lease_terms="3 years remaining",
                    num_employees=5,
                    square_footage=800,
                    business_hours="Mon-Fri 9AM-5PM",
                    parking="lot",
                    reason_for_selling="new-venture",
                    training_transition="60 days transition with all client introductions",
                    growth_opportunities="Add credentialing services, expand to DME billing, add coding education",
                    features=json.dumps(["equipment", "trademarks", "established_clients", "website", "social_media"]),
                    status='active',
                    contact_name="Dr. Sarah Chen",
                    contact_email="sarah@brickellbilling.com",
                    contact_phone="305-555-0200",
                    revenue_2021=450000,
                    revenue_2022=520000,
                    revenue_2023=580000,
                    revenue_2024=680000,
                    revenue_2025=720000,
                ),
                Listing(
                    business_name="Wynwood Art Gallery & Studio",
                    category="retail",
                    year_established=2019,
                    location="Wynwood, Miami, FL",
                    description="Premier art gallery in Wynwood Walls district. Represents 15 local artists, hosts monthly events, strong Instagram following.",
                    asking_price=320000,
                    annual_revenue=380000,
                    annual_cash_flow=95000,
                    inventory_value=45000,
                    monthly_rent=5800,
                    lease_terms="4 years remaining",
                    num_employees=3,
                    square_footage=1500,
                    business_hours="Tue-Sun 11AM-7PM",
                    parking="garage",
                    reason_for_selling="relocation",
                    training_transition="Artist relationships and event calendar handed over",
                    growth_opportunities="Add online store, art classes, corporate events",
                    features=json.dumps(["equipment", "established_clients", "website", "social_media", "trademarks"]),
                    status='active',
                    contact_name="Alejandro Reyes",
                    contact_email="alex@wynwoodgallery.com",
                    contact_phone="305-555-0300",
                    revenue_2021=220000,
                    revenue_2022=280000,
                    revenue_2023=320000,
                    revenue_2024=380000,
                    revenue_2025=410000,
                ),
                Listing(
                    business_name="Little Havana Auto Repair & Transmission",
                    category="automotive",
                    year_established=2008,
                    location="Little Havana, Miami, FL",
                    description="Full-service auto repair with 4 bays, alignment rack, and smog certification. Loyal Hispanic clientele, Spanish-speaking staff. $850K revenue with consistent 22% margins.",
                    asking_price=650000,
                    annual_revenue=850000,
                    annual_cash_flow=187000,
                    inventory_value=85000,
                    monthly_rent=6200,
                    lease_terms="7 years remaining",
                    num_employees=6,
                    square_footage=3200,
                    business_hours="Mon-Sat 8AM-6PM",
                    parking="lot",
                    reason_for_selling="health-concerns",
                    training_transition="30 days shadowing owner, vendor introductions, customer database",
                    growth_opportunities="Add tire sales, fleet contracts, mobile diagnostic service",
                    features=json.dumps(["equipment", "established_clients", "website", "pos_system"]),
                    status='active',
                    contact_name="Roberto Fernandez",
                    contact_email="roberto@lhavanaauto.com",
                    contact_phone="305-555-0400",
                    revenue_2021=720000,
                    revenue_2022=780000,
                    revenue_2023=810000,
                    revenue_2024=850000,
                    revenue_2025=890000,
                ),
                Listing(
                    business_name="Coral Gables Luxury Hair Salon",
                    category="beauty",
                    year_established=2012,
                    location="Coral Gables, Miami, FL",
                    description="Upscale salon with 12 styling stations, private bridal suite, and retail boutique. Clientele avg ticket $180. High-end Gables location with valet parking.",
                    asking_price=420000,
                    annual_revenue=580000,
                    annual_cash_flow=135000,
                    inventory_value=22000,
                    monthly_rent=7500,
                    lease_terms="3 years + 5yr option",
                    num_employees=9,
                    square_footage=1800,
                    business_hours="Tue-Sat 9AM-7PM",
                    parking="valet",
                    reason_for_selling="family-relocation",
                    training_transition="Introduce to all stylists (independent contractors), hand over client book",
                    growth_opportunities="Add med-spa services, bridal packages, product line private label",
                    features=json.dumps(["equipment", "established_clients", "website", "social_media", "pos_system"]),
                    status='active',
                    contact_name="Isabella Romano",
                    contact_email="isabella@cgsalon.com",
                    contact_phone="305-555-0500",
                    revenue_2021=420000,
                    revenue_2022=480000,
                    revenue_2023=520000,
                    revenue_2024=580000,
                    revenue_2025=610000,
                ),
                Listing(
                    business_name="El Pan Cubano — Authentic Bakery",
                    category="food",
                    year_established=1998,
                    location="Little Havana, Miami, FL",
                    description="Beloved Cuban bakery known for guava pastelitos, Cuban bread, and birthday cakes. Wholesale accounts to 8 local restaurants. Original family recipes.",
                    asking_price=295000,
                    annual_revenue=520000,
                    annual_cash_flow=98000,
                    inventory_value=8000,
                    monthly_rent=3800,
                    lease_terms="Owned building — property included",
                    num_employees=7,
                    square_footage=1400,
                    business_hours="Mon-Sat 5AM-3PM",
                    parking="street",
                    reason_for_selling="retirement",
                    training_transition="Secret recipes and baking techniques passed to new owner",
                    growth_opportunities="Expand wholesale, add coffee bar, ship nationwide",
                    features=json.dumps(["real_estate", "equipment", "established_clients", "trademarks", "pos_system"]),
                    status='active',
                    contact_name="Marta Gonzalez",
                    contact_email="marta@elpanmiami.com",
                    contact_phone="305-555-0600",
                    revenue_2021=380000,
                    revenue_2022=420000,
                    revenue_2023=460000,
                    revenue_2024=520000,
                    revenue_2025=540000,
                ),
                Listing(
                    business_name="Downtown Miami CPA & Advisory Firm",
                    category="professional",
                    year_established=2005,
                    location="Downtown Miami, FL",
                    description="Established CPA firm with 45 active business clients and 120 individual tax clients. Two CPAs on staff, QuickBooks certified. Recurring tax prep + advisory revenue.",
                    asking_price=380000,
                    annual_revenue=450000,
                    annual_cash_flow=145000,
                    inventory_value=5000,
                    monthly_rent=4200,
                    lease_terms="2 years remaining",
                    num_employees=4,
                    square_footage=1100,
                    business_hours="Mon-Fri 9AM-6PM",
                    parking="garage",
                    reason_for_selling="new-venture",
                    training_transition="60 day client transition, access to all files and software licenses",
                    growth_opportunities="Add bookkeeping service, fractional CFO packages, audit prep",
                    features=json.dumps(["equipment", "established_clients", "website", "trademarks"]),
                    status='active',
                    contact_name="James Mitchell CPA",
                    contact_email="james@mitchellcpa.com",
                    contact_phone="305-555-0700",
                    revenue_2021=360000,
                    revenue_2022=390000,
                    revenue_2023=410000,
                    revenue_2024=450000,
                    revenue_2025=470000,
                ),
                Listing(
                    business_name="Aventura Pet Grooming & Spa",
                    category="services",
                    year_established=2017,
                    location="Aventura, Miami, FL",
                    description="Premium pet grooming with spa treatments, mobile van, and retail boutique. 400+ recurring clients. App-based booking system. High-income Aventura demographics.",
                    asking_price=165000,
                    annual_revenue=310000,
                    annual_cash_flow=72000,
                    inventory_value=12000,
                    monthly_rent=2800,
                    lease_terms="3 years remaining",
                    num_employees=4,
                    square_footage=900,
                    business_hours="Mon-Sat 9AM-6PM",
                    parking="lot",
                    reason_for_selling="new-venture",
                    training_transition="Pet handling certification, groomer relationships, booking app",
                    growth_opportunities="Add boarding, veterinary partnerships, second mobile van",
                    features=json.dumps(["equipment", "established_clients", "website", "social_media", "pos_system"]),
                    status='active',
                    contact_name="Rachel Kim",
                    contact_email="rachel@aventurapets.com",
                    contact_phone="305-555-0800",
                    revenue_2021=220000,
                    revenue_2022=250000,
                    revenue_2023=270000,
                    revenue_2024=310000,
                    revenue_2025=330000,
                ),
                Listing(
                    business_name="Kendall Strength & Conditioning Studio",
                    category="fitness",
                    year_established=2020,
                    location="Kendall, Miami, FL",
                    description="Boutique fitness studio specializing in personal training and small group classes. 85 active memberships, 4 trainers, app-based class booking. Strong social media presence.",
                    asking_price=210000,
                    annual_revenue=280000,
                    annual_cash_flow=68000,
                    inventory_value=18000,
                    monthly_rent=3400,
                    lease_terms="4 years remaining",
                    num_employees=4,
                    square_footage=1600,
                    business_hours="Mon-Fri 6AM-9PM, Sat 8AM-2PM",
                    parking="lot",
                    reason_for_selling="relocation",
                    training_transition="Trainer contracts, class schedules, social media accounts",
                    growth_opportunities="Add nutrition coaching, corporate wellness, online training platform",
                    features=json.dumps(["equipment", "established_clients", "website", "social_media", "pos_system"]),
                    status='active',
                    contact_name="Marcus Johnson",
                    contact_email="marcus@kendallstrength.com",
                    contact_phone="305-555-0900",
                    revenue_2021=150000,
                    revenue_2022=190000,
                    revenue_2023=230000,
                    revenue_2024=280000,
                    revenue_2025=295000,
                ),
                Listing(
                    business_name="Miami Lakes Convenience Store & Liquor",
                    category="retail",
                    year_established=2010,
                    location="Miami Lakes, FL",
                    description="High-traffic convenience store with beer/wine license, ATM, lottery, and hot food counter. Corner location on main thoroughfare. 6AM-11PM daily operation.",
                    asking_price=275000,
                    annual_revenue=890000,
                    annual_cash_flow=125000,
                    inventory_value=65000,
                    monthly_rent=5200,
                    lease_terms="5 years remaining",
                    num_employees=5,
                    square_footage=2000,
                    business_hours="Daily 6AM-11PM",
                    parking="lot",
                    reason_for_selling="retirement",
                    training_transition="Vendor accounts, lottery terminal, hot food recipes, inventory system",
                    growth_opportunities="Add CBD products, expand hot food, add delivery via DoorDash",
                    features=json.dumps(["equipment", "liquor_license", "established_clients", "pos_system", "website"]),
                    status='active',
                    contact_name="Hassan Patel",
                    contact_email="hassan@mlakesmarket.com",
                    contact_phone="305-555-1000",
                    revenue_2021=720000,
                    revenue_2022=780000,
                    revenue_2023=820000,
                    revenue_2024=890000,
                    revenue_2025=920000,
                ),
            ]
            
            for l in demo_listings:
                db.session.add(l)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Database initialized successfully',
            'admin_created': True,
            'demo_listings_created': len(demo_listings) if 'demo_listings' in dir() else 0
        })
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Create tables on first run
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
