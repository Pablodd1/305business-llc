/**
 * 305business API Client
 * Connects frontend to live Supabase backend
 */

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8087/api' 
  : 'https://api.305business.llc/api';

class BusinessAPI {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getListings(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value);
    });
    
    const response = await fetch(`${this.baseUrl}/listings?${params}`);
    return response.json();
  }

  async getListing(slug) {
    const response = await fetch(`${this.baseUrl}/listings/${slug}`);
    return response.json();
  }

  async createListing(data) {
    const response = await fetch(`${this.baseUrl}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async createInquiry(data) {
    const response = await fetch(`${this.baseUrl}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getCategories() {
    const response = await fetch(`${this.baseUrl}/categories`);
    return response.json();
  }

  async generateSEO(data) {
    const response = await fetch(`${this.baseUrl}/seo/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async createCheckoutSession(plan, email, listingId) {
    const response = await fetch(`${this.baseUrl}/stripe/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, email, listing_id: listingId })
    });
    return response.json();
  }
}

const api = new BusinessAPI();

// ───────────────────────────────────────────────────────────────────────────
// DYNAMIC LISTINGS LOADER
// ───────────────────────────────────────────────────────────────────────────

async function loadListings(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="text-center py-12"><div class="loading-spinner mx-auto"></div><p class="text-gray-500 mt-4">Loading businesses...</p></div>';

  try {
    const result = await api.getListings(options);
    const listings = result.listings || [];

    if (listings.length === 0) {
      container.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">No businesses found matching your criteria.</p></div>';
      return;
    }

    container.innerHTML = listings.map(listing => createListingCard(listing)).join('');
  } catch (error) {
    console.error('Failed to load listings:', error);
    container.innerHTML = '<div class="text-center py-12"><p class="text-red-500">Failed to load listings. Please try again.</p></div>';
  }
}

function createListingCard(listing) {
  const price = listing.asking_price 
    ? `$${listing.asking_price.toLocaleString()}` 
    : 'Contact for Price';
  
  const image = listing.photos && listing.photos.length > 0 
    ? listing.photos[0] 
    : '/305business-logo-transparent.png';

  const featuredBadge = listing.is_featured 
    ? '<span class="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">FEATURED</span>' 
    : '';

  const verifiedBadge = listing.is_verified 
    ? '<span class="text-blue-500" title="Verified"><i class="fas fa-check-circle"></i></span>' 
    : '';

  return `
    <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer" onclick="window.location.href='business-detail.html?id=${listing.id}&slug=${listing.slug}'">
      <div class="relative h-48 overflow-hidden">
        <img src="${image}" alt="${listing.business_name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        ${featuredBadge}
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span class="text-white text-sm font-semibold">${listing.category || 'Business'}</span>
        </div>
      </div>
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-gray-900 line-clamp-1">${listing.business_name} ${verifiedBadge}</h3>
        </div>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${listing.short_description || listing.description?.substring(0, 120) + '...' || 'No description'}</p>
        <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span><i class="fas fa-map-marker-alt mr-1"></i>${listing.location || 'Miami, FL'}</span>
          <span><i class="fas fa-calendar mr-1"></i>Est. ${listing.year_established || 'N/A'}</span>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-100">
          <span class="text-xl font-bold text-blue-900">${price}</span>
          <span class="text-sm text-gray-500">${listing.view_count || 0} views</span>
        </div>
      </div>
    </div>
  `;
}

// ───────────────────────────────────────────────────────────────────────────
// LISTING FORM HANDLER
// ───────────────────────────────────────────────────────────────────────────

async function handleListingSubmit(formData) {
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-spinner mr-2"></span>Submitting...';

  try {
    // Convert form data to API format
    const listingData = {
      business_name: formData.get('business_name'),
      category: formData.get('category'),
      subcategory: formData.get('subcategory'),
      year_established: parseInt(formData.get('year_established')) || null,
      location: formData.get('location'),
      city: formData.get('city') || 'Miami',
      state: formData.get('state') || 'FL',
      zip_code: formData.get('zip_code'),
      description: formData.get('description'),
      asking_price: parseFloat(formData.get('asking_price')) || null,
      annual_revenue: parseFloat(formData.get('annual_revenue')) || null,
      annual_cash_flow: parseFloat(formData.get('annual_cash_flow')) || null,
      inventory_value: parseFloat(formData.get('inventory_value')) || null,
      monthly_rent: parseFloat(formData.get('monthly_rent')) || null,
      lease_terms: formData.get('lease_terms'),
      num_employees: parseInt(formData.get('num_employees')) || null,
      square_footage: parseInt(formData.get('square_footage')) || null,
      revenue_2021: parseFloat(formData.get('revenue_2021')) || null,
      revenue_2022: parseFloat(formData.get('revenue_2022')) || null,
      revenue_2023: parseFloat(formData.get('revenue_2023')) || null,
      revenue_2024: parseFloat(formData.get('revenue_2024')) || null,
      revenue_2025: parseFloat(formData.get('revenue_2025')) || null,
      business_hours: formData.get('business_hours'),
      parking: formData.get('parking'),
      reason_for_selling: formData.get('reason_for_selling'),
      training_transition: formData.get('training_transition'),
      growth_opportunities: formData.get('growth_opportunities'),
      features: formData.getAll('features') || [],
      seller_name: formData.get('seller_name'),
      seller_email: formData.get('seller_email'),
      seller_phone: formData.get('seller_phone'),
      tier: formData.get('tier') || 'free'
    };

    const result = await api.createListing(listingData);

    if (result.success) {
      // Show success modal
      showSuccessModal(result.listing);
      
      // If paid tier, redirect to checkout
      if (result.listing.tier !== 'free') {
        const checkout = await api.createCheckoutSession(
          result.listing.tier + '_monthly',
          result.listing.seller_email,
          result.listing.id
        );
        
        if (checkout.url) {
          setTimeout(() => {
            window.location.href = checkout.url;
          }, 2000);
        }
      }
    } else {
      throw new Error(result.error || 'Failed to create listing');
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Error: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

function showSuccessModal(listing) {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('active');
    modal.querySelector('.success-title').textContent = `${listing.business_name} Listed!`;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// INQUIRY FORM HANDLER
// ───────────────────────────────────────────────────────────────────────────

async function handleInquirySubmit(listingId, formData) {
  try {
    const inquiryData = {
      listing_id: listingId,
      buyer_name: formData.get('buyer_name'),
      buyer_email: formData.get('buyer_email'),
      buyer_phone: formData.get('buyer_phone'),
      buyer_message: formData.get('buyer_message'),
      buyer_budget: parseFloat(formData.get('buyer_budget')) || null,
      buyer_timeline: formData.get('buyer_timeline'),
      buyer_financing: formData.get('buyer_financing')
    };

    const result = await api.createInquiry(inquiryData);

    if (result.success) {
      alert('Inquiry sent successfully! The seller will contact you soon.');
      return true;
    } else {
      throw new Error(result.error || 'Failed to send inquiry');
    }
  } catch (error) {
    console.error('Inquiry error:', error);
    alert('Error: ' + error.message);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// CATEGORY LOADER
// ───────────────────────────────────────────────────────────────────────────

async function loadCategories(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const result = await api.getCategories();
    const categories = result.categories || [];

    container.innerHTML = categories.map(cat => `
      <a href="index.html?category=${encodeURIComponent(cat.name)}" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
        <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <i class="fas fa-${cat.icon || 'business'}"></i>
        </div>
        <div>
          <p class="font-medium text-gray-900">${cat.name}</p>
          <p class="text-sm text-gray-500">${cat.listing_count || 0} listings</p>
        </div>
      </a>
    `).join('');
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// EXPORT
// ───────────────────────────────────────────────────────────────────────────

window.BusinessAPI = api;
window.loadListings = loadListings;
window.loadCategories = loadCategories;
window.handleListingSubmit = handleListingSubmit;
window.handleInquirySubmit = handleInquirySubmit;
