// 305business.llc Data Client (v2 — CEDEXX Supabase project + La Jefatura backend)
//
// Auth:        Supabase Auth (magic link) on the shared project — auth.users is
//              built-in, no tables required.
// Reads:       Business listings/categories — local snapshot (js/businesses-data.js)
//              first; live `businesses` table is used when present.
// Writes:      Inquiries, valuations, listing submissions, contact messages →
//              La Jefatura backend (/api/lead) → stored in mc.db + Telegram alert
//              to the CEO. Belt and suspenders with js/deal-flow.js.

const SUPABASE_URL = 'https://fjeubuopladzxxswomko.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZXVidW9wbGFkenh4c3dvbWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MTM2NDAsImV4cCI6MjEwMjQ4OTY0MH0.QVp74zTbgUj4Me6T059TnxOKT0w7gCwp5D7gX_7li44';

// La Jefatura (Mission Control) lead endpoints — same source as js/deal-flow.js
const MC_ENDPOINTS = [
    'https://latitude-here-windsor-radical.trycloudflare.com',
    'http://localhost:8090'
];

const EMAIL_SERVER_URL = window.EMAIL_SERVER_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8081' : '');

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
            const error = await response.text();
            throw new Error(error || 'Request failed');
        }
        return response.json();
    }

    // ── La Jefatura lead intake ──
    async sendToJefatura(payload) {
        for (const base of MC_ENDPOINTS) {
            try {
                const r = await fetch(`${base}/api/lead`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (r.ok) return await r.json().catch(() => ({ ok: true }));
            } catch (e) { /* try next endpoint */ }
        }
        throw new Error('All lead endpoints unreachable');
    }

    // ── Email Notifications ──
    async sendNotification(eventType, data) {
        if (typeof window !== 'undefined' && window.EmailNotify) {
            try {
                const result = await window.EmailNotify.notifyAdmin(eventType, data);
                if (result.success) return result;
            } catch (err) { console.warn('[305] EmailNotify error:', err.message); }
        }
        if (!EMAIL_SERVER_URL) return { skipped: true };
        try {
            const response = await fetch(`${EMAIL_SERVER_URL}/api/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_type: eventType, ...data })
            });
            if (!response.ok) throw new Error('Notification failed');
            return await response.json();
        } catch (err) {
            return { error: err.message };
        }
    }

    // ── Businesses (local snapshot, live-DB optional) ──
    _local() { return window.BUSINESSES305 || []; }

    async getBusinesses(options = {}) {
        const { category, status = 'active', limit = 50, offset = 0, featured } = options;
        try {
            return await this.request(`businesses?status=eq.${status}&limit=${limit}&offset=${offset}&order=created_at.desc`);
        } catch (e) {
            let rows = this._local().filter(b => b.status === status);
            if (category) rows = rows.filter(b => b.category === category);
            if (featured) rows = rows.filter(b => b.featured);
            return rows.slice(offset, offset + limit);
        }
    }

    async getBusinessById(id) {
        try {
            const rows = await this.request(`businesses?id=eq.${id}&limit=1`);
            if (rows && rows.length) return rows[0];
        } catch (e) { /* fall through to local */ }
        return this._local().find(b => String(b.id) === String(id)) || null;
    }

    async getBusinessBySlug(slug) {
        try {
            const rows = await this.request(`businesses?slug=eq.${slug}&limit=1`);
            if (rows && rows.length) return rows[0];
        } catch (e) { /* fall through to local */ }
        return this._local().find(b => b.slug === slug) || null;
    }

    async getFeaturedBusinesses(limit = 6) {
        try {
            const rows = await this.request(`businesses?featured=eq.true&status=eq.active&limit=${limit}&order=created_at.desc`);
            if (rows && rows.length) return rows;
        } catch (e) { /* fall through to local */ }
        return this._local().filter(b => b.featured && b.status === 'active').slice(0, limit);
    }

    async getBusinessCategories() {
        try {
            const rows = await this.request('categories?order=business_count.desc');
            if (rows && rows.length) return rows;
        } catch (e) { /* fall through to local */ }
        return window.CATEGORIES305 || [];
    }

    async searchBusinesses(query, options = {}) {
        const { limit = 20 } = options;
        try {
            return await this.request(`businesses?or=(name.ilike.*${query}*,description.ilike.*${query}*,city.ilike.*${query}*,neighborhood.ilike.*${query}*)&status=eq.active&limit=${limit}`);
        } catch (e) {
            const q = String(query).toLowerCase();
            return this._local().filter(b => b.status === 'active' &&
                [b.name, b.description, b.city].some(f => String(f || '').toLowerCase().includes(q))
            ).slice(0, limit);
        }
    }

    // ── Inquiries (→ La Jefatura) ──
    async createInquiry(inquiryData) {
        const d = inquiryData || {};
        return this.sendToJefatura({
            name: d.buyer_name || d.name || 'Buyer',
            phone: d.buyer_phone || d.phone || '',
            channel: 'website',
            topic: `Inquiry: ${d.listing_title || d.listing_id || 'listing'}`,
            summary: d.message || '',
            status: 'nuevo'
        });
    }

    // ── Valuations (→ La Jefatura) ──
    async createValuationRequest(valuationData) {
        const d = valuationData || {};
        return this.sendToJefatura({
            name: d.name || d.contact_name || 'Valuation request',
            phone: d.phone || '',
            channel: 'website',
            topic: `Valuation: ${d.business_name || d.category || 'business'}`,
            summary: `Revenue: ${d.annual_revenue || '—'} | Asking: ${d.asking_price || '—'} | ${d.message || ''}`.slice(0, 380),
            status: 'nuevo'
        });
    }

    // ── Listing submissions (→ La Jefatura) ──
    async submitListing(listingData) {
        const d = listingData || {};
        return this.sendToJefatura({
            name: d.seller_name || d.name || 'Seller',
            phone: d.seller_phone || d.phone || '',
            channel: 'website',
            topic: `New listing: ${d.name || d.business_name || 'business'}`,
            summary: `${d.category || ''} | ${d.city || ''} | Rev: ${d.annual_revenue || '—'} | Ask: ${d.asking_price || '—'} | ${(d.description || '').slice(0, 200)}`,
            status: 'pendiente'
        });
    }

    // ── Contact messages (→ La Jefatura) ──
    async submitContactMessage(messageData) {
        const d = messageData || {};
        return this.sendToJefatura({
            name: d.name || 'Contact',
            phone: d.phone || '',
            channel: 'website',
            topic: d.subject || 'Contact form',
            summary: d.message || '',
            status: 'nuevo'
        });
    }
}

window.supabase305 = new SupabaseClient();
