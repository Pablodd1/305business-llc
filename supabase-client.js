// 305business.llc Supabase Client
// Real database connection — no more fake data

const SUPABASE_URL = 'https://uakiregrnzcwuwqjkaxr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BhHyFZplUB8DE6-E2jBxvA_MUrqfQq0';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2lyZWdybnpjd3V3cWprYXhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA2MDczNywiZXhwIjoyMDk1NjM2NzM3fQ.7wTezXqO9IYYKxa2HLJXkRdcFvOEr_DctcsoNTgQnN8';

class SupabaseClient {
    constructor() {
        this.baseUrl = SUPABASE_URL;
        this.apiKey = SUPABASE_KEY;
        this.headers = {
            'apikey': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}/rest/v1/${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: { ...this.headers, ...options.headers }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Supabase error:', error);
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    }

    // Businesses
    async getBusinesses(options = {}) {
        const { category, status = 'active', limit = 50, offset = 0, featured } = options;
        let query = `businesses?status=eq.${status}`;
        
        if (category) query += `&category=eq.${encodeURIComponent(category)}`;
        if (featured) query += `&featured=eq.true`;
        
        query += `&limit=${limit}&offset=${offset}&order=created_at.desc`;
        
        return this.request(query);
    }

    async getBusinessBySlug(slug) {
        const businesses = await this.request(`businesses?slug=eq.${slug}&limit=1`);
        return businesses[0] || null;
    }

    async getFeaturedBusinesses(limit = 6) {
        return this.request(`businesses?featured=eq.true&status=eq.active&limit=${limit}&order=created_at.desc`);
    }

    async getBusinessCategories() {
        return this.request('categories?order=business_count.desc');
    }

    // Search
    async searchBusinesses(query, options = {}) {
        const { limit = 20 } = options;
        // Using ilike for simple search, or use full-text search later
        return this.request(`businesses?or=(name.ilike.*${query}*,description.ilike.*${query}*,city.ilike.*${query}*,neighborhood.ilike.*${query}*)&status=eq.active&limit=${limit}`);
    }

    // Inquiries
    async createInquiry(inquiryData) {
        return this.request('inquiries', {
            method: 'POST',
            body: JSON.stringify(inquiryData)
        });
    }

    // Valuations
    async createValuationRequest(valuationData) {
        return this.request('valuations', {
            method: 'POST',
            body: JSON.stringify(valuationData)
        });
    }

    // Listing submissions
    async submitListing(listingData) {
        return this.request('listing_submissions', {
            method: 'POST',
            body: JSON.stringify({
                ...listingData,
                status: 'pending_review'
            })
        });
    }

    // Contact messages
    async submitContactMessage(messageData) {
        return this.request('contact_messages', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }

    // Activity tracking
    async logActivity(action, entityType, entityId, details = {}) {
        return this.request('activity_log', {
            method: 'POST',
            body: JSON.stringify({
                action,
                entity_type: entityType,
                entity_id: entityId,
                details
            })
        });
    }
}

// Initialize global client
window.supabase305 = new SupabaseClient();

console.log('305business Supabase client initialized');
