--
-- 305business.llc Supabase Database Schema
-- Miami Business Marketplace — Complete Data Layer
--

-- ───────────────────────────────────────────────────────────────────────────
-- 1. BUSINESS LISTINGS
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    business_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    year_established INTEGER,
    
    -- Location
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) DEFAULT 'Miami',
    county VARCHAR(100) DEFAULT 'Miami-Dade',
    state VARCHAR(50) DEFAULT 'FL',
    zip_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Description & SEO
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    seo_keywords TEXT[],
    ai_generated_description BOOLEAN DEFAULT FALSE,
    
    -- Financials
    asking_price DECIMAL(12,2),
    annual_revenue DECIMAL(12,2),
    annual_cash_flow DECIMAL(12,2),
    inventory_value DECIMAL(12,2),
    monthly_rent DECIMAL(10,2),
    lease_terms VARCHAR(255),
    num_employees INTEGER,
    square_footage INTEGER,
    
    -- Revenue History
    revenue_2021 DECIMAL(12,2),
    revenue_2022 DECIMAL(12,2),
    revenue_2023 DECIMAL(12,2),
    revenue_2024 DECIMAL(12,2),
    revenue_2025 DECIMAL(12,2),
    
    -- Business Details
    business_hours VARCHAR(200),
    parking VARCHAR(100),
    reason_for_selling VARCHAR(100),
    training_transition TEXT,
    growth_opportunities TEXT,
    
    -- Features (array)
    features TEXT[] DEFAULT '{}',
    
    -- Media
    photos TEXT[] DEFAULT '{}',
    documents TEXT[] DEFAULT '{}',
    logo_url VARCHAR(500),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'negotiating', 'sold', 'rejected', 'featured')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- SEO / AI
    ai_score INTEGER DEFAULT 0,
    search_rank INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    
    -- Subscription Tier
    tier VARCHAR(50) DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise', 'featured')),
    tier_expires_at TIMESTAMPTZ,
    
    -- Seller Info
    seller_name VARCHAR(255),
    seller_email VARCHAR(255) NOT NULL,
    seller_phone VARCHAR(50),
    seller_id UUID, -- references users if auth enabled
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    -- Structured Data
    schema_org_type VARCHAR(100) DEFAULT 'LocalBusiness',
    schema_org_data JSONB
);

CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_price ON listings(asking_price);
CREATE INDEX idx_listings_featured ON listings(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_listings_tier ON listings(tier);
CREATE INDEX idx_listings_slug ON listings(slug);
CREATE INDEX idx_listings_seo ON listings USING GIN(seo_keywords);
CREATE INDEX idx_listings_search ON listings USING gin(to_tsvector('english', business_name || ' ' || COALESCE(description, '')));

-- ───────────────────────────────────────────────────────────────────────────
-- 2. USER ACCOUNTS (Sellers, Buyers, Brokers)
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'seller' CHECK (role IN ('seller', 'buyer', 'broker', 'admin')),
    
    -- Profile
    company VARCHAR(255),
    title VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[] DEFAULT '{}',
    
    -- Subscription
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'active',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    
    -- Activity
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ───────────────────────────────────────────────────────────────────────────
-- 3. INQUIRIES / LEADS
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(50),
    buyer_message TEXT,
    
    -- Buyer Profile
    buyer_budget DECIMAL(12,2),
    buyer_timeline VARCHAR(100),
    buyer_financing VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'negotiating', 'closed', 'archived')),
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    
    -- Follow-up
    notes TEXT,
    follow_up_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_listing ON inquiries(listing_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- ───────────────────────────────────────────────────────────────────────────
-- 4. SUBSCRIPTIONS / PAYMENTS
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    
    -- Plan
    plan_name VARCHAR(100) NOT NULL, -- 'pro_monthly', 'enterprise_monthly', 'featured_weekly'
    plan_tier VARCHAR(50) NOT NULL,
    
    -- Pricing
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    interval VARCHAR(50) DEFAULT 'month', -- month, year, week
    
    -- Stripe
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
    
    -- Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ───────────────────────────────────────────────────────────────────────────
-- 5. PAYMENTS
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id),
    user_id UUID REFERENCES users(id),
    
    -- Payment Details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    
    -- Metadata
    description VARCHAR(255),
    failure_message VARCHAR(500),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 6. CATEGORIES
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    
    -- SEO
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    
    -- Stats
    listing_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Restaurants & Food', 'restaurants-food', 'Restaurants, cafes, food trucks, catering businesses', 'utensils'),
    ('Retail & Stores', 'retail-stores', 'Retail stores, boutiques, convenience stores', 'store'),
    ('Healthcare & Medical', 'healthcare-medical', 'Medical practices, clinics, dental offices', 'hospital'),
    ('Professional Services', 'professional-services', 'Law firms, accounting, consulting', 'briefcase'),
    ('Automotive', 'automotive', 'Auto repair, car washes, dealerships', 'car'),
    ('Beauty & Wellness', 'beauty-wellness', 'Salons, spas, gyms, wellness centers', 'spa'),
    ('Technology', 'technology', 'Tech companies, software, IT services', 'laptop'),
    ('Manufacturing', 'manufacturing', 'Manufacturing, distribution, warehouses', 'industry'),
    ('Construction', 'construction', 'Construction, contracting, trades', 'hard-hat'),
    ('Hospitality', 'hospitality', 'Hotels, motels, vacation rentals', 'hotel'),
    ('Real Estate', 'real-estate', 'Property management, real estate agencies', 'home'),
    ('Education', 'education', 'Schools, tutoring, training centers', 'graduation-cap'),
    ('Transportation', 'transportation', 'Logistics, delivery, moving services', 'truck'),
    ('Entertainment', 'entertainment', 'Bars, clubs, event venues, recreation', 'cocktail'),
    ('Other', 'other', 'Miscellaneous businesses', 'ellipsis');

-- ───────────────────────────────────────────────────────────────────────────
-- 7. ACTIVITY LOG
-- ───────────────────────────────────────────────────────────────────────────
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    
    activity_type VARCHAR(50) CHECK (activity_type IN (
        'listing_created', 'listing_updated', 'listing_viewed',
        'inquiry_sent', 'inquiry_replied', 'subscription_created',
        'payment_succeeded', 'payment_failed', 'user_registered'
    )),
    
    description TEXT,
    metadata JSONB,
    ip_address INET,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_log_listing ON activity_log(listing_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_type ON activity_log(activity_type);

-- ───────────────────────────────────────────────────────────────────────────
-- VIEWS
-- ───────────────────────────────────────────────────────────────────────────

-- Active Listings View
CREATE VIEW active_listings AS
SELECT 
    l.*,
    c.name as category_name,
    u.name as seller_name,
    u.phone as seller_phone
FROM listings l
LEFT JOIN categories c ON l.category = c.name
LEFT JOIN users u ON l.seller_id = u.id
WHERE l.status = 'active'
ORDER BY l.is_featured DESC, l.created_at DESC;

-- Featured Listings View
CREATE VIEW featured_listings AS
SELECT * FROM listings
WHERE status = 'active' AND is_featured = TRUE
ORDER BY created_at DESC;

-- Category Stats View
CREATE VIEW category_stats AS
SELECT 
    c.id,
    c.name,
    c.slug,
    COUNT(l.id) as listing_count,
    AVG(l.asking_price) as avg_price,
    MIN(l.asking_price) as min_price,
    MAX(l.asking_price) as max_price
FROM categories c
LEFT JOIN listings l ON l.category = c.name AND l.status = 'active'
GROUP BY c.id, c.name, c.slug;

-- Daily Inquiries View
CREATE VIEW daily_inquiries AS
SELECT 
    DATE_TRUNC('day', created_at) as day,
    COUNT(*) as inquiry_count,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_count,
    COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_count
FROM inquiries
GROUP BY DATE_TRUNC('day', created_at);

-- ───────────────────────────────────────────────────────────────────────────
-- FUNCTIONS
-- ───────────────────────────────────────────────────────────────────────────

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate slug function
CREATE OR REPLACE FUNCTION generate_slug(business_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 1;
BEGIN
    base_slug := lower(regexp_replace(business_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    new_slug := base_slug;
    
    WHILE EXISTS(SELECT 1 FROM listings WHERE slug = new_slug) LOOP
        new_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- ───────────────────────────────────────────────────────────────────────────
-- RLS POLICIES
-- ───────────────────────────────────────────────────────────────────────────

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Anyone can read active listings
CREATE POLICY active_listings_select ON listings FOR SELECT
    USING (status = 'active');

-- Sellers can manage their own listings
CREATE POLICY own_listings_manage ON listings FOR ALL TO authenticated
    USING (seller_id::text = auth.uid()::text);

-- Admins can do everything
CREATE POLICY admin_all ON listings FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- ───────────────────────────────────────────────────────────────────────────
-- END
-- ───────────────────────────────────────────────────────────────────────────
