/**
 * 305business.llc — Shared Navigation Component
 * Handles auth state, mobile menu, and consistent nav across all pages
 * 
 * Usage: Include this script on EVERY page:
 *   <script src="js/auth.js" type="module"></script>
 *   <script src="js/nav.js" type="module"></script>
 */

import { auth } from './auth.js';

class NavigationManager {
  constructor() {
    this.navHTML = this.getNavHTML();
    this.mobileNavHTML = this.getMobileNavHTML();
  }

  // ── Desktop Navigation ──
  getNavHTML() {
    return `
      <!-- Auth Navigation (desktop) -->
      <div id="nav-auth" class="flex items-center gap-2">
        <a href="/login.html" class="text-white/80 hover:text-white transition text-sm font-medium">Log In</a>
        <a href="/signup.html" class="bg-[#23d9b0] text-[#050249] px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-[#1bc9a0] transition">Get Started</a>
      </div>
    `;
  }

  // ── Mobile Navigation ──
  getMobileNavHTML() {
    return `
      <!-- Auth Links (mobile) -->
      <div class="border-t border-white/10 pt-4 mt-4">
        <a href="/login.html" class="block text-white text-lg py-2">Log In</a>
        <a href="/signup.html" class="block text-[#23d9b0] text-lg py-2 font-bold">Get Started</a>
      </div>
    `;
  }

  // ── Render Auth State ──
  async renderAuthState() {
    await auth.init();
    
    // Find all nav-auth containers
    const containers = document.querySelectorAll('#nav-auth');
    
    containers.forEach(container => {
      if (auth.isAuthenticated()) {
        const user = auth.getUser();
        const email = user?.email || '';
        const initial = email.charAt(0).toUpperCase();
        const name = email.split('@')[0];
        
        container.innerHTML = `
          <div class="relative group">
            <button class="flex items-center gap-2 text-white/80 hover:text-white transition">
              <div class="w-8 h-8 rounded-full bg-[#23d9b0] flex items-center justify-center text-[#050249] font-bold text-sm">
                ${initial}
              </div>
              <span class="hidden md:inline text-sm">${name}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div class="absolute right-0 mt-2 w-48 bg-[#0a0a1a] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <a href="/dashboard.html" class="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5">Dashboard</a>
              <a href="/profile.html" class="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5">Profile Settings</a>
              <a href="/list-business.html" class="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5">List Business</a>
              <div class="border-t border-white/10"></div>
              <button onclick="window.auth.logout()" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5">Logout</button>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <a href="/login.html" class="text-white/80 hover:text-white transition text-sm font-medium">Log In</a>
          <a href="/signup.html" class="bg-[#23d9b0] text-[#050249] px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-[#1bc9a0] transition">Get Started</a>
        `;
      }
    });

    // Update mobile menu auth links
    this.updateMobileMenu();
  }

  // ── Update Mobile Menu ──
  updateMobileMenu() {
    // Find mobile menu container
    const mobileAuth = document.getElementById('mobile-auth-links');
    if (!mobileAuth) return;

    if (auth.isAuthenticated()) {
      const user = auth.getUser();
      const email = user?.email || '';
      mobileAuth.innerHTML = `
        <div class="border-t border-white/10 pt-4 mt-4">
          <p class="text-white/60 text-sm mb-2">Signed in as</p>
          <p class="text-white font-medium mb-3">${email}</p>
          <a href="/dashboard.html" class="block text-white py-2 hover:text-[#23d9b0]">Dashboard</a>
          <a href="/profile.html" class="block text-white py-2 hover:text-[#23d9b0]">Profile</a>
          <a href="/list-business.html" class="block text-white py-2 hover:text-[#23d9b0]">List Business</a>
          <button onclick="window.auth.logout()" class="block text-red-400 py-2 mt-2 hover:text-red-300">Logout</button>
        </div>
      `;
    } else {
      mobileAuth.innerHTML = `
        <div class="border-t border-white/10 pt-4 mt-4">
          <a href="/login.html" class="block text-white text-lg py-2">Log In</a>
          <a href="/signup.html" class="block text-[#23d9b0] text-lg py-2 font-bold">Get Started</a>
        </div>
      `;
    }
  }

  // ── Initialize ──
  init() {
    // Wait for DOM and auth
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.renderAuthState());
    } else {
      this.renderAuthState();
    }
  }
}

// ── Global Instance ──
const navManager = new NavigationManager();
navManager.init();

export { NavigationManager, navManager };
