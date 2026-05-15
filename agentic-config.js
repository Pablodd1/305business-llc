// Agentic Website Configuration for 305business.llc
window.AGENTIC_CONFIG = {
  siteId: '305business-llc',
  
  track: {
    searches: true,
    clicks: true,
    scrollDepth: true,
    forms: true,
    timeOnPage: true
  },
  
  optimize: {
    metaTitle: true,
    metaDescription: true,
    ctaButtons: true,
    contentPriority: true,
    schemaOrg: true
  },
  
  targetKeywords: [
    'buy business Miami',
    'sell business Miami',
    'business marketplace',
    'business for sale Florida',
    'Miami business broker',
    'acquire business Miami',
    'business valuation Miami',
    'small business for sale'
  ],
  
  ctaVariants: [
    'List Your Business',
    'Find a Business',
    'Get Valuation',
    'Start Searching',
    'Connect Now'
  ],
  
  schemaTypes: {
    homepage: 'Organization',
    listings: 'ItemList',
    contact: 'ContactPage',
    product: 'Product'
  },
  
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
    }
  ]
};

if (typeof AgenticWebsite !== 'undefined') {
  window.agentic = new AgenticWebsite(window.AGENTIC_CONFIG);
}
