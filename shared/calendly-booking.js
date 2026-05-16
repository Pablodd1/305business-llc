/**
 * Calendly Inline Booking — Shared Module
 * Embeds Calendly inline, pre-fills user info, tracks conversions.
 * Usage:
 *   <div id="calendly-embed"></div>
 *   <script>CalendlyBooking.init({ username: 'aidynamicpro', containerId: 'calendly-embed' });</script>
 */
(function() {
  'use strict';

  const CALENDLY_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';
  let scriptLoaded = false;
  let initQueue = [];

  function loadScript() {
    if (scriptLoaded) return Promise.resolve();
    if (document.querySelector('script[src*="calendly.com/assets/external/widget"]')) {
      scriptLoaded = true;
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      script.onload = () => { scriptLoaded = true; resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function buildUrl(username, opts = {}) {
    const params = new URLSearchParams();
    if (opts.hideEventTypeDetails) params.set('hide_event_type_details', '1');
    if (opts.hideLandingPageDetails) params.set('hide_landing_page_details', '1');
    if (opts.primaryColor) params.set('primary_color', opts.primaryColor.replace('#', ''));
    if (opts.backgroundColor) params.set('background_color', opts.backgroundColor.replace('#', ''));
    if (opts.textColor) params.set('text_color', opts.textColor.replace('#', ''));

    // Pre-fill: read from localStorage if user previously filled a form
    const prefill = opts.prefill || {};
    if (prefill.name) params.set('name', prefill.name);
    if (prefill.email) params.set('email', prefill.email);

    const query = params.toString();
    return `https://calendly.com/${username}/${opts.eventType || ''}${query ? '?' + query : ''}`;
  }

  function embedCalendly(container, url) {
    container.innerHTML = `
      <div class="calendly-inline-widget"
           data-url="${url}"
           style="min-width:320px; height:700px;"></div>
    `;
    if (window.Calendly) {
      window.Calendly.initInlineWidget({
        url,
        parentElement: container.querySelector('.calendly-inline-widget'),
        prefill: {},
        utm: {}
      });
    } else {
      // Widget.js auto-initializes on DOM ready; if already loaded, trigger manually
      initQueue.push(() => {
        if (window.Calendly) {
          window.Calendly.initInlineWidget({
            url,
            parentElement: container.querySelector('.calendly-inline-widget'),
            prefill: {},
            utm: {}
          });
        }
      });
    }
  }

  function trackConversion(eventName, data = {}) {
    // Hook into agentic engine if available
    if (window.AgenticEngine && typeof window.AgenticEngine.track === 'function') {
      window.AgenticEngine.track('calendly_' + eventName, data);
    }
    // Also push to standard analytics
    if (window.gtag) {
      window.gtag('event', 'calendly_' + eventName, data);
    }
    if (window.fbq) {
      window.fbq('trackCustom', 'CalendlyBooking', { event_name: eventName, ...data });
    }
    console.log('[CalendlyBooking] Track:', eventName, data);
  }

  // ── Poll for Calendly booking completion ─────────────────────────
  function pollBookingStatus(container, onBooked) {
    let attempts = 0;
    const maxAttempts = 120; // ~2 minutes
    const interval = setInterval(() => {
      attempts++;
      const iframe = container.querySelector('iframe');
      if (!iframe) {
        if (attempts >= maxAttempts) clearInterval(interval);
        return;
      }
      // Heuristic: Calendly changes URL path on confirmation
      const src = iframe.src || '';
      if (src.includes('/confirm') || src.includes('/thanks') || src.includes('event_scheduled')) {
        clearInterval(interval);
        trackConversion('booked', { url: src });
        if (typeof onBooked === 'function') onBooked();
      }
      if (attempts >= maxAttempts) clearInterval(interval);
    }, 1000);
  }

  // ── Open as popup (fallback) ─────────────────────────────────────
  function openPopup(username, opts = {}) {
    const url = buildUrl(username, opts);
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
      trackConversion('popup_opened', { username });
    } else {
      window.open(url, '_blank', 'width=1000,height=800,noopener');
    }
  }

  // ── Main init ────────────────────────────────────────────────────
  async function init(opts = {}) {
    const {
      username = 'aidynamicpro',
      containerId = 'calendly-embed',
      eventType = '',
      prefill = {},
      onBooked,
      colors = {},
      style = {}
    } = opts;

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`[CalendlyBooking] Container #${containerId} not found.`);
      return;
    }

    // Auto-read prefill from localStorage if available
    const storedPrefill = JSON.parse(localStorage.getItem('calendly_prefill') || '{}');
    const mergedPrefill = { ...storedPrefill, ...prefill };

    const url = buildUrl(username, {
      eventType,
      hideEventTypeDetails: true,
      hideLandingPageDetails: false,
      primaryColor: colors.primary || '#3b82f6',
      backgroundColor: colors.background || '#0a0e1a',
      textColor: colors.text || '#e2e8f0',
      prefill: mergedPrefill
    });

    // Inject custom styles for the container
    if (!document.getElementById('calendly-custom-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'calendly-custom-styles';
      styleEl.textContent = `
        .calendly-container {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: ${style.background || 'rgba(10,14,26,0.8)'};
        }
        .calendly-container iframe {
          border: none;
          width: 100% !important;
          height: 700px !important;
        }
        .calendly-inline-widget {
          min-width: 320px;
          height: 700px;
        }
        @media (max-width: 768px) {
          .calendly-container iframe,
          .calendly-inline-widget {
            height: 600px !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
    }

    container.classList.add('calendly-container');

    await loadScript();
    embedCalendly(container, url);
    trackConversion('embed_loaded', { username, eventType });

    // Poll for booking
    pollBookingStatus(container, onBooked);

    // Flush queue
    initQueue.forEach(fn => fn());
    initQueue = [];
  }

  // ── Store prefill for later ──────────────────────────────────────
  function storePrefill(data) {
    localStorage.setItem('calendly_prefill', JSON.stringify(data));
  }

  // ── Expose API ──────────────────────────────────────────────────
  window.CalendlyBooking = {
    init,
    openPopup,
    storePrefill,
    trackConversion,
    buildUrl
  };
})();
