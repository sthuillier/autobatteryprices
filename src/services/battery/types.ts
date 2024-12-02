import { Battery } from '../../types/battery';

export interface BatterySearchParams {
  group?: string;
  type?: string;
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