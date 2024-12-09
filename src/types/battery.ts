export interface Battery {
  asin: string;
  price: number;
  bciGroup: string;
  dimensions: string;
  ampHours: number;
  coldCrankingAmps: number;
  crankingAmps: number;
  reserveCapacity: number;
  type: string;
  affiliateLink: string;
  title: string;
  warrantyYears: number;
  priceHistory?: Array<{
    price: number;
    date: Date;
  }>;
}