// 305business.llc — Dashboard & Admin Shared Module
// Seller dashboard + Admin review queue functionality

const SUPABASE_URL = 'https://uakiregrnzcwuwqjkaxr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BhHyFZplUB8DE6-E2jBxvA_MUrqfQq0';

class DashboardApp {
    constructor(options = {}) {
        this.baseUrl = SUPABASE_URL;
        this.apiKey = SUPABASE_KEY;
        this.headers = {
            'apikey': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
        this.sellerEmail = options.sellerEmail || this._getStoredEmail();
        this.isAdmin = options.isAdmin || false;
        this.onUpdate = options.onUpdate || (() => {});
        this.listings = [];
        this.inquiries = [];
        this.categories = [];
        this.loading = false;
    }

    _getStoredEmail() {
        return localStorage.getItem('seller_email') || '';
    }

    _setStoredEmail(email) {
        localStorage.setItem('seller_email', email);
        this.sellerEmail = email;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}/rest/v1/${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: { ...this.headers, ...options.headers }
        });
        if (!response.ok) {
            const error = await response.text();
            console.error('Supabase error:', error);
            throw new Error(error || 'Request failed');
        }
        return response.json();
    }

    // ── Listings ──

    async fetchListings(filter = {}) {
        this.loading = true;
        try {
            let query = 'businesses?order=created_at.desc';
            if (filter.status) query += `&status=eq.${filter.status}`;
            if (filter.seller_email) query += `&seller_email=eq.${encodeURIComponent(filter.seller_email)}`;
            if (filter.category) query += `&category=eq.${encodeURIComponent(filter.category)}`;
            if (filter.search) {
                query += `&or=(name.ilike.*${encodeURIComponent(filter.search)}*,seller_email.ilike.*${encodeURIComponent(filter.search)}*)`;
            }
            if (filter.limit) query += `&limit=${filter.limit}`;
            this.listings = await this.request(query);
            return this.listings;
        } finally {
            this.loading = false;
        }
    }

    async fetchListingsBySeller(email) {
        this._setStoredEmail(email);
        return this.fetchListings({ seller_email: email });
    }

    async fetchAllListings() {
        return this.fetchListings({});
    }

    async fetchPendingListings() {
        return this.fetchListings({ status: 'pending' });
    }

    // ── Inquiries ──

    async fetchInquiries(businessId = null) {
        let query = 'inquiries?order=created_at.desc';
        if (businessId) query += `&business_id=eq.${businessId}`;
        this.inquiries = await this.request(query);
        return this.inquiries;
    }

    async fetchInquiriesForListings(listingIds) {
        if (!listingIds || listingIds.length === 0) return [];
        const ids = listingIds.map(id => `"${id}"`).join(',');
        const query = `inquiries?business_id=in.(${ids})&order=created_at.desc`;
        this.inquiries = await this.request(query);
        return this.inquiries;
    }

    getInquiryCount(businessId) {
        return this.inquiries.filter(i => i.business_id === businessId).length;
    }

    // ── Categories ──

    async fetchCategories() {
        this.categories = await this.request('categories?order=name.asc');
        return this.categories;
    }

    // ── Status Updates ──

    async updateListingStatus(id, status) {
        const validStatuses = ['active', 'pending', 'rejected', 'sold', 'withdrawn'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
        }
        const result = await this.request(`businesses?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status, updated_at: new Date().toISOString() })
        });
        // Update local cache
        const idx = this.listings.findIndex(l => l.id === id);
        if (idx !== -1) this.listings[idx].status = status;
        this.onUpdate();
        return result[0];
    }

    async approveListing(id) {
        return this.updateListingStatus(id, 'active');
    }

    async rejectListing(id) {
        return this.updateListingStatus(id, 'rejected');
    }

    async withdrawListing(id) {
        return this.updateListingStatus(id, 'withdrawn');
    }

    async sellListing(id) {
        return this.updateListingStatus(id, 'sold');
    }

    // ── Bulk Actions ──

    async bulkApprove(ids) {
        const results = [];
        for (const id of ids) {
            try { results.push(await this.approveListing(id)); }
            catch (e) { results.push({ id, error: e.message }); }
        }
        return results;
    }

    async bulkReject(ids) {
        const results = [];
        for (const id of ids) {
            try { results.push(await this.rejectListing(id)); }
            catch (e) { results.push({ id, error: e.message }); }
        }
        return results;
    }

    // ── Stats ──

    getStats() {
        const total = this.listings.length;
        const active = this.listings.filter(l => l.status === 'active').length;
        const pending = this.listings.filter(l => l.status === 'pending').length;
        const rejected = this.listings.filter(l => l.status === 'rejected').length;
        const sold = this.listings.filter(l => l.status === 'sold').length;
        const withdrawn = this.listings.filter(l => l.status === 'withdrawn').length;
        const totalInquiries = this.inquiries.length;
        const totalViews = this.listings.reduce((sum, l) => sum + (l.view_count || 0), 0);
        const newToday = this.listings.filter(l => {
            const created = new Date(l.created_at);
            const today = new Date();
            return created.toDateString() === today.toDateString();
        }).length;

        return { total, active, pending, rejected, sold, withdrawn, totalInquiries, totalViews, newToday };
    }

    // ── Formatting ──

    static formatCurrency(value) {
        if (!value && value !== 0) return '-';
        return '$' + Number(value).toLocaleString('en-US');
    }

    static formatDate(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    }

    static formatDateTime(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    static getStatusBadge(status) {
        const map = {
            active:    { emoji: '🟢', label: 'Active',     class: 'status-active' },
            pending:   { emoji: '🟡', label: 'Pending Review', class: 'status-pending' },
            rejected:  { emoji: '🔴', label: 'Rejected',   class: 'status-rejected' },
            sold:      { emoji: '⚫', label: 'Sold',       class: 'status-sold' },
            withdrawn: { emoji: '⚪', label: 'Withdrawn',  class: 'status-withdrawn' }
        };
        return map[status] || { emoji: '⚪', label: status, class: 'status-pending' };
    }
}

// ── Toast Notification System ──
class ToastSystem {
    constructor() {
        this.container = null;
        this._initContainer();
    }

    _initContainer() {
        if (document.getElementById('toast-container')) return;
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; z-index: 9999;
            display: flex; flex-direction: column; gap: 8px;
            font-family: 'Inter', sans-serif;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const colors = {
            success: { bg: 'rgba(0,255,136,0.15)', border: 'rgba(0,255,136,0.4)', text: '#00FF88', icon: 'fa-check-circle' },
            error:   { bg: 'rgba(255,71,87,0.15)', border: 'rgba(255,71,87,0.4)', text: '#FF4757', icon: 'fa-exclamation-circle' },
            warning: { bg: 'rgba(255,193,7,0.15)', border: 'rgba(255,193,7,0.4)', text: '#FFC107', icon: 'fa-exclamation-triangle' },
            info:    { bg: 'rgba(0,212,255,0.15)', border: 'rgba(0,212,255,0.4)', text: '#00D4FF', icon: 'fa-info-circle' }
        };
        const c = colors[type] || colors.info;

        toast.style.cssText = `
            background: ${c.bg}; border: 1.5px solid ${c.border};
            color: ${c.text}; padding: 12px 20px; border-radius: 4px;
            font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 10px;
            animation: toastSlideIn 0.3s ease-out; backdrop-filter: blur(4px);
            min-width: 240px; max-width: 400px;
        `;
        toast.innerHTML = `<i class="fas ${c.icon}"></i><span>${message}</span>`;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// ── Admin Auth (PIN-based, temporary) ──
class AdminAuth {
    constructor(pin = '3050') {
        this.pin = pin;
        this.tokenKey = 'admin_auth_token_305';
    }

    isAuthenticated() {
        return localStorage.getItem(this.tokenKey) === 'authenticated';
    }

    authenticate(inputPin) {
        if (inputPin === this.pin) {
            localStorage.setItem(this.tokenKey, 'authenticated');
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
    }
}

// ── Modal System ──
class ModalSystem {
    constructor() {
        this.overlay = null;
        this._init();
    }

    _init() {
        if (document.getElementById('modal-overlay')) return;
        this.overlay = document.createElement('div');
        this.overlay.id = 'modal-overlay';
        this.overlay.className = 'modal-overlay';
        this.overlay.innerHTML = `
            <div class="modal-content" id="modal-content">
                <div class="flex justify-between items-center p-4 border-b" style="border-color: rgba(255,255,255,0.15);">
                    <h3 id="modal-title" class="text-white font-bold text-lg" style="font-family:'Inter',sans-serif;">Details</h3>
                    <button onclick="window.modalSystem.close()" class="text-white/50 hover:text-white transition">
                        <i class="fas fa-times text-lg"></i>
                    </button>
                </div>
                <div id="modal-body" class="p-6"></div>
            </div>
        `;
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        document.body.appendChild(this.overlay);
    }

    open(title, htmlContent) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = htmlContent;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ── Export globals ──
window.DashboardApp = DashboardApp;
window.ToastSystem = ToastSystem;
window.AdminAuth = AdminAuth;
window.ModalSystem = ModalSystem;

// CSS for toast animations (injected)
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes toastSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.85);
        z-index: 200; display: none; align-items: center; justify-content: center;
        backdrop-filter: blur(4px);
    }
    .modal-overlay.active { display: flex; }
    .modal-content {
        background: #1a4a7a; border: 1.5px solid rgba(255,255,255,0.25);
        max-width: 700px; width: 90%; max-height: 85vh; overflow-y: auto;
        position: relative; border-radius: 4px;
        animation: modalFadeIn 0.2s ease-out;
    }
    @keyframes modalFadeIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    @media (max-width: 768px) {
        .modal-content { max-width: 95vw; width: 95vw; max-height: 90vh; }
    }
`;
document.head.appendChild(toastStyle);
