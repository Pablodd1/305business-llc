// Agentic Website Configuration for 305business.llc
window.AGENTIC_CONFIG = {
  siteId: '305business-llc',
  version: '2.0',
  
  // API Configuration
  api: {
    enabled: true,
    endpoint: 'https://api.305business.llc',
    fallback: 'localStorage', // Store locally if API fails
    syncInterval: 30000, // Sync every 30 seconds
    batchSize: 10 // Batch events before sending
  },
  
  // Tracking Configuration
  track: {
    searches: true,
    clicks: true,
    scrollDepth: true,
    forms: true,
    timeOnPage: true,
    conversions: true,
    engagement: true,
    heatmap: false // Enable for click heatmaps
  },
  
  // SEO Optimization
  optimize: {
    metaTitle: true,
    metaDescription: true,
    ctaButtons: true,
    contentPriority: true,
    schemaOrg: true,
    dynamicKeywords: true
  },
  
  // Target Keywords for SEO
  targetKeywords: [
    'buy business Miami',
    'sell business Miami',
    'business marketplace',
    'business for sale Florida',
    'Miami business broker',
    'acquire business Miami',
    'business valuation Miami',
    'small business for sale',
    'Miami business acquisition',
    'Florida business listings'
  ],
  
  // CTA Variants for A/B Testing
  ctaVariants: [
    'List Your Business',
    'Find a Business',
    'Get Valuation',
    'Start Searching',
    'Connect Now',
    'Schedule Consultation'
  ],
  
  // Schema.org Types
  schemaTypes: {
    homepage: 'Organization',
    listings: 'ItemList',
    contact: 'ContactPage',
    product: 'Product',
    service: 'Service'
  },
  
  // Social Links (will be injected into schema)
  socialLinks: {
    telegram: 'https://t.me/YourTelegramUsername', // Will be updated with real username
    whatsapp: 'https://wa.me/17866432099',
    instagram: 'https://instagram.com/305business',
    facebook: 'https://facebook.com/305business',
    calendly: 'https://calendly.com/aidynamicpro'
  },
  
  // Contact Information
  contact: {
    phone: '+1 786-643-2099',
    email: 'info@305business.llc',
    address: 'Miami, FL'
  },
  
  // Automation Rules
  rules: [
    {
      condition: 'search_contains("buy" OR "acquire" OR "purchase")',
      action: 'highlight_section: "search"',
      priority: 'high'
    },
    {
      condition: 'search_contains("sell" OR "list" OR "valuation")',
      action: 'highlight_section: "list-business"',
      priority: 'high'
    },
    {
      condition: 'click_rate("pricing") > 0.3',
      action: 'move_section_up: "services"',
      priority: 'medium'
    },
    {
      condition: 'bounce_rate > 0.6',
      action: 'simplify_hero_section',
      priority: 'high'
    },
    {
      condition: 'search_contains("restaurant" OR "cafe" OR "food")',
      action: 'highlight_section: "listings"',
      priority: 'medium'
    },
    {
      condition: 'timeOnPage > 120',
      action: 'show_exit_intent: "schedule_consultation"',
      priority: 'low'
    }
  ],
  
  // Mobile Optimization
  mobile: {
    hamburgerMenu: true,
    stickyCTA: true,
    clickToCall: true,
    simplifiedForms: true
  },
  
  // Performance
  performance: {
    lazyLoadImages: true,
    deferNonCritical: true,
    preloadRoutes: ['list-business.html']
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  if (typeof AgenticWebsiteAPI !== 'undefined') {
    window.agentic = new AgenticWebsiteAPI(window.AGENTIC_CONFIG);
    console.log('🚀 Agentic Website v2.0 initialized');
  }
});
