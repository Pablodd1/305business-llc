/* 305business Venture Portfolio — per-company 3-image media registry */
(function (root) {
  const M = {
    'zero-g-simulation': [
      { src: '/images/simulation-data.webp', label: 'MULTI-AGENT FORECASTING ENGINE' },
      { src: '/images/valuation-advisory.webp', label: 'EXECUTIVE SCENARIO MODELING' },
      { src: '/images/ventures-studio.webp', label: 'CORE SIMULATION ARCHITECTURE' }
    ],
    'ai-voice-layer': [
      { src: '/images/voice-ai-desk.webp', label: 'REAL-TIME CONVERSATIONAL VOICE LAYER' },
      { src: '/images/web-growth-factory.webp', label: 'DROP-IN WEBSITE INTEGRATION' },
      { src: '/images/ventures-studio.webp', label: 'BILINGUAL AUDIO PIPELINE' }
    ],
    'hotel-rate-intelligence': [
      { src: '/images/hospitality-commerce-ventures.webp', label: 'HOSPITALITY COMP-SET PRICING' },
      { src: '/images/simulation-data.webp', label: 'AUTOMATED RATE & DEMAND SIGNALS' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'MIAMI BEACH HOSPITALITY MARKET' }
    ],
    'jmm-jas-miami-method': [
      { src: '/images/sports-vision-ventures.webp', label: 'BIOMECHANICS & PERFORMANCE LAB' },
      { src: '/images/rpm-rtm-care.webp', label: 'DAILY WEARABLE BIOMETRIC SYNC' },
      { src: '/images/ventures-studio.webp', label: 'ADAPTIVE COACHING ENGINE' }
    ],
    'estatematch': [
      { src: '/images/real-estate-match.webp', label: 'WATERFRONT BUYER-PROPERTY MATCHING' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'SOUTH FLORIDA REAL ESTATE NETWORK' },
      { src: '/images/valuation-advisory.webp', label: 'DEAL FLOW & ADVISORY WORKSPACE' }
    ],
    'pocketscribe': [
      { src: '/images/healthcare-ai-ventures.webp', label: 'CLINICAL ENCOUNTER INTELLIGENCE' },
      { src: '/images/voice-ai-desk.webp', label: 'AMBIENT VOICE DOCUMENTATION' },
      { src: '/images/ventures-studio.webp', label: 'HIPAA-ALIGNED WORKFLOW ENGINE' }
    ],
    'adaptive-marketplace': [
      { src: '/images/hospitality-commerce-ventures.webp', label: 'INTENT-AWARE COMMERCE EXPERIENCE' },
      { src: '/images/web-growth-factory.webp', label: 'DYNAMIC MERCHANDISING STUDIO' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'MULTI-VENDOR MARKETPLACE SCALE' }
    ],
    'overlay-hd': [
      { src: '/images/dental-ai.webp', label: 'COSMETIC SMILE VISUALIZATION' },
      { src: '/images/healthcare-ai-ventures.webp', label: 'CHAIRSIDE PATIENT CONSULTATION' },
      { src: '/images/spatial-3d-twin.webp', label: 'HIGH-PRECISION FACIAL OVERLAY' }
    ],
    'runform-ai': [
      { src: '/images/sports-vision-ventures.webp', label: 'CAMERA-BASED GAIT BIOMECHANICS' },
      { src: '/images/spatial-3d-twin.webp', label: '3D KINEMATIC JOINT TRACKING' },
      { src: '/images/rpm-rtm-care.webp', label: 'ATHLETE RECOVERY TELEMETRY' }
    ],
    'clinical-movement-intelligence': [
      { src: '/images/rpm-rtm-care.webp', label: 'NEURO & REHAB MOVEMENT ASSESSMENT' },
      { src: '/images/sports-vision-ventures.webp', label: 'VISION-BASED MOTION ANALYSIS' },
      { src: '/images/healthcare-ai-ventures.webp', label: 'CLINICAL OUTCOME REPORTING' }
    ],
    'website-factory': [
      { src: '/images/web-growth-factory.webp', label: 'AUTOMATED LEAD-TO-SITE DEPLOYMENT' },
      { src: '/images/ventures-studio.webp', label: 'MULTI-CLIENT TEMPLATE ENGINE' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'LOCAL SMB DIGITAL LAUNCHES' }
    ],
    'dental-ehr': [
      { src: '/images/dental-ai.webp', label: 'MODERN DENTAL PRACTICE SUITE' },
      { src: '/images/healthcare-ai-ventures.webp', label: 'AI CHARTING & CLINICAL WORKFLOWS' },
      { src: '/images/voice-ai-desk.webp', label: 'FRONT-DESK PATIENT INTAKE' }
    ],
    'room-defect-intelligence': [
      { src: '/images/spatial-3d-twin.webp', label: 'AI VISUAL ROOM INSPECTION' },
      { src: '/images/hospitality-commerce-ventures.webp', label: 'HOTEL & SHORT-TERM RENTAL TURNOVER' },
      { src: '/images/real-estate-match.webp', label: 'PROPERTY DAMAGE DOCUMENTATION' }
    ],
    'rpm-platform': [
      { src: '/images/rpm-rtm-care.webp', label: 'CONNECTED HOME VITALS SENSORS' },
      { src: '/images/healthcare-ai-ventures.webp', label: 'CARE TEAM ESCALATION DASHBOARD' },
      { src: '/images/simulation-data.webp', label: 'LONGITUDINAL PATIENT TRENDS' }
    ],
    'three-d-spatial-intelligence': [
      { src: '/images/spatial-3d-twin.webp', label: 'CAMERA-BASED 3D DIGITAL TWINS' },
      { src: '/images/real-estate-match.webp', label: 'ARCHITECTURAL FLOORPLAN MAPPING' },
      { src: '/images/ventures-studio.webp', label: 'SPATIAL RECONSTRUCTION PIPELINE' }
    ],
    'ai-voice-receptionist': [
      { src: '/images/voice-ai-desk.webp', label: '24/7 BILINGUAL FRONT-DESK AI' },
      { src: '/images/healthcare-ai-ventures.webp', label: 'CLINIC & SERVICE CALL TRIAGE' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'MIAMI MULTI-LANGUAGE OPERATIONS' }
    ],
    'cycling-fit-intelligence': [
      { src: '/images/sports-vision-ventures.webp', label: 'ROAD, TRIATHLON & TT BIKE FIT' },
      { src: '/images/spatial-3d-twin.webp', label: 'AERO POSTURE & ANGLE GEOMETRY' },
      { src: '/images/simulation-data.webp', label: 'POWER & BIOMECHANIC OPTIMIZATION' }
    ],
    'rtm-platform': [
      { src: '/images/rpm-rtm-care.webp', label: 'HOME THERAPEUTIC MONITORING' },
      { src: '/images/sports-vision-ventures.webp', label: 'MSK ADHERENCE & EXERCISE TRACKING' },
      { src: '/images/healthcare-ai-ventures.webp', label: 'REHAB CLINIC BILLING & OUTCOMES' }
    ],
    'intelligent-crm': [
      { src: '/images/web-growth-factory.webp', label: 'AI-CONNECTED PIPELINE WORKSPACE' },
      { src: '/images/valuation-advisory.webp', label: 'DEAL FORECASTING & FOLLOW-UPS' },
      { src: '/images/voice-ai-desk.webp', label: 'OMNICHANNEL LEAD CAPTURE' }
    ],
    'agentic-websites': [
      { src: '/images/web-growth-factory.webp', label: 'INTENT-RESPONSIVE WEB ARCHITECTURE' },
      { src: '/images/ventures-studio.webp', label: 'AUTONOMOUS CONVERSION FLOWS' },
      { src: '/images/simulation-data.webp', label: 'LIVE FUNNEL ADAPTATION' }
    ],
    'ai-chatbots': [
      { src: '/images/voice-ai-desk.webp', label: 'CONTEXT-AWARE OPERATIONS ASSISTANTS' },
      { src: '/images/web-growth-factory.webp', label: 'EMBEDDED WEB & SUPPORT WIDGETS' },
      { src: '/images/ventures-studio.webp', label: 'KNOWLEDGE-GROUNDED AUTOMATION' }
    ],
    'ai-market-intelligence': [
      { src: '/images/simulation-data.webp', label: 'AUTOMATED COMPETITIVE INTELLIGENCE' },
      { src: '/images/valuation-advisory.webp', label: 'EXECUTIVE DECISION BRIEFINGS' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'SECTOR & REGIONAL SIGNAL TRACKING' }
    ],
    'revenue-cycle-intelligence': [
      { src: '/images/healthcare-ai-ventures.webp', label: 'MEDICAL BILLING & CODING QA' },
      { src: '/images/simulation-data.webp', label: 'DENIAL PATTERN & ERA ANALYTICS' },
      { src: '/images/valuation-advisory.webp', label: 'PRACTICE COLLECTIONS RECOVERY' }
    ],
    'seo-aeo-engine': [
      { src: '/images/web-growth-factory.webp', label: 'TECHNICAL SEO & ANSWER-ENGINE OPS' },
      { src: '/images/simulation-data.webp', label: 'AI CITATION & SEARCH VISIBILITY' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'LOCAL & ORGANIC DEMAND GROWTH' }
    ],
    'rapid-digital-launch': [
      { src: '/images/web-growth-factory.webp', label: 'HIGH-SPEED BUSINESS WEB LAUNCH' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'MIAMI SMB DIGITAL STOREFRONTS' },
      { src: '/images/ventures-studio.webp', label: 'TURNKEY DEPLOYMENT STACK' }
    ],
    'maca-locator': [
      { src: '/images/maca-auto.webp', label: 'MOBILE AUTO & ROADSIDE DISPATCH' },
      { src: '/images/marketplace-hero.webp?v=2', label: 'SOUTH FLORIDA COVERAGE NETWORK' },
      { src: '/images/voice-ai-desk.webp', label: 'AI TRIAGE & LIVE TECHNICIAN ROUTING' }
    ]
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = M;
  if (root) root.VENTURE_MEDIA = M;
})(typeof window !== 'undefined' ? window : null);
