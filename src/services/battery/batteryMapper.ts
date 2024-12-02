import { Battery } from '../../types/battery';
import { BatteryDataExtractor } from './types';
import { amazonConfig } from '../../config/amazon';

export function mapToBattery(data: BatteryDataExtractor, asin: string): Battery {
  return {
    asin: String(data.asin || ''),
    title: String(data.title || ''),
    price: Number(data.currentPrice || 0),
    bciGroup: String(data.bciGroup || ''),
    dimensions: String(data.dimensions || ''),
    ampHours: Number(data.ampHours || 0),
    coldCrankingAmps: Number(data.coldCrankingAmps || 0),
    crankingAmps: Number(data.crankingAmps || 0),
    reserveCapacity: Number(data.reserveCapacity || 0),
    type: String(data.type || ''),
    warrantyYears: Number(data.warrantyYears || 0),
    affiliateLink: `https://www.amazon.com/dp/${asin}?tag=${amazonConfig.partnerTag}`
  };
}