/**
 * Language Toggle System — Shared Module
 * Supports: English (en), Spanish (es), Haitian Creole (ht)
 * Usage:
 *   1. Add data-i18n="key" to any translatable element
 *   2. Include this script before closing </body>
 *   3. Add <div id="lang-toggle"></div> where you want the toggle button
 */
(function() {
  'use strict';

  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'es', 'ht'];
  const STORAGE_KEY = 'i18n_language';

  let currentLang = DEFAULT_LANG;
  let translations = {};
  let onChangeCallbacks = [];

  // ── Language detection ──────────────────────────────────────────
  function detectLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

    const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('ht') || browserLang.startsWith('fr')) return 'ht';
    return DEFAULT_LANG;
  }

  // ── Load translations ───────────────────────────────────────────
  async function loadTranslations(lang) {
    if (translations[lang]) return translations[lang];
    try {
      // Resolve relative to the page root (shared/ folder is at workspace root)
      const basePath = window.__i18nBasePath || '/shared/translations/';
      const res = await fetch(`${basePath}${lang}.json?v=1`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      translations[lang] = data;
      return data;
    } catch (err) {
      console.warn(`[i18n] Failed to load ${lang}.json:`, err);
      return {};
    }
  }

  // ── Apply translations to DOM ────────────────────────────────────
  function applyTranslations(data) {
    if (!data) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key || !data[key]) return;

      const value = data[key];
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder')) {
          el.setAttribute('placeholder', value);
        }
      } else if (el.tagName === 'META') {
        el.setAttribute('content', value);
      } else {
        // Support nested HTML in translations (use with caution)
        if (value.includes('<') && value.includes('>')) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      }
    });

    // Update document title if translated
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl && data[titleEl.getAttribute('data-i18n')]) {
      document.title = data[titleEl.getAttribute('data-i18n')];
    }

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Fire callbacks
    onChangeCallbacks.forEach(cb => cb(currentLang, data));
  }

  // ── Set language ────────────────────────────────────────────────
  async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    const data = await loadTranslations(lang);
    applyTranslations(data);
    updateToggleUI();
  }

  // ── Get current language ────────────────────────────────────────
  function getLanguage() {
    return currentLang;
  }

  // ── Register change callback ──────────────────────────────────────
  function onChange(callback) {
    onChangeCallbacks.push(callback);
  }

  // ── Build toggle UI ───────────────────────────────────────────────
  function renderToggle(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="lang-toggle-wrapper" role="group" aria-label="Language selector">
        <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English" title="English">
          <span class="lang-flag">🇺🇸</span><span class="lang-code">EN</span>
        </button>
        <button class="lang-btn ${currentLang === 'es' ? 'active' : ''}" data-lang="es" aria-label="Español" title="Español">
          <span class="lang-flag">🇪🇸</span><span class="lang-code">ES</span>
        </button>
        <button class="lang-btn ${currentLang === 'ht' ? 'active' : ''}" data-lang="ht" aria-label="Kreyòl" title="Kreyòl">
          <span class="lang-flag">🇭🇹</span><span class="lang-code">HT</span>
        </button>
      </div>
    `;

    container.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang && lang !== currentLang) {
          setLanguage(lang);
        }
      });
    });
  }

  function updateToggleUI() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === currentLang;
      btn.classList.toggle('active', isActive);
    });
  }

  // ── Auto-inject toggle styles ───────────────────────────────────
  function injectStyles() {
    if (document.getElementById('i18n-toggle-styles')) return;
    const style = document.createElement('style');
    style.id = 'i18n-toggle-styles';
    style.textContent = `
      .lang-toggle-wrapper {
        display: inline-flex;
        gap: 2px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        padding: 3px;
        backdrop-filter: blur(10px);
      }
      .lang-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 10px;
        border: none;
        background: transparent;
        color: rgba(255,255,255,0.6);
        font-family: inherit;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.03em;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.25s ease;
        white-space: nowrap;
      }
      .lang-btn:hover {
        background: rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.9);
      }
      .lang-btn.active {
        background: rgba(255,255,255,0.18);
        color: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      }
      .lang-flag {
        font-size: 0.9rem;
        line-height: 1;
      }
      .lang-code {
        line-height: 1;
      }
      @media (max-width: 640px) {
        .lang-toggle-wrapper {
          padding: 2px;
        }
        .lang-btn {
          padding: 4px 7px;
          font-size: 0.7rem;
        }
        .lang-code {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Initialize ──────────────────────────────────────────────────
  async function init(opts = {}) {
    const { toggleContainerId = 'lang-toggle', basePath } = opts;
    if (basePath) window.__i18nBasePath = basePath;

    injectStyles();

    currentLang = detectLanguage();
    const data = await loadTranslations(currentLang);
    applyTranslations(data);

    // Render toggle if container exists or wait for DOM ready
    if (document.getElementById(toggleContainerId)) {
      renderToggle(toggleContainerId);
    } else {
      document.addEventListener('DOMContentLoaded', () => renderToggle(toggleContainerId));
    }
  }

  // ── Expose API ──────────────────────────────────────────────────
  window.LanguageToggle = {
    init,
    setLanguage,
    getLanguage,
    onChange,
    loadTranslations,
    SUPPORTED_LANGS
  };
})();
