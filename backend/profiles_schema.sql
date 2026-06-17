-- 305business.llc — Profiles Table (User Management)
-- Add this to your Supabase database

-- User Profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contact Info
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    
    -- Business Profile (for sellers)
    company_name TEXT,
    company_title TEXT,
    license_number TEXT,  -- Business broker license if applicable
    
    -- Preferences
    role TEXT DEFAULT 'seller' CHECK (role IN ('seller', 'buyer', 'broker', 'admin')),
    newsletter_opt_in BOOLEAN DEFAULT TRUE,
    
    -- Verification
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    identity_verified BOOLEAN DEFAULT FALSE,
    
    -- Activity
    last_login_at TIMESTAMP WITH TIME ZONE,
    listings_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    
    -- Settings
    preferred_language TEXT DEFAULT 'English',
    preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'both')),
    
    -- Avatar
    avatar_url TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (id = auth.uid() OR auth.role() = 'service_role');

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Users can insert their own profile (on signup)
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "profiles_admin_all" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_timestamp
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at();

-- Trigger to update last_login_at on auth.users update
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles SET last_login_at = NOW() WHERE id = NEW.id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to count user's listings
CREATE OR REPLACE FUNCTION get_user_listings_count(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*) INTO count FROM businesses WHERE seller_email = (
        SELECT email FROM profiles WHERE id = user_id
    );
    RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to count user's inquiries
CREATE OR REPLACE FUNCTION get_user_inquiries_count(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*) INTO count FROM inquiries WHERE buyer_email = (
        SELECT email FROM profiles WHERE id = user_id
    );
    RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for faster lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
