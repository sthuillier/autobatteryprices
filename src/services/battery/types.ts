import { Battery } from '../../types/battery';

export interface BatterySearchParams {
  brand?: string;
  category?: string;
  minAh?: number;
  minCCA?: number;
}

export interface BatterySearchResponse {
  SearchResult?: {
    Items?: any[];
  };
}

export interface BatteryDataExtractor {
  asin: string;
  title: string;
  currentPrice: number;
  bciGroup: string;
  dimensions: string;
  ampHours: number;
  coldCrankingAmps: number;
  crankingAmps: number;
  reserveCapacity: number;
  type: string;
  warrantyYears: number;
}
export interface BatteryDataExtractorRapidApi {
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