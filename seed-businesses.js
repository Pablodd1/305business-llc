const SUPABASE_URL = 'https://uakiregrnzcwuwqjkaxr.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2lyZWdybnpjd3V3cWprYXhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA2MDczNywiZXhwIjoyMDk1NjM2NzM3fQ.7wTezXqO9IYYKxa2HLJXkRdcFvOEr_DctcsoNTgQnN8';

const businesses = [
  {
    slug: "el-palacio-restaurant-lounge",
    name: "El Palacio Restaurant & Lounge",
    category: "restaurant",
    description: "Established Cuban restaurant in the heart of Little Havana. 120 seats, full liquor license, live music venue on weekends. Family-owned for 18 years. Loyal customer base with 4.7 stars on Google.",
    asking_price: 485000,
    annual_revenue: 1200000,
    cash_flow: 185000,
    employee_count: 14,
    year_established: 2006,
    address: "1528 SW 8th St",
    city: "Miami",
    state: "FL",
    zip: "33135",
    square_footage: 3400,
    features: ["liquor_license","real_estate","established_clients","website"],
    equipment_included: '["real_estate","equipment","liquor_license","website","social_media"]',
    reason_for_selling: "retirement",
    lease_terms: "Property included - owner financing available",
    status: "active",
    featured: true,
    view_count: 142,
    inquiry_count: 8,
    seller_name: "Roberto Garcia",
    seller_email: "rgarcia@email.com"
  },
  {
    slug: "wynwood-art-gallery-event-space",
    name: "Wynwood Art Gallery & Event Space",
    category: "retail",
    description: "Prime Wynwood location with 20ft street frontage. Gallery hosts 12+ exhibitions annually plus private events (corporate, weddings). Strong Instagram following (45K). Lease through 2028.",
    asking_price: 395000,
    annual_revenue: 580000,
    cash_flow: 125000,
    employee_count: 3,
    year_established: 2015,
    address: "250 NW 24th St",
    city: "Miami",
    state: "FL",
    zip: "33127",
    square_footage: 2800,
    features: ["established_clients","social_media","website"],
    equipment_included: '["equipment","social_media","website"]',
    reason_for_selling: "new-venture",
    lease_terms: "$8,400/mo - NNN, through March 2028, 3% annual increases",
    status: "active",
    featured: true,
    view_count: 89,
    inquiry_count: 5,
    seller_name: "Cassandra Mills",
    seller_email: "cmills@email.com"
  },
  {
    slug: "brickell-financial-advisory",
    name: "Brickell Financial Advisory",
    category: "service",
    description: "Boutique CPA and financial planning firm serving 180+ clients. Specializes in medical practices and real estate investors. 3 full-time accountants, 2 part-time. Cloud-based workflow (QuickBooks, Xero).",
    asking_price: 650000,
    annual_revenue: 890000,
    cash_flow: 220000,
    employee_count: 5,
    year_established: 2012,
    address: "801 Brickell Ave, Suite 900",
    city: "Miami",
    state: "FL",
    zip: "33131",
    square_footage: 1800,
    features: ["established_clients","website","trademarks"],
    equipment_included: '["equipment","website"]',
    reason_for_selling: "relocation",
    lease_terms: "Office share agreement - flexible terms",
    status: "active",
    featured: false,
    view_count: 56,
    inquiry_count: 3,
    seller_name: "David Chen",
    seller_email: "dchen@email.com"
  },
  {
    slug: "coral-gables-dental-practice",
    name: "Coral Gables Dental Practice",
    category: "healthcare",
    description: "6-chair general dentistry practice with 2,400 active patients. Digital X-ray, intraoral scanners, CAD/CAM system. Hygiene program generates 40% of revenue. Turnkey for new dentist or DSO acquisition.",
    asking_price: 1200000,
    annual_revenue: 1850000,
    cash_flow: 420000,
    employee_count: 8,
    year_established: 2008,
    address: "370 Minorca Ave",
    city: "Coral Gables",
    state: "FL",
    zip: "33134",
    square_footage: 3200,
    features: ["real_estate","equipment","established_clients","website"],
    equipment_included: '["real_estate","equipment","established_clients","website"]',
    reason_for_selling: "retirement",
    lease_terms: "Property included in sale",
    status: "active",
    featured: true,
    view_count: 203,
    inquiry_count: 12,
    seller_name: "Dr. Maria Santos",
    seller_email: "msantos@email.com"
  },
  {
    slug: "south-beach-boutique-hotel",
    name: "South Beach Boutique Hotel",
    category: "hospitality",
    description: "18-room Art Deco boutique hotel on Collins Ave. Renovated 2021. 85% annual occupancy, $210 ADR. Breakfast service, rooftop bar (underutilized - growth opportunity). Strong TripAdvisor presence.",
    asking_price: 3200000,
    annual_revenue: 1380000,
    cash_flow: 380000,
    employee_count: 12,
    year_established: 1995,
    address: "1410 Collins Ave",
    city: "Miami Beach",
    state: "FL",
    zip: "33139",
    square_footage: 8500,
    features: ["real_estate","liquor_license","website","social_media"],
    equipment_included: '["real_estate","equipment","liquor_license","website","social_media"]',
    reason_for_selling: "new-venture",
    lease_terms: "Property included",
    status: "active",
    featured: true,
    view_count: 178,
    inquiry_count: 9,
    seller_name: "Antonio Ricci",
    seller_email: "aricci@email.com"
  },
  {
    slug: "doral-auto-repair-body-shop",
    name: "Doral Auto Repair & Body Shop",
    category: "automotive",
    description: "Full-service auto repair with 4 bays, 2 body shop stalls, and paint booth. Fleet contracts with 3 local delivery companies. I-CAR certified. Owner manages, doesn't turn wrenches.",
    asking_price: 275000,
    annual_revenue: 680000,
    cash_flow: 95000,
    employee_count: 6,
    year_established: 2011,
    address: "7950 NW 53rd St",
    city: "Doral",
    state: "FL",
    zip: "33166",
    square_footage: 4200,
    features: ["equipment","established_clients","website"],
    equipment_included: '["equipment","established_clients","website"]',
    reason_for_selling: "relocation",
    lease_terms: "$5,200/mo - industrial zone, through 2026",
    status: "active",
    featured: false,
    view_count: 67,
    inquiry_count: 4,
    seller_name: "Jorge Mendez",
    seller_email: "jmendez@email.com"
  },
  {
    slug: "north-miami-gym-wellness",
    name: "North Miami Gym & Wellness Center",
    category: "fitness",
    description: "8,500 sq ft gym with 340 active memberships ($49-$89/mo). Includes yoga studio, personal training, and nutrition counseling. Brand new equipment (2023). Strong retention (78%).",
    asking_price: 425000,
    annual_revenue: 520000,
    cash_flow: 110000,
    employee_count: 7,
    year_established: 2017,
    address: "12990 Biscayne Blvd",
    city: "North Miami",
    state: "FL",
    zip: "33181",
    square_footage: 8500,
    features: ["equipment","established_clients","website","social_media"],
    equipment_included: '["equipment","established_clients","website","social_media"]',
    reason_for_selling: "health",
    lease_terms: "$12,000/mo - retail space, through 2027",
    status: "active",
    featured: false,
    view_count: 94,
    inquiry_count: 6,
    seller_name: "Tanya Williams",
    seller_email: "twilliams@email.com"
  },
  {
    slug: "little-havana-bakery-cafe",
    name: "Little Havana Bakery & Café",
    category: "restaurant",
    description: "Corner bakery famous for pastelitos and cafecito. Wholesale accounts with 8 local restaurants and 2 supermarkets. Opens 5 AM, closes 4 PM. Cash business with strong margins.",
    asking_price: 195000,
    annual_revenue: 380000,
    cash_flow: 78000,
    employee_count: 4,
    year_established: 2014,
    address: "835 SW 16th Ave",
    city: "Miami",
    state: "FL",
    zip: "33135",
    square_footage: 1200,
    features: ["equipment","established_clients","website"],
    equipment_included: '["equipment","established_clients","website"]',
    reason_for_selling: "retirement",
    lease_terms: "$3,800/mo - corner retail, through 2026",
    status: "active",
    featured: false,
    view_count: 112,
    inquiry_count: 7,
    seller_name: "Isabella Rodriguez",
    seller_email: "irodriguez@email.com"
  }
];

async function seed() {
  let created = 0, failed = 0;
  for (const biz of businesses) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(biz)
      });
      if (res.ok) {
        console.log(`✅ ${biz.name}`);
        created++;
      } else {
        const err = await res.text();
        console.error(`❌ ${biz.name}: ${err}`);
        failed++;
      }
    } catch (e) {
      console.error(`❌ ${biz.name}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\nDone: ${created} created, ${failed} failed`);
}

seed();
