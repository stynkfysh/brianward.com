// Brian Ward Appraisal - Pricing Module

const pricingData = {
  services: [
    {
      name: 'Standard Appraisal (FNMA 1004)',
      description: 'Full interior and exterior inspection with comparable sales analysis',
      startingPrice: 420,
      turnaround: '5-7 business days',
      recommended: true
    },
    {
      name: 'Consumer Appraisal (FNMA 2055)',
      description: 'Detailed appraisal suitable for various purposes including estate planning',
      startingPrice: 390,
      turnaround: '5-7 business days',
      recommended: false
    },
    {
      name: 'Exterior/Drive-By (FNMA 2005)',
      description: 'Exterior inspection and comparable sales analysis',
      startingPrice: 325,
      turnaround: '3-5 business days',
      recommended: false
    },
    {
      name: 'Desktop Appraisal',
      description: 'Value estimate using publicly available data, no property inspection',
      startingPrice: 325,
      turnaround: '2-3 business days',
      recommended: false
    },
    {
      name: '2-4 Unit Property',
      description: 'Appraisal for multi-unit residential properties',
      startingPrice: 600,
      turnaround: '7-10 business days',
      recommended: false
    }
  ],
  promotions: [
    {
      code: 'BANK50',
      description: 'Bankruptcy appraisals',
      discount: 50,
      type: 'fixed'
    }
  ]
};

/**
 * Render pricing table from data
 * Inserts into element with id="pricing-table"
 */
function renderPricingTable() {
  const container = document.getElementById('pricing-table');
  if (!container) return;

  let html = `
    <table class="pricing-table" role="table">
      <thead>
        <tr>
          <th scope="col">Service Type</th>
          <th scope="col">Description</th>
          <th scope="col">Starting Price</th>
          <th scope="col">Turnaround Time</th>
        </tr>
      </thead>
      <tbody>
  `;

  pricingData.services.forEach(service => {
    const recommendedClass = service.recommended ? 'recommended' : '';
    html += `
      <tr class="${recommendedClass}">
        <td><strong>${service.name}</strong></td>
        <td>${service.description}</td>
        <td>$${service.startingPrice}</td>
        <td>${service.turnaround}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

/**
 * Render promotions from data
 * Inserts into element with id="pricing-promotions"
 */
function renderPromotions() {
  const container = document.getElementById('pricing-promotions');
  if (!container) return;

  if (pricingData.promotions.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  pricingData.promotions.forEach(promo => {
    const discountText = promo.type === 'fixed' 
      ? `$${promo.discount} off` 
      : `${promo.discount}% off`;

    html += `
      <div class="promo-banner">
        <p><strong>${promo.description}</strong></p>
        <p class="promo-code">Code: ${promo.code}</p>
        <p>${discountText}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Get promotion data by code
 */
function getPromotion(code) {
  return pricingData.promotions.find(p => p.code === code.toUpperCase());
}

/**
 * Get service by name
 */
function getService(name) {
  return pricingData.services.find(s => s.name.toLowerCase() === name.toLowerCase());
}

/**
 * Calculate discounted price
 */
function calculateDiscountedPrice(basePrice, promoCode) {
  const promo = getPromotion(promoCode);
  if (!promo) return basePrice;

  if (promo.type === 'fixed') {
    return Math.max(0, basePrice - promo.discount);
  } else if (promo.type === 'percentage') {
    return basePrice * (1 - promo.discount / 100);
  }

  return basePrice;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  renderPricingTable();
  renderPromotions();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    pricingData,
    renderPricingTable,
    renderPromotions,
    getPromotion,
    getService,
    calculateDiscountedPrice
  };
}
