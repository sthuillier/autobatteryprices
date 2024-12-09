interface AmazonItem {
  ASIN: string;
  ItemInfo?: {
    Title?: {
      DisplayValue?: string;
    };
    Features?: {
      DisplayValues?: string[];
    };
    TechnicalDetails?: {
      DisplayValues?: Array<{
        Name?: string;
        Value?: string;
      }>;
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        Amount?: number;
      };
    }>;
  };
}

export interface RapidApiProduct {
  asin: string;
  product_title: string;
  product_price: string;
  product_original_price: string;
  currency: string;
  product_star_rating: string;
  product_num_ratings: number;
  product_url: string;
  product_photo: string;
  product_num_offers: number;
  product_minimum_offer_price: string;
  is_best_seller: boolean;
  is_amazon_choice: boolean;
  is_prime: boolean;
  climate_pledge_friendly: boolean;
  sales_volume: string;
  delivery: string;
  has_variations: boolean;
}


export function extractBatteryData(item: AmazonItem) {
  const features = item.ItemInfo?.Features?.DisplayValues || [];
  const technicalDetails = item.ItemInfo?.TechnicalDetails?.DisplayValues || [];
  const featureText = features.join(' ').toLowerCase();
  const specs = Object.fromEntries(
    technicalDetails.map(detail => [
      detail.Name?.toLowerCase() || '',
      detail.Value || ''
    ])
  );

  return {
    asin: item.ASIN,
    title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Battery',
    currentPrice: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
    bciGroup: extractBCIGroup(featureText, specs),
    dimensions: extractDimensions(featureText, specs),
    ampHours: extractAmpHours(featureText, specs),
    coldCrankingAmps: extractCCA(featureText, specs),
    crankingAmps: extractCA(featureText, specs),
    reserveCapacity: extractReserveCapacity(featureText, specs),
    type: extractBatteryType(featureText, specs),
    warrantyYears: extractWarranty(featureText, specs)
  };
}

function extractBCIGroup(text: string, specs: Record<string, string>): string {
  // Check technical details first
  const groupSpec = specs['group size'] || specs['bci group'];
  if (groupSpec) {
    const match = groupSpec.match(/(\d+)/);
    if (match) return match[1];
  }

  // Fall back to feature text
  const match = text.match(/group\s*(\d+)/i);
  return match ? match[1] : '24';
}

function extractDimensions(text: string, specs: Record<string, string>): string {
  // Check technical details first
  const dimensions = specs['dimensions'] || specs['size'];
  if (dimensions) {
    const match = dimensions.match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/);
    if (match) return `${match[1]}x${match[2]}x${match[3]}`;
  }

  // Fall back to feature text
  const match = text.match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*mm/i);
  return match ? `${match[1]}x${match[2]}x${match[3]}` : '242x175x190';
}

function extractAmpHours(text: string, specs: Record<string, string>): number {
  // Check technical details first
  const ahSpec = specs['amp hours'] || specs['capacity'];
  if (ahSpec) {
    const match = ahSpec.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  // Fall back to feature text
  const match = text.match(/(\d+)\s*[Aa]h/);
  return match ? parseInt(match[1], 10) : 60;
}

function extractCCA(text: string, specs: Record<string, string>): number {
  // Check technical details first
  const ccaSpec = specs['cold cranking amps'] || specs['cca'];
  if (ccaSpec) {
    const match = ccaSpec.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  // Fall back to feature text
  const match = text.match(/(\d+)\s*CCA/i);
  return match ? parseInt(match[1], 10) : 650;
}

function extractCA(text: string, specs: Record<string, string>): number {
  // Check technical details first
  const caSpec = specs['cranking amps'] || specs['ca'];
  if (caSpec) {
    const match = caSpec.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  // Fall back to feature text
  const match = text.match(/(\d+)\s*CA/i);
  return match ? parseInt(match[1], 10) : 810;
}

function extractReserveCapacity(text: string, specs: Record<string, string>): number {
  // Check technical details first
  const rcSpec = specs['reserve capacity'] || specs['rc'];
  if (rcSpec) {
    const match = rcSpec.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  // Fall back to feature text
  const match = text.match(/(\d+)\s*min/i);
  return match ? parseInt(match[1], 10) : 100;
}

function extractBatteryType(text: string, specs: Record<string, string>): string {
  // Check technical details first
  const typeSpec = specs['battery type'] || specs['technology'];
  if (typeSpec) {
    const type = typeSpec.toLowerCase();
    if (type.includes('agm')) return 'AGM';
    if (type.includes('efb')) return 'EFB';
    if (type.includes('lead')) return 'Lead Acid';
  }

  // Fall back to feature text
  text = text.toLowerCase();
  if (text.includes('agm')) return 'AGM';
  if (text.includes('efb')) return 'EFB';
  return 'Lead Acid';
}

function extractWarranty(text: string, specs: Record<string, string>): number {
  // Check technical details first
  const warrantySpec = specs['warranty'] || specs['warranty period'];
  if (warrantySpec) {
    const match = warrantySpec.match(/(\d+)[\s-]*year/i);
    if (match) return parseInt(match[1], 10);
  }

  // Fall back to feature text
  const match = text.match(/(\d+)[\s-]*year/i);
  return match ? parseInt(match[1], 10) : 3;
}