const { Client } = require('pg');

const client = new Client({
  host: 'db.uakiregrnzcwuwqjkaxr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '_4YwNiT7xQ-NZfx',
  ssl: { rejectUnauthorized: false },
  family: 4
});

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    listing_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses table (live listings)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    asking_price NUMERIC(12,2),
    annual_revenue NUMERIC(12,2),
    cash_flow NUMERIC(12,2),
    employee_count INTEGER,
    year_established INTEGER,
    address TEXT,
    city TEXT DEFAULT 'Miami',
    state TEXT DEFAULT 'FL',
    zip TEXT,
    square_footage INTEGER,
    features TEXT[],
    equipment_included TEXT,
    reason_for_selling TEXT,
    lease_terms TEXT,
    status TEXT DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    seller_name TEXT,
    seller_email TEXT,
    seller_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing submissions (pending review)
CREATE TABLE IF NOT EXISTS listing_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    asking_price NUMERIC(12,2),
    annual_revenue NUMERIC(12,2),
    cash_flow NUMERIC(12,2),
    employee_count INTEGER,
    year_established INTEGER,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    square_footage INTEGER,
    equipment_included TEXT,
    reason_for_selling TEXT,
    lease_terms TEXT,
    seller_name TEXT,
    seller_email TEXT,
    seller_phone TEXT,
    status TEXT DEFAULT 'pending_review',
    featured_requested BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT
);

-- Inquiries (buyer interest)
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    message TEXT,
    subject TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valuation requests
CREATE TABLE IF NOT EXISTS valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT,
    category TEXT,
    annual_revenue NUMERIC(12,2),
    cash_flow NUMERIC(12,2),
    asset_value NUMERIC(12,2),
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    estimated_value NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff/admin users
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Restaurant & Food', 'restaurant', 'Restaurants, cafés, bakeries, food trucks', 'fa-utensils'),
    ('Retail & Stores', 'retail', 'Shops, boutiques, e-commerce', 'fa-store'),
    ('Healthcare & Medical', 'healthcare', 'Clinics, dental, pharmacies', 'fa-hospital'),
    ('Technology & Software', 'tech', 'SaaS, apps, IT services', 'fa-laptop-code'),
    ('Hospitality & Hotels', 'hospitality', 'Hotels, motels, B&Bs', 'fa-hotel'),
    ('Professional Services', 'service', 'Legal, accounting, consulting', 'fa-briefcase'),
    ('Manufacturing', 'manufacturing', 'Production, assembly, fabrication', 'fa-industry'),
    ('Construction & Trades', 'construction', 'Builders, contractors, trades', 'fa-hard-hat'),
    ('Automotive', 'automotive', 'Repair, dealerships, parts', 'fa-car'),
    ('Education & Training', 'education', 'Schools, tutoring, courses', 'fa-graduation-cap'),
    ('Fitness & Wellness', 'fitness', 'Gyms, yoga, spas', 'fa-dumbbell'),
    ('Real Estate & Property', 'real_estate', 'Property management, brokerages', 'fa-building'),
    ('Entertainment & Events', 'entertainment', 'Venues, bars, event planning', 'fa-music'),
    ('Transportation & Logistics', 'transportation', 'Delivery, moving, logistics', 'fa-truck'),
    ('Other', 'other', 'Everything else', 'fa-briefcase')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON businesses(featured);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_price ON businesses(asking_price);
CREATE INDEX IF NOT EXISTS idx_listing_submissions_status ON listing_submissions(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_business ON inquiries(business_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_valuations_status ON valuations(status);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
`;

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase');
    await client.query(schema);
    console.log('Schema created successfully');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
