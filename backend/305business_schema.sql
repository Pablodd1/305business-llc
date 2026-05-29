-- 305business.llc Supabase Schema
-- Created: 2026-05-29

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Businesses table (main listings)
CREATE TABLE businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Business info
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT,
    subcategory TEXT,
    description TEXT,
    
    -- Location
    address TEXT,
    city TEXT DEFAULT 'Miami',
    state TEXT DEFAULT 'FL',
    zip TEXT,
    neighborhood TEXT,
    
    -- Financials
    asking_price DECIMAL(12,2),
    annual_revenue DECIMAL(12,2),
    cash_flow DECIMAL(12,2),
    inventory_value DECIMAL(12,2),
    real_estate_included BOOLEAN DEFAULT FALSE,
    
    -- Details
    year_established INTEGER,
    employee_count INTEGER,
    square_footage INTEGER,
    lease_terms TEXT,
    reason_for_selling TEXT,
    
    -- Assets
    equipment_included TEXT,
    intellectual_property TEXT,
    
    -- Contact (seller info - private)
    seller_name TEXT,
    seller_email TEXT,
    seller_phone TEXT,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'withdrawn')),
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    
    -- Media
    logo_url TEXT,
    images JSONB DEFAULT '[]',
    documents JSONB DEFAULT '[]',
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Listing type
    listing_type TEXT DEFAULT 'standard' CHECK (listing_type IN ('standard', 'premium', 'featured')),
    
    -- Views/engagement
    view_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0
);

-- Create index for slug
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_featured ON businesses(featured) WHERE featured = TRUE;
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_price ON businesses(asking_price);

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE,
    icon TEXT,
    description TEXT,
    business_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, icon, description) VALUES
('Restaurant & Food', 'restaurant-food', 'utensils', 'Restaurants, cafes, food trucks, catering businesses'),
('Retail & Stores', 'retail-stores', 'store', 'Shops, boutiques, convenience stores, e-commerce'),
('Healthcare & Medical', 'healthcare-medical', 'heartbeat', 'Medical practices, dental offices, clinics, pharmacies'),
('Service & Trade', 'service-trade', 'tools', 'Auto repair, plumbing, electrical, landscaping, cleaning'),
('Professional Services', 'professional-services', 'briefcase', 'Law firms, accounting, consulting, marketing agencies'),
('Technology & Software', 'technology-software', 'laptop-code', 'SaaS, app development, IT services, tech startups'),
('Hospitality & Tourism', 'hospitality-tourism', 'hotel', 'Hotels, motels, vacation rentals, travel agencies'),
('Fitness & Wellness', 'fitness-wellness', 'dumbbell', 'Gyms, yoga studios, spas, wellness centers'),
('Education & Training', 'education-training', 'graduation-cap', 'Schools, tutoring, training centers, daycares'),
('Real Estate & Property', 'real-estate-property', 'building', 'Property management, real estate brokerages, construction'),
('Manufacturing & Industrial', 'manufacturing-industrial', 'industry', 'Factories, warehouses, production facilities'),
('Entertainment & Recreation', 'entertainment-recreation', 'gamepad', 'Bars, nightclubs, arcades, event venues'),
('Wholesale & Distribution', 'wholesale-distribution', 'truck', 'Distributors, wholesalers, import/export businesses'),
('Automotive & Transportation', 'automotive-transportation', 'car', 'Car dealerships, auto shops, transport companies'),
('Other', 'other', 'ellipsis-h', 'Businesses that dont fit other categories');

-- Inquiries table (buyer inquiries)
CREATE TABLE inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Buyer info
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    
    -- Message
    subject TEXT,
    message TEXT,
    
    -- Status
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'negotiating', 'closed', 'archived')),
    
    -- NDA
    nda_signed BOOLEAN DEFAULT FALSE,
    nda_signed_at TIMESTAMP WITH TIME ZONE,
    
    -- Follow-up
    notes TEXT,
    assigned_to TEXT
);

CREATE INDEX idx_inquiries_business_id ON inquiries(business_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- Valuations table (valuation requests)
CREATE TABLE valuations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Business info
    business_name TEXT NOT NULL,
    category TEXT,
    
    -- Financials
    annual_revenue DECIMAL(12,2),
    net_profit DECIMAL(12,2),
    total_assets DECIMAL(12,2),
    total_liabilities DECIMAL(12,2),
    
    -- Contact
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    
    -- Results (filled after valuation is done)
    estimated_value_low DECIMAL(12,2),
    estimated_value_high DECIMAL(12,2),
    valuation_report_url TEXT,
    notes TEXT,
    
    -- Payment
    paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP WITH TIME ZONE,
    amount_paid DECIMAL(8,2) DEFAULT 495.00
);

CREATE INDEX idx_valuations_status ON valuations(status);
CREATE INDEX idx_valuations_email ON valuations(contact_email);

-- Listing submissions (from list-business.html form)
CREATE TABLE listing_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Business info
    business_name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    
    -- Location
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    
    -- Financials
    asking_price DECIMAL(12,2),
    annual_revenue DECIMAL(12,2),
    
    -- Contact
    seller_name TEXT NOT NULL,
    seller_email TEXT NOT NULL,
    seller_phone TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'needs_info')),
    
    -- Admin
    reviewed_by TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    -- Converted to real business listing
    business_id UUID REFERENCES businesses(id)
);

CREATE INDEX idx_listing_submissions_status ON listing_submissions(status);

-- Contact messages (general contact form)
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    
    -- Admin
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by TEXT
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- Activity log (for admin dashboard)
CREATE TABLE activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    user_email TEXT,
    details JSONB,
    ip_address TEXT
);

CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Businesses: anyone can read active listings, only admin can write
CREATE POLICY businesses_read ON businesses
    FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY businesses_insert ON businesses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY businesses_update ON businesses
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Inquiries: users can read their own, admin can read all
CREATE POLICY inquiries_select ON inquiries
    FOR SELECT USING (buyer_email = auth.jwt()->>'email' OR auth.role() = 'service_role');

CREATE POLICY inquiries_insert ON inquiries
    FOR INSERT WITH CHECK (true); -- Anyone can submit an inquiry

-- Valuations: users can read their own
CREATE POLICY valuations_select ON valuations
    FOR SELECT USING (contact_email = auth.jwt()->>'email' OR auth.role() = 'service_role');

CREATE POLICY valuations_insert ON valuations
    FOR INSERT WITH CHECK (true);

-- Listing submissions: anyone can submit, admin reviews
CREATE POLICY listing_submissions_select ON listing_submissions
    FOR SELECT USING (seller_email = auth.jwt()->>'email' OR auth.role() = 'service_role');

CREATE POLICY listing_submissions_insert ON listing_submissions
    FOR INSERT WITH CHECK (true);

-- Contact messages: admin only reads
CREATE POLICY contact_messages_select ON contact_messages
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY contact_messages_insert ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Increment view count
CREATE OR REPLACE FUNCTION increment_business_view(business_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE businesses SET view_count = view_count + 1 WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment inquiry count
CREATE OR REPLACE FUNCTION increment_business_inquiry(business_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE businesses SET inquiry_count = inquiry_count + 1 WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Views for admin dashboard
CREATE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM businesses WHERE status = 'active') as active_listings,
    (SELECT COUNT(*) FROM businesses WHERE status = 'pending') as pending_listings,
    (SELECT COUNT(*) FROM inquiries WHERE status = 'new') as new_inquiries,
    (SELECT COUNT(*) FROM valuations WHERE status = 'pending') as pending_valuations,
    (SELECT COUNT(*) FROM listing_submissions WHERE status = 'pending_review') as pending_submissions,
    (SELECT COUNT(*) FROM contact_messages WHERE status = 'unread') as unread_messages,
    (SELECT SUM(view_count) FROM businesses) as total_views,
    (SELECT SUM(inquiry_count) FROM businesses) as total_inquiries;

CREATE VIEW recent_activity AS
SELECT 
    'inquiry' as type,
    i.created_at,
    i.buyer_name,
    i.buyer_email,
    b.name as business_name,
    i.status
FROM inquiries i
LEFT JOIN businesses b ON i.business_id = b.id
ORDER BY i.created_at DESC
LIMIT 50;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
