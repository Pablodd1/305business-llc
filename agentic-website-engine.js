// Agentic Website API Backend for 305business.llc
// This connects the client-side tracker to a real backend

const API_BASE = 'https://api.305business.llc';
const API_KEY = localStorage.getItem('agentic_api_key') || '';

class AgenticWebsiteAPI {
  constructor(config) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.data = {
      searches: [],
      clicks: [],
      scrollDepth: 0,
      forms: [],
      timeOnPage: 0,
      conversions: []
    };
    this.init();
  }

  generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  init() {
    this.trackSearches();
    this.trackClicks();
    this.trackScroll();
    this.trackForms();
    this.trackTime();
    this.trackConversions();
    this.applyRules();
    this.optimizeSEO();
    this.startHeartbeat();
  }

  // Send data to backend API
  async sendToAPI(endpoint, payload) {
    try {
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
          'X-Session-ID': this.sessionId
        },
        body: JSON.stringify({
          ...payload,
          timestamp: Date.now(),
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        })
      });
      return await response.json();
    } catch (error) {
      console.warn('Agentic API error:', error);
      // Fallback: store locally
      this.storeLocally(endpoint, payload);
      return null;
    }
  }

  storeLocally(endpoint, payload) {
    const key = `agentic_${endpoint}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...payload, storedAt: Date.now() });
    localStorage.setItem(key, JSON.stringify(existing.slice(-100))); // Keep last 100
  }

  trackSearches() {
    const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
    searchInputs.forEach(input => {
      let debounceTimer;
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (e.target.value.length > 2) {
            const searchData = {
              term: e.target.value,
              element: e.target.name || e.target.id || 'unknown',
              timestamp: Date.now()
            };
            this.data.searches.push(searchData);
            this.sendToAPI('searches', searchData);
          }
        }, 500);
      });
    });
  }

  trackClicks() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, [onclick], .cta-btn, .schematic-btn');
      if (target) {
        const clickData = {
          element: target.tagName,
          text: target.textContent?.trim().substring(0, 100),
          href: target.href || null,
          className: target.className,
          id: target.id,
          timestamp: Date.now(),
          position: {
            x: e.clientX,
            y: e.clientY
          }
        };
        this.data.clicks.push(clickData);
        this.sendToAPI('clicks', clickData);

        // Track conversion if it's a CTA
        if (target.classList.contains('cta-btn') || 
            target.classList.contains('schematic-btn') ||
            target.textContent.includes('LIST BUSINESS') ||
            target.textContent.includes('SEARCH') ||
            target.textContent.includes('MATCH')) {
          this.trackConversion('cta_click', clickData);
        }
      }
    });
  }

  trackScroll() {
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      maxScroll = Math.max(maxScroll, scrollPercent);
      this.data.scrollDepth = maxScroll;
    });

    // Send scroll depth every 10 seconds
    setInterval(() => {
      if (this.data.scrollDepth > 0) {
        this.sendToAPI('engagement', {
          scrollDepth: this.data.scrollDepth,
          timeOnPage: this.data.timeOnPage
        });
      }
    }, 10000);
  }

  trackForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const formData = new FormData(form);
        const fields = {};
        for (let [key, value] of formData.entries()) {
          fields[key] = value.substring(0, 100); // Truncate for privacy
        }
        
        const formPayload = {
          formId: form.id || 'unknown',
          formAction: form.action || window.location.href,
          fields: Object.keys(fields), // Only send field names, not values
          timestamp: Date.now()
        };
        
        this.data.forms.push(formPayload);
        this.sendToAPI('forms', formPayload);
        this.trackConversion('form_submission', formPayload);
      });
    });
  }

  trackTime() {
    const startTime = Date.now();
    const interval = setInterval(() => {
      this.data.timeOnPage = (Date.now() - startTime) / 1000;
      
      // Track engagement milestones
      const time = this.data.timeOnPage;
      if (time === 30 || time === 60 || time === 120 || time === 300) {
        this.trackConversion('engagement_milestone', { seconds: time });
      }
    }, 1000);

    // Send final data on page unload
    window.addEventListener('beforeunload', () => {
      this.sendToAPI('session', {
        duration: this.data.timeOnPage,
        scrollDepth: this.data.scrollDepth,
        clicks: this.data.clicks.length,
        searches: this.data.searches.length,
        forms: this.data.forms.length
      });
    });
  }

  trackConversions() {
    // Track page view as conversion
    this.trackConversion('page_view', {
      page: window.location.pathname,
      referrer: document.referrer
    });
  }

  trackConversion(type, data) {
    const conversion = {
      type,
      data,
      timestamp: Date.now(),
      value: this.calculateConversionValue(type, data)
    };
    this.data.conversions.push(conversion);
    this.sendToAPI('conversions', conversion);
  }

  calculateConversionValue(type, data) {
    const values = {
      'page_view': 1,
      'cta_click': 5,
      'form_submission': 25,
      'engagement_milestone': 10,
      'search': 3,
      'listing_view': 8
    };
    return values[type] || 1;
  }

  startHeartbeat() {
    // Send heartbeat every 30 seconds to keep session alive
    setInterval(() => {
      this.sendToAPI('heartbeat', {
        timeOnPage: this.data.timeOnPage,
        scrollDepth: this.data.scrollDepth,
        active: document.visibilityState === 'visible'
      });
    }, 30000);
  }

  applyRules() {
    if (!this.config.rules) return;
    
    this.config.rules.forEach(rule => {
      if (this.evaluateCondition(rule.condition)) {
        this.executeAction(rule.action, rule.priority);
      }
    });
  }

  evaluateCondition(condition) {
    if (condition.includes('search_contains')) {
      const terms = condition.match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) || [];
      return this.data.searches.some(s => 
        terms.some(t => s.term.toLowerCase().includes(t.toLowerCase()))
      );
    }
    if (condition.includes('click_rate')) {
      const rate = parseFloat(condition.match(/[\d.]+/)?.[0] || 0);
      return (this.data.clicks.length / this.data.timeOnPage) > rate;
    }
    if (condition.includes('bounce_rate')) {
      const threshold = parseFloat(condition.match(/[\d.]+/)?.[0] || 0);
      return this.data.scrollDepth < threshold;
    }
    return false;
  }

  executeAction(action, priority) {
    if (action.includes('highlight_section')) {
      const section = action.match(/"([^"]+)"/)?.[1];
      if (section) {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          el.classList.add('agentic-highlight');
          setTimeout(() => el.classList.remove('agentic-highlight'), 3000);
        }
      }
    }
    if (action.includes('move_section_up')) {
      const section = action.match(/"([^"]+)"/)?.[1];
      if (section) {
        const el = document.getElementById(section);
        if (el && el.parentNode) {
          el.parentNode.insertBefore(el, el.parentNode.firstChild);
        }
      }
    }
    if (action.includes('simplify_hero_section')) {
      document.body.classList.add('agentic-simplified');
    }
  }

  optimizeSEO() {
    // Update meta tags dynamically based on user behavior
    if (this.config.optimize?.metaTitle) {
      const title = document.querySelector('title');
      if (title && this.data.searches.length > 0) {
        const lastSearch = this.data.searches[this.data.searches.length - 1].term;
        title.textContent = `${lastSearch} - Business For Sale Miami | 305business.llc`;
      }
    }

    // Add schema.org markup
    if (this.config.optimize?.schemaOrg) {
      this.addSchemaMarkup();
    }

    // Dynamic meta description based on popular searches
    if (this.config.optimize?.metaDescription && this.data.searches.length > 2) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const topSearches = this.data.searches
          .slice(-5)
          .map(s => s.term)
          .join(', ');
        metaDesc.content = `Find businesses for sale in Miami. Popular searches: ${topSearches}. 305business.llc - Miami's premier business marketplace.`;
      }
    }
  }

  addSchemaMarkup() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '305business.llc',
      url: 'https://305business.llc',
      description: 'Miami Business Marketplace - Buy and Sell Businesses',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-786-643-2099',
        contactType: 'sales',
        availableLanguage: ['English', 'Spanish']
      },
      sameAs: [
        'https://t.me/YourTelegramUsername', // Will be updated
        'https://instagram.com/305business',
        'https://facebook.com/305business'
      ]
    };

    // Remove existing schema
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // Public API methods
  getAnalytics() {
    return {
      sessionId: this.sessionId,
      timeOnPage: this.data.timeOnPage,
      scrollDepth: this.data.scrollDepth,
      clicks: this.data.clicks.length,
      searches: this.data.searches,
      forms: this.data.forms.length,
      conversions: this.data.conversions,
      conversionValue: this.data.conversions.reduce((sum, c) => sum + c.value, 0)
    };
  }

  exportData() {
    return JSON.stringify(this.data, null, 2);
  }
}

// Auto-initialize if config exists
if (window.AGENTIC_CONFIG) {
  window.agentic = new AgenticWebsiteAPI(window.AGENTIC_CONFIG);
  
  // Expose to console for debugging
  window.getAgenticAnalytics = () => window.agentic.getAnalytics();
  window.exportAgenticData = () => window.agentic.exportData();
}
