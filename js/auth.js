/**
 * 305business.llc — Authentication Module
 * Supabase Auth with Magic Link (passwordless)
 * 
 * Usage:
 *   import { AuthManager } from './auth.js';
 *   const auth = new AuthManager();
 *   await auth.init();
 *   
 *   // Check if logged in
 *   if (auth.isAuthenticated()) { ... }
 *   
 *   // Send magic link
 *   await auth.sendMagicLink('user@email.com');
 *   
 *   // Logout
 *   auth.logout();
 */

const SUPABASE_URL = 'https://uakiregrnzcwuwqjkaxr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2lyZWdybnpjd3V3cWprYXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjI0MDAsImV4cCI6MjAzMjYzODQwMH0.ANONYMOUS_KEY_PLACEHOLDER';

class AuthManager {
  constructor() {
    this.baseUrl = SUPABASE_URL;
    this.apiKey = SUPABASE_ANON_KEY;
    this.user = null;
    this.session = null;
    this._initialized = false;
    this.headers = {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // ── Initialize ──
  async init() {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('sb-session');
    if (savedSession) {
      try {
        this.session = JSON.parse(savedSession);
        this.headers.Authorization = `Bearer ${this.session.access_token}`;
        await this.refreshUser();
      } catch (e) {
        this.clearSession();
      }
    }
    this._initialized = true;
    // Notify auth-guard and other listeners
    document.dispatchEvent(new CustomEvent('auth:ready', { detail: { user: this.user } }));
    return this.user;
  }

  // ── Send Magic Link ──
  async sendMagicLink(email) {
    const response = await fetch(`${this.baseUrl}/auth/v1/otp`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email: email,
        create_user: true,
        data: {
          source: '305business.llc'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Failed to send magic link');
    }

    return { success: true, message: 'Magic link sent! Check your email.' };
  }

  // ── Verify OTP (Magic Link Code) ──
  async verifyOTP(email, token) {
    const response = await fetch(`${this.baseUrl}/auth/v1/verify`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        type: 'email',
        email: email,
        token: token
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Invalid code');
    }

    const data = await response.json();
    this.setSession(data);
    await this.ensureProfile(data.user);
    return data.user;
  }

  // ── Set Session ──
  setSession(sessionData) {
    this.session = {
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
      user: sessionData.user
    };
    this.user = sessionData.user;
    this.headers.Authorization = `Bearer ${sessionData.access_token}`;
    localStorage.setItem('sb-session', JSON.stringify(this.session));
  }

  // ── Refresh User Data ──
  async refreshUser() {
    if (!this.session) return null;
    
    const response = await fetch(`${this.baseUrl}/auth/v1/user`, {
      headers: this.headers
    });

    if (response.ok) {
      const data = await response.json();
      this.user = data;
      return data;
    } else {
      this.clearSession();
      return null;
    }
  }

  // ── Ensure User Profile Exists ──
  async ensureProfile(user) {
    if (!user) return;

    // Check if profile exists
    const checkRes = await fetch(
      `${this.baseUrl}/rest/v1/profiles?id=eq.${user.id}&select=*`,
      { headers: this.headers }
    );

    const profiles = await checkRes.json();

    if (!profiles || profiles.length === 0) {
      // Create profile
      await fetch(`${this.baseUrl}/rest/v1/profiles`, {
        method: 'POST',
        headers: { ...this.headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
          role: 'seller',
          created_at: new Date().toISOString()
        })
      });
    }
  }

  // ── Get Profile ──
  async getProfile() {
    if (!this.user) return null;
    
    const response = await fetch(
      `${this.baseUrl}/rest/v1/profiles?id=eq.${this.user.id}&select=*`,
      { headers: this.headers }
    );

    const profiles = await response.json();
    return profiles?.[0] || null;
  }

  // ── Update Profile ──
  async updateProfile(updates) {
    if (!this.user) throw new Error('Not authenticated');

    const response = await fetch(
      `${this.baseUrl}/rest/v1/profiles?id=eq.${this.user.id}`,
      {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(updates)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return true;
  }

  // ── Check Auth Status ──
  isAuthenticated() {
    return !!this.user && !!this.session;
  }

  // ── Get Current User ──
  getUser() {
    return this.user;
  }

  // ── Get User Email ──
  getEmail() {
    return this.user?.email || null;
  }

  // ── Get Auth Headers ──
  getHeaders() {
    return { ...this.headers };
  }

  // ── Logout ──
  logout() {
    this.clearSession();
    window.location.href = '/';
  }

  // ── Clear Session ──
  clearSession() {
    this.user = null;
    this.session = null;
    this.headers.Authorization = `Bearer ${this.apiKey}`;
    localStorage.removeItem('sb-session');
  }

  // ── Require Auth (redirect if not logged in) ──
  requireAuth(redirectUrl = '/login.html') {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // ── Update Navigation UI ──
  updateNav() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    if (this.isAuthenticated()) {
      navAuth.innerHTML = `
        <div class="relative group">
          <button class="flex items-center gap-2 text-white/80 hover:text-white transition">
            <div class="w-8 h-8 rounded-full bg-[#23d9b0] flex items-center justify-center text-[#050249] font-bold text-sm">
              ${this.user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span class="hidden md:inline text-sm">${this.user.email?.split('@')[0]}</span>
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

// Auto-init on page load
document.addEventListener('DOMContentLoaded', async () => {
  await auth.init();
  auth.updateNav();
});

// Expose globally
window.auth = auth;
export { AuthManager, auth };
