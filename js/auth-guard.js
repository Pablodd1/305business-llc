/**
 * Auth Guard - Protects pages that require authentication
 * Usage: Load after auth.js
 */

class AuthGuard {
  constructor(options = {}) {
    this.redirectUrl = options.redirectUrl || '/login.html';
    this.allowPublic = options.allowPublic || false;
    this.requiredRole = options.requiredRole || null;
    this.pending = false;
  }

  // Check auth and redirect if needed
  protect() {
    if (this.pending) return;
    this.pending = true;

    const checkAuth = () => {
      const auth = window.auth;
      if (auth && auth.isAuthenticated && auth.isAuthenticated()) {
        // Check role if required
        if (this.requiredRole) {
          const userRole = auth.user?.role || auth.user?.user_metadata?.role || 'user';
          if (userRole !== this.requiredRole) {
            this.showAccessDenied();
            this.pending = false;
            return false;
          }
        }
        this.pending = false;
        return true;
      }

      // Not authenticated
      if (!this.allowPublic) {
        const redirect = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `${this.redirectUrl}?redirect=${redirect}`;
        this.pending = false;
        return false;
      }
      this.pending = false;
      return false;
    };

    // Auth already initialized
    if (window.auth && window.auth._initialized) {
      return checkAuth();
    }

    // Wait for auth:ready event
    const onReady = () => {
      document.removeEventListener('auth:ready', onReady);
      checkAuth();
    };
    document.addEventListener('auth:ready', onReady);

    // Poll as fallback (in case event missed or auth loads late)
    let pollCount = 0;
    const poll = setInterval(() => {
      pollCount++;
      if (window.auth && window.auth._initialized) {
        clearInterval(poll);
        document.removeEventListener('auth:ready', onReady);
        checkAuth();
      } else if (pollCount > 30) { // ~3 seconds
        clearInterval(poll);
        document.removeEventListener('auth:ready', onReady);
        if (!this.allowPublic) {
          window.location.href = this.redirectUrl;
        }
        this.pending = false;
      }
    }, 100);
  }

  // Show login modal on public pages (non-blocking)
  showLoginModal() {
    if (document.getElementById('auth-guard-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'auth-guard-modal';
    modal.innerHTML = `
      <div class="agm-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center; animation:agmFadeIn 0.2s ease;">
        <div class="agm-card" style="background:#0a0a2e; border:1px solid rgba(255,255,255,0.1); border-radius:1rem; padding:2.5rem; max-width:420px; width:92%; text-align:center; animation:agmSlideUp 0.3s ease;">
          <div style="width:56px; height:56px; border-radius:50%; background:rgba(35,217,176,0.1); display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#23d9b0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 style="color:#fff; font-size:1.5rem; font-weight:700; margin-bottom:0.5rem; font-family:'Inter',sans-serif;">Login Required</h2>
          <p style="color:rgba(255,255,255,0.55); font-size:0.9375rem; line-height:1.6; margin-bottom:1.75rem;">Please log in to access this feature. No passwords needed — just a magic link.</p>
          <a href="/login.html" style="display:block; background:#23d9b0; color:#050249; padding:0.875rem 1.5rem; border-radius:0.5rem; text-align:center; text-decoration:none; font-weight:700; font-size:0.9375rem; transition:all 0.2s; margin-bottom:1rem;">Log In</a>
          <p style="color:rgba(255,255,255,0.35); font-size:0.8125rem; margin:0;">
            Don't have an account? <a href="/signup.html" style="color:#23d9b0; text-decoration:none; font-weight:500;">Get Started</a>
          </p>
        </div>
      </div>
      <style>
        @keyframes agmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes agmSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .agm-overlay { cursor: pointer; }
        .agm-card { cursor: default; }
      </style>
    `;
    document.body.appendChild(modal);

    // Close on overlay click
    modal.querySelector('.agm-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.hideLoginModal();
    });
  }

  hideLoginModal() {
    const modal = document.getElementById('auth-guard-modal');
    if (modal) modal.remove();
  }

  showAccessDenied() {
    document.body.innerHTML = `
      <div style="min-height:100vh; background:#050249; display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif;">
        <div style="text-align:center; max-width:400px; padding:2rem;">
          <div style="width:64px; height:64px; border-radius:50%; background:rgba(239,68,68,0.1); display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1 style="color:#fff; font-size:1.75rem; font-weight:700; margin-bottom:0.5rem;">Access Denied</h1>
          <p style="color:rgba(255,255,255,0.5); font-size:0.9375rem; line-height:1.6; margin-bottom:2rem;">You don't have permission to view this page. This area is restricted to administrators.</p>
          <a href="/" style="display:inline-block; background:#23d9b0; color:#050249; padding:0.75rem 1.5rem; border-radius:0.5rem; text-decoration:none; font-weight:700; font-size:0.875rem; transition:all 0.2s;">Back to Home</a>
        </div>
      </div>
    `;
  }
}

window.AuthGuard = AuthGuard;

// Auto-protect pages with data-auth attribute
document.addEventListener('DOMContentLoaded', () => {
  const authLevel = document.body?.dataset?.auth;

  if (authLevel === 'required') {
    const guard = new AuthGuard();
    guard.protect();
  } else if (authLevel === 'admin') {
    const guard = new AuthGuard({ requiredRole: 'admin' });
    guard.protect();
  }
  // 'public' or no attribute → no protection
});
