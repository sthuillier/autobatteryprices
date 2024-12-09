import { Battery } from '../../types/battery';
import { BatteryDataExtractor, BatteryDataExtractorRapidApi } from './types';
import { amazonConfig } from '../../config/amazon';

const warrantyRegex = /(\d+)\sMonths\sWarranty/;
const capacityRegex = /(\d+)(ah)/;
const groupRegex = /BCI Group (\d+)/;
const reserveRegex = /(\d+)(RC)/;
const typeRegex = /(\w+)\sBattery/;
const ccaRegex = /(\d+)(CCA|CA)/;

export function mapToBattery(data: BatteryDataExtractorRapidApi, asin: string): Battery {
  return {
    asin: String(data.asin || ''),
    title: String(data.product_title || ''),
    price: Number(data.product_price.replace('$', '') || 0),
    bciGroup: String((data.product_title.match(groupRegex) || [])[1] || ''),
    dimensions: String((data.product_title.match(reserveRegex) || [])[1] || ''),
    ampHours: Number((data.product_title.match(capacityRegex) || [])[1] || 0),
    coldCrankingAmps: Number((data.product_title.match(ccaRegex) || [])[1] || 0),
    crankingAmps: Number((data.product_title.match(ccaRegex) || [])[1] || 0),
    reserveCapacity: Number((data.product_title.match(capacityRegex) || [])[1] || 0),
    type: String((data.product_title.match(typeRegex) || [])[1] || ''),
    warrantyYears: Number((data.product_title.match(warrantyRegex) || [])[1] || 0) / 12,
    affiliateLink: data.product_url
  };
}