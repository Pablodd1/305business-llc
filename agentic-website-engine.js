// Agentic Website Engine for 305business.llc
class AgenticWebsite {
  constructor(config) {
    this.config = config;
    this.data = {
      searches: [],
      clicks: [],
      scrollDepth: 0,
      forms: [],
      timeOnPage: 0
    };
    this.init();
  }

  init() {
    this.trackSearches();
    this.trackClicks();
    this.trackScroll();
    this.trackForms();
    this.trackTime();
    this.applyRules();
    this.optimizeSEO();
  }

  trackSearches() {
    const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
    searchInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.data.searches.push({
          term: e.target.value,
          timestamp: Date.now()
        });
      });
    });
  }

  trackClicks() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, [onclick]');
      if (target) {
        this.data.clicks.push({
          element: target.tagName,
          text: target.textContent?.trim(),
          href: target.href || null,
          timestamp: Date.now()
        });
      }
    });
  }

  trackScroll() {
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      this.data.scrollDepth = Math.max(this.data.scrollDepth, scrollPercent);
    });
  }

  trackForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const formData = new FormData(form);
        this.data.forms.push({
          fields: Array.from(formData.keys()),
          timestamp: Date.now()
        });
      });
    });
  }

  trackTime() {
    const startTime = Date.now();
    setInterval(() => {
      this.data.timeOnPage = (Date.now() - startTime) / 1000;
    }, 1000);
  }

  applyRules() {
    if (!this.config.rules) return;
    
    this.config.rules.forEach(rule => {
      if (this.evaluateCondition(rule.condition)) {
        this.executeAction(rule.action);
      }
    });
  }

  evaluateCondition(condition) {
    // Simple condition evaluation
    if (condition.includes('search_contains')) {
      const terms = condition.match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) || [];
      return this.data.searches.some(s => 
        terms.some(t => s.term.toLowerCase().includes(t.toLowerCase()))
      );
    }
    return false;
  }

  executeAction(action) {
    if (action.includes('highlight_section')) {
      const section = action.match(/"([^"]+)"/)?.[1];
      if (section) {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  optimizeSEO() {
    // Update meta tags based on config
    if (this.config.optimize?.metaTitle) {
      const title = document.querySelector('title');
      if (title && this.config.targetKeywords?.length) {
        title.textContent = `${title.textContent} | ${this.config.targetKeywords[0]}`;
      }
    }

    // Add schema.org markup
    if (this.config.optimize?.schemaOrg) {
      this.addSchemaMarkup();
    }
  }

  addSchemaMarkup() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': this.config.schemaTypes?.homepage || 'Organization',
      name: '305business.llc',
      url: 'https://305business.llc',
      description: 'Miami Business Marketplace - Buy and Sell Businesses',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

// Auto-initialize if config exists
if (window.AGENTIC_CONFIG) {
  window.agentic = new AgenticWebsite(window.AGENTIC_CONFIG);
}
