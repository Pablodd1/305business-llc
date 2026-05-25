// Agentic Website Configuration for 305business.llc
window.AGENTIC_CONFIG = {
  siteId: '305business-llc',
  version: '2.0',
  
  // API Configuration
  api: {
    enabled: true,
    endpoint: 'https://api.305business.llc',
    fallback: 'localStorage',
    syncInterval: 30000,
    batchSize: 10
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
    heatmap: false
  },
  
  // SEO Optimization
  optimize: {
    metaTitle: true,
    metaDescription: true,
    ctaButtons: true,
    contentPriority: true,
    schemaOrg: true,
    dynamicKeywords: true,
    abTesting: true
  },
  
  // Target Keywords
  keywords: {
    primary: [
      'buy business miami',
      'sell business miami',
      'business broker florida',
      'business valuation miami',
      'business for sale florida',
      'miami business marketplace',
      'buy restaurant miami',
      'sell healthcare practice',
      'business acquisition florida',
      '305business'
    ],
    secondary: [
      'miami business broker',
      'florida business for sale',
      'business transfer miami',
      'sell my business florida'
    ],
    longTail: [
      'how to sell a restaurant in miami',
      'business valuation services south florida',
      'confidential business sale miami'
    ]
  },
  
  // Target Locations
  locations: ['Miami', 'Miami-Dade', 'Broward', 'Palm Beach', 'South Florida', 'Fort Lauderdale'],
  
  // Languages
  languages: ['English', 'Spanish', 'Russian', 'Haitian Creole'],
  
  // Conversion Tracking
  conversions: {
    goals: [
      'business_listing_submission',
      'buyer_inquiry',
      'broker_match_request',
      'valuation_request',
      'demo_request'
    ],
    values: {
      business_listing_submission: 50,
      buyer_inquiry: 25,
      broker_match_request: 75,
      valuation_request: 100,
      demo_request: 30
    }
  },
  
  // A/B Testing Configuration
  abTesting: {
    enabled: true,
    variants: {
      cta: [
        'List Your Business',
        'Browse Listings',
        'Get Valuation',
        'Find a Broker',
        'Contact Us'
      ],
      headline: [
        'Miami\'s Premier Business Marketplace',
        'Buy or Sell a Miami Business',
        'Your Business Transaction Partner'
      ]
    }
  },
  
  // Schema.org Configuration
  schema: {
    types: {
      homepage: 'Organization',
      services: 'Service',
      about: 'Organization',
      contact: 'ContactPage'
    },
    organization: {
      name: '305business.llc',
      url: 'https://305business.llc',
      logo: 'https://305business.llc/305business-logo-transparent.png',
      description: 'Miami\'s premier business marketplace'
    }
  },
  
  // AI Search Optimization (Google May 2026)
  aiOptimization: {
    generateCitations: true,
    trackFeaturedSnippets: true,
    monitorAIPresence: true,
    contentFreshness: 7,
    structuredDataPriority: ['Organization', 'Service', 'FAQPage']
  },
  
  // Content Strategy
  content: {
    blogEnabled: true,
    autoGenerate: false,
    freshnessDays: 14,
    categories: ['Market Updates', 'Business Tips', 'Success Stories', 'Legal Guides']
  },
  
  // Analytics Integration
  analytics: {
    googleAnalytics: 'G-PLACEHOLDER',
    googleTagManager: null,
    facebookPixel: null,
    customEvents: true
  },
  
  // Performance Monitoring
  performance: {
    trackCoreWebVitals: true,
    trackPageSpeed: true,
    alertThreshold: 3000 // Alert if page load > 3s
  }
};
