/**
 * 305business.llc — Authentication Module (v2)
 * Code-over-email auth backed by La Jefatura (Mission Control).
 * Supabase GoTrue email validation is broken project-wide on the shared
 * CEDEXX project, so auth lives in Mission Control's own store:
 *   POST /api/305/auth/code    → 6-digit code emailed via Brevo (10 min TTL)
 *   POST /api/305/auth/verify  → session token (30-day TTL)
 *   GET  /api/305/auth/me      → current user
 *   POST /api/305/auth/profile → update name/phone/role
 *   POST /api/305/auth/logout  → revoke session
 *
 * Public API is unchanged from the Supabase version — pages don't care.
 */

const AUTH_ENDPOINTS = [
    'https://latitude-here-windsor-radical.trycloudflare.com',
    'http://localhost:8090'
];

class AuthManager {
  constructor() {
    this.user = null;
    this.session = null; // { token, user }
    this._initialized = false;
  }

  async _api(path, options = {}) {
    let lastErr = null;
    for (const base of AUTH_ENDPOINTS) {
      try {
        const r = await fetch(`${base}${path}`, {
          ...options,
          headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
        });
        const data = await r.json().catch(() => ({}));
        if (r.ok) return data;
        lastErr = new Error(data.error || `HTTP ${r.status}`);
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('Auth service unreachable');
  }

  // ── Initialize ──
  async init() {
    const saved = localStorage.getItem('sb-session');
    if (saved) {
      try {
        this.session = JSON.parse(saved);
        const me = await this._api(`/api/305/auth/me?token=${encodeURIComponent(this.session.token)}`);
        this.user = me;
      } catch (e) {
        this.clearSession();
      }
    }
    this._initialized = true;
    document.dispatchEvent(new CustomEvent('auth:ready', { detail: { user: this.user } }));
    return this.user;
  }

  // ── Send login code (was: magic link) ──
  async sendMagicLink(email, meta = {}) {
    const data = await this._api('/api/305/auth/code', {
      method: 'POST',
      body: JSON.stringify({ email, name: meta.name || undefined })
    });
    return { success: true, message: 'Código enviado — revisa tu correo.' };
  }

  // ── Verify 6-digit code ──
  async verifyOTP(email, code) {
    const data = await this._api('/api/305/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
    this.session = { token: data.token, user: data.user };
    this.user = data.user;
    localStorage.setItem('sb-session', JSON.stringify(this.session));

    // Apply profile captured during signup (name/phone/role)
    const pending = localStorage.getItem('pendingProfile');
    if (pending) {
      try {
        const p = JSON.parse(pending);
        await this.updateProfile({ name: p.full_name, phone: p.phone, role: p.role });
        localStorage.removeItem('pendingProfile');
      } catch (e) { /* non-fatal */ }
    }
    return this.user;
  }

  // ── Set Session (compat) ──
  setSession(sessionData) {
    this.session = { token: sessionData.token, user: sessionData.user };
    this.user = sessionData.user;
    localStorage.setItem('sb-session', JSON.stringify(this.session));
  }

  // ── Refresh user ──
  async refreshUser() {
    if (!this.session) return null;
    try {
      this.user = await this._api(`/api/305/auth/me?token=${encodeURIComponent(this.session.token)}`);
      this.session.user = this.user;
      return this.user;
    } catch (e) {
      this.clearSession();
      return null;
    }
  }

  // ── Profile (server-side user record) ──
  async ensureProfile() { /* user shell is created server-side on code request */ }

  async getProfile() {
    return this.user;
  }

  async updateProfile(updates = {}) {
    if (!this.session) throw new Error('Not authenticated');
    this.user = await this._api('/api/305/auth/profile', {
      method: 'POST',
      body: JSON.stringify({ token: this.session.token, ...updates })
    });
    this.session.user = this.user;
    localStorage.setItem('sb-session', JSON.stringify(this.session));
    return true;
  }

  // ── Status helpers ──
  isAuthenticated() {
    return !!this.user && !!this.session;
  }

  getUser() { return this.user; }
  getEmail() { return this.user?.email || null; }
  getHeaders() { return { 'Content-Type': 'application/json' }; }

  // ── Logout ──
  async logout() {
    if (this.session) {
      try { await this._api('/api/305/auth/logout', { method: 'POST', body: JSON.stringify({ token: this.session.token }) }); } catch (e) {}
    }
    this.clearSession();
    window.location.href = '/';
  }

  clearSession() {
    this.user = null;
    this.session = null;
    localStorage.removeItem('sb-session');
  }

  requireAuth(redirectUrl = '/login.html') {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // ── Navigation UI ──
  updateNav() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    if (this.isAuthenticated()) {
      const label = this.user.name || this.user.email?.split('@')[0] || 'Usuario';
      navAuth.innerHTML = `
        <div class="relative group">
          <button class="flex items-center gap-2 text-white/80 hover:text-white transition">
            <div class="w-8 h-8 rounded-full bg-[#23d9b0] flex items-center justify-center text-[#050249] font-bold text-sm">
              ${label.charAt(0).toUpperCase()}
            </div>
            <span class="hidden md:inline text-sm">${label}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="absolute right-0 mt-2 w-48 bg-[#0a0a1a] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <a href="/dashboard.html" class="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5">Dashboard</a>
            <a href="/list-business.html" class="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5">List Business</a>
            <div class="border-t border-white/10"></div>
            <button onclick="auth.logout()" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5">Logout</button>
          </div>
        </div>
      `;
    } else {
      navAuth.innerHTML = `
        <a href="/login.html" class="text-white/80 hover:text-white transition text-sm font-medium">Log In</a>
        <a href="/signup.html" class="bg-[#23d9b0] text-[#050249] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1bc9a0] transition">Get Started</a>
      `;
    }
  }
}

// ── Global Instance ──
const auth = new AuthManager();

document.addEventListener('DOMContentLoaded', async () => {
  await auth.init();
  auth.updateNav();
});

window.auth = auth;
export { AuthManager, auth };
