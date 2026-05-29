-- Fix RLS policies for 305business.llc
-- Run this in Supabase SQL Editor if public read is blocked

-- Businesses: allow public (anon) to read active listings
DROP POLICY IF EXISTS "Public read active" ON businesses;
CREATE POLICY "Public read active" ON businesses
    FOR SELECT TO anon, authenticated USING (status = 'active');

-- Categories: allow public read
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories
    FOR SELECT TO anon, authenticated USING (true);

-- Listing submissions: allow public insert (anyone can submit)
DROP POLICY IF EXISTS "Public insert submissions" ON listing_submissions;
CREATE POLICY "Public insert submissions" ON listing_submissions
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Inquiries: allow public insert
DROP POLICY IF EXISTS "Public insert inquiries" ON inquiries;
CREATE POLICY "Public insert inquiries" ON inquiries
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Valuations: allow public insert
DROP POLICY IF EXISTS "Public insert valuations" ON valuations;
CREATE POLICY "Public insert valuations" ON valuations
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Contact messages: allow public insert
DROP POLICY IF EXISTS "Public insert contacts" ON contact_messages;
CREATE POLICY "Public insert contacts" ON contact_messages
    FOR INSERT TO anon, authenticated WITH CHECK (true);
